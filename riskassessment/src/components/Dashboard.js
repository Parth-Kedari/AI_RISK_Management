import React from 'react';
import FileUpload from './FileUpload';
import RiskDashboard from './RiskDashboard';

const Dashboard = ({ riskItems, setRiskItems, isLoading, setIsLoading, uploadedFileName, setUploadedFileName }) => (
  <main className="container mx-auto px-4 py-8">
    <div className="max-w-6xl mx-auto">
      <FileUpload 
        setRiskItems={setRiskItems} 
        isLoading={isLoading} 
        setIsLoading={setIsLoading}
        setUploadedFileName={setUploadedFileName}
      />
      {riskItems.length > 0 && (
        <RiskDashboard 
          riskItems={riskItems}
          fileName={uploadedFileName}
        />
      )}
      {!isLoading && riskItems.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-indigo-100 hover:shadow-lg transition-all duration-300">
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1v-3a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Upload a Document to Get Started</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your PDF, DOCX, or TXT file to analyze potential security risks. 
            Our AI-powered tool will scan your document and provide a detailed risk assessment report.
          </p>
        </div>
      )}
    </div>
  </main>
);

export default Dashboard;