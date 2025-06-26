from flask import Blueprint, request, jsonify, current_app
import datetime
import os
from werkzeug.utils import secure_filename
from utils import (
    extract_text_from_pdf, extract_text_from_docx, extract_text_from_txt, extract_text_from_pptx,
    analyze_risks_with_groq, parse_risk_reports, calculate_rpn_and_suggest_fixes, standardize_severity, calculate_overall_risk, history_collection
)

risk_bp = Blueprint('risk_bp', __name__)

@risk_bp.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    if not file.filename.lower().endswith(('.pdf', '.docx', '.txt', '.ppt', '.pptx')):
        return jsonify({"error": "Unsupported file format. Please upload a PDF, DOCX, TXT, or PPT/PPTX file."}), 400
    filename = secure_filename(file.filename)
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)
    file_extension = filename.split('.')[-1].lower()
    extracted_text = None
    if file_extension == "pdf":
        extracted_text = extract_text_from_pdf(file_path)
    elif file_extension == "docx":
        extracted_text = extract_text_from_docx(file_path)
    elif file_extension == "txt":
        extracted_text = extract_text_from_txt(file_path)
    elif file_extension in ["ppt", "pptx"]:
        extracted_text = extract_text_from_pptx(file_path)
    os.remove(file_path)
    if not extracted_text:
        return jsonify({"error": "Failed to extract text from the document"}), 500
    user_id = request.headers.get('User-ID')
    if not user_id:
        return jsonify({"error": "User ID is required to associate the upload with a user."}), 400
    risk_report = analyze_risks_with_groq(extracted_text)
    if not risk_report:
        return jsonify({"error": "Failed to generate risk assessment report"}), 500
    risk_items = parse_risk_reports(risk_report)
    risk_items = calculate_rpn_and_suggest_fixes(risk_items)
    for item in risk_items:
        if "RiskSeverity" in item:
            item["RiskSeverity"] = standardize_severity(item["RiskSeverity"])
    overall_level, summary = calculate_overall_risk(risk_items)
    history_entry = {
        "user_id": user_id,
        "file_name": filename,
        "description": f"Uploaded {filename} for risk analysis.",
        "upload_date": datetime.datetime.now(),
        "risk_summary": {
            "level": overall_level,
            "summary": ", ".join(summary),
            "details": risk_items
        }
    }
    history_collection.insert_one(history_entry)
    return jsonify({"success": True, "risk_items": risk_items})

@risk_bp.route('/api/history', methods=['GET'])
def get_user_history():
    user_id = request.headers.get('User-ID')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    history = history_collection.find({"user_id": user_id})
    history_data = [
        {
            "file_name": entry.get("file_name", ""),
            "description": entry.get("description", ""),
            "upload_date": entry.get("upload_date", ""),
            "risk_summary": entry.get("risk_summary", {})
        }
        for entry in history
    ]
    return jsonify({"success": True, "history": history_data})

@risk_bp.route('/api/history', methods=['DELETE'])
def delete_history_item():
    user_id = request.headers.get('User-ID')
    file_name = request.json.get('file_name')
    if not user_id or not file_name:
        return jsonify({"error": "User ID and file name are required"}), 400
    result = history_collection.delete_one({"user_id": user_id, "file_name": file_name})
    if result.deleted_count == 1:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": "Document not found"}), 404

@risk_bp.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "alive"})
