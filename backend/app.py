import os
import logging
from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from auth import auth
from endpoints.risk_routes import risk_bp
from flask_jwt_extended import JWTManager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "https://ai-risk-management-tdk7.onrender.com"]) 

app.register_blueprint(auth, url_prefix='/api/auth')
app.register_blueprint(risk_bp)

# JWT setup for RS256 (load keys from environment variables, not files)
app.config["JWT_ALGORITHM"] = os.getenv("JWT_ALGORITHM", "RS256")
app.config["JWT_PRIVATE_KEY"] = os.getenv("JWT_PRIVATE_KEY")
app.config["JWT_PUBLIC_KEY"] = os.getenv("JWT_PUBLIC_KEY")
jwt = JWTManager(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
mongo_db = client.PassionInfotech  

@app.route('/')
def index():
    return "AI Risk Management Backend is running."

if __name__ == "__main__":
    app.run(debug=True, port=5001)