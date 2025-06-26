import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaFileAlt, FaExclamationTriangle, FaInfoCircle, FaShieldAlt, FaCog, FaUsers, FaClipboardList } from 'react-icons/fa';
import { API_BASE_URL } from '../endpoints/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const user = localStorage.getItem('user');
        const userId = user ? JSON.parse(user).id : null;

        if (!userId) {
          toast.error('User not logged in. Please log in to view your history.');
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/history`, {
          headers: { 'User-ID': userId },
        });

        if (response.data.success) {
          setHistory(response.data.history);
        } else {
          toast.error('Failed to fetch history.');
        }
      } catch (error) {
        console.error('Error fetching history:', error);
        toast.error('An error occurred while fetching your history.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  };
  return new Date(dateString).toLocaleString('en-IN', options);
};


  const getRiskLevelStyle = (riskLevel) => {
    if (!riskLevel) return { color: "text-gray-500", bg: "bg-gray-100" };
    
    const level = riskLevel.toLowerCase();
    if (level.includes("critical")) return { color: "text-red-800", bg: "bg-red-100", border: "border-red-200" };
    if (level.includes("high")) return { color: "text-red-700", bg: "bg-red-50", border: "border-red-200" };
    if (level.includes("medium")) return { color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200" };
    if (level.includes("low")) return { color: "text-green-700", bg: "bg-green-50", border: "border-green-200" };
    return { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" };
  };

  const getSeverityIcon = (severity) => {
    if (!severity) return <FaInfoCircle className="text-gray-500" />;
    const level = severity.toLowerCase();
    if (level.includes("critical")) return <FaExclamationTriangle className="text-red-600" />;
    if (level.includes("high")) return <FaExclamationTriangle className="text-red-500" />;
    if (level.includes("medium")) return <FaExclamationTriangle className="text-yellow-500" />;
    if (level.includes("low")) return <FaInfoCircle className="text-green-500" />;
    return <FaInfoCircle className="text-blue-500" />;
  };

  const RiskDetailCard = ({ risk, index }) => {
    const severityStyle = getRiskLevelStyle(risk.RiskSeverity);
    
    return (
      <div className={`p-4 rounded-lg border-2 ${severityStyle.bg} ${severityStyle.border} mb-4`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            {getSeverityIcon(risk.RiskSeverity)}
            <h4 className={`ml-2 font-semibold text-lg ${severityStyle.color}`}>
              {risk.RiskName || `Risk ${index + 1}`}
            </h4>
          </div>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityStyle.bg} ${severityStyle.color} border ${severityStyle.border}`}>
              {risk.RiskSeverity || 'Unknown'}
            </span>
            {risk.RiskCategory && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200`}>
                {risk.RiskCategory}
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <span className="font-medium text-gray-600 w-20">Probability:</span>
              <span className="text-gray-800">{risk.Probability || 'Not specified'}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="font-medium text-gray-600 w-20">Impact:</span>
              <span className="text-gray-800">{risk.Impact || 'Not specified'}</span>
            </div>
            {risk.RPN && (
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-600 w-20">RPN Score:</span>
                <span className={`font-bold ${risk.RPN > 125 ? 'text-red-600' : risk.RPN > 50 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {risk.RPN}
                </span>
              </div>
            )}
          </div>
        </div>

        {risk.RiskDescription && (
          <div className="mb-4">
            <h5 className="font-medium text-gray-700 mb-2 flex items-center">
              <FaFileAlt className="mr-2 text-indigo-600" />
              Description
            </h5>
            <p className="text-sm text-gray-700 bg-white bg-opacity-50 p-3 rounded border">
              {risk.RiskDescription}
            </p>
          </div>
        )}

        {risk.SecurityImplications && risk.SecurityImplications !== "None" && (
          <div className="mb-4">
            <h5 className="font-medium text-gray-700 mb-2 flex items-center">
              <FaShieldAlt className="mr-2 text-red-600" />
              Security Implications
            </h5>
            <p className="text-sm text-gray-700 bg-white bg-opacity-50 p-3 rounded border">
              {risk.SecurityImplications}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {risk.TechnicalMitigation && (
            <div>
              <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                <FaCog className="mr-2 text-blue-600" />
                Technical Mitigation
              </h5>
              <p className="text-sm text-gray-700 bg-white bg-opacity-50 p-3 rounded border">
                {risk.TechnicalMitigation}
              </p>
            </div>
          )}

          {risk.NonTechnicalMitigation && (
            <div>
              <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                <FaUsers className="mr-2 text-green-600" />
                Process Mitigation
              </h5>
              <p className="text-sm text-gray-700 bg-white bg-opacity-50 p-3 rounded border">
                {risk.NonTechnicalMitigation}
              </p>
            </div>
          )}
        </div>

        {risk.ContingencyPlan && (
          <div className="mt-4">
            <h5 className="font-medium text-gray-700 mb-2 flex items-center">
              <FaClipboardList className="mr-2 text-purple-600" />
              Contingency Plan
            </h5>
            <p className="text-sm text-gray-700 bg-white bg-opacity-50 p-3 rounded border">
              {risk.ContingencyPlan}
            </p>
          </div>
        )}

        {risk.SuggestedFix && risk.SuggestedFix !== "No immediate action required." && (
          <div className="mt-4">
            <h5 className="font-medium text-gray-700 mb-2 flex items-center">
              <FaExclamationTriangle className="mr-2 text-orange-600" />
              Recommended Actions
            </h5>
            <div className="text-sm text-gray-700 bg-white bg-opacity-50 p-3 rounded border">
              {risk.SuggestedFix.split('\n').map((line, idx) => (
                line.trim() && (
                  <div key={idx} className="mb-1">
                    {line.trim().startsWith('-') || line.trim().startsWith('•') || /^\d+\./.test(line.trim()) 
                      ? line 
                      : `• ${line}`}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleDelete = async (item, index) => {
    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user).id : null;
    if (!userId) {
      toast.error('User not logged in.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this document from your history?')) return;
    
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/history`, {
        headers: { 'User-ID': userId },
        data: { file_name: item.file_name }
      });
      if (response.data.success) {
        toast.success('Document deleted from history.');
        setHistory((prev) => prev.filter((h, i) => i !== index));
      } else {
        toast.error(response.data.error || 'Failed to delete document.');
      }
    } catch (error) {
      toast.error('Error deleting document.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-3xl font-bold text-indigo-800 mb-2">Document Analysis History</h2>
        <p className="text-indigo-600">Review your previous document uploads and risk assessments</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-indigo-600">Loading your history...</div>
        </div>
      ) : history.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-1">
          {history.map((item, index) => {
            const riskStyle = getRiskLevelStyle(item.risk_summary?.level);
            const riskDetails = item.risk_summary?.details || [];

            return (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-700 to-purple-700 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white truncate">{item.file_name}</h3>
                  <button
                    onClick={() => handleDelete(item, index)}
                    className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    title="Delete from history"
                  >
                    Delete
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <FaCalendarAlt className="mr-2" />
                    <span>{formatDate(item.upload_date)}</span>
                  </div>
                  
                  {item.description && (
                    <div className="mb-4">
                      <div className="flex items-center mb-1">
                        <FaFileAlt className="mr-2 text-indigo-600" />
                        <span className="font-medium text-indigo-600">Document Description</span>
                      </div>
                      <p className="text-gray-700 pl-6">{item.description}</p>
                    </div>
                  )}
                  
                  {item.risk_summary && (
                    <div>
                      <div className="flex items-center mb-2">
                        <FaExclamationTriangle className="mr-2 text-indigo-600" />
                        <span className="font-medium text-indigo-600">Risk Assessment Overview</span>
                      </div>
                      
                      <div className={`${riskStyle.bg} ${riskStyle.color} px-4 py-3 rounded-lg mb-3 border-2 ${riskStyle.border}`}>
                        <div className="font-medium">Overall Risk Level: {item.risk_summary.level || "Not specified"}</div>
                        {item.risk_summary.summary && (
                          <div className="text-sm mt-1">Summary: {item.risk_summary.summary}</div>
                        )}
                        {Array.isArray(riskDetails) && (
                          <div className="text-sm mt-2">
                            <strong>Total Risks Identified:</strong> {riskDetails.length}
                          </div>
                        )}
                      </div>
                      
                      {Array.isArray(riskDetails) && riskDetails.length > 0 && (
                        <details className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                          <summary className="cursor-pointer px-4 py-3 text-indigo-700 font-medium hover:bg-gray-100 border-b border-gray-200">
                            View Detailed Risk Analysis ({riskDetails.length} risks found)
                          </summary>
                          <div className="p-4 max-h-96 overflow-y-auto">
                            {riskDetails.map((risk, riskIndex) => (
                              <RiskDetailCard key={riskIndex} risk={risk} index={riskIndex} />
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 shadow-md text-center border border-gray-100">
          <FaInfoCircle className="text-4xl text-indigo-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Documents Found</h3>
          <p className="text-gray-600">You haven't uploaded any documents for analysis yet.</p>
          <button 
            onClick={() => window.location.href = '/upload'}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors"
          >
            Upload Your First Document
          </button>
        </div>
      )}
    </div>
  );
};

export default History;