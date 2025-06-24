import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FaCloudUploadAlt, FaFileAlt, FaTrashAlt, FaFilePdf, FaFileWord, FaFileAlt as FaTextFile } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const FileUpload = ({ setRiskItems, isLoading, setIsLoading, setUploadedFileName }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(file.type)) {
        toast.error('Please upload a PDF, DOCX, TXT, PPT, or PPTX file.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(file.type)) {
        toast.error('Please upload a PDF, DOCX, TXT, PPT, or PPTX file.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') {
      return <FaFilePdf className="text-red-500 text-5xl mb-3" />;
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return <FaFileWord className="text-blue-500 text-5xl mb-3" />;
    } else if (fileType === 'application/vnd.ms-powerpoint' || fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      return <FaFileAlt className="text-orange-500 text-5xl mb-3" />;
    } else {
      return <FaTextFile className="text-yellow-500 text-5xl mb-3" />;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    // Retrieve the user ID from localStorage
    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user).id : null;

    if (!userId) {
      toast.error('User ID is missing. Please log in again.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'User-ID': userId, // Include User-ID in the headers
        },
      });

      if (response.data.success) {
        setRiskItems(response.data.risk_items);
        setUploadedFileName(selectedFile.name);
        toast.success('Risk assessment completed successfully!');
      } else {
        toast.error('Failed to process the document.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error.response?.data?.error || 'An error occurred while processing the file.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-md mr-3 flex items-center justify-center">
          <FaCloudUploadAlt className="text-white text-xl" />
        </div>
        Upload Your Document
      </h2>
      
      <div 
        className={`border-2 ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-dashed border-gray-300'} 
                    rounded-xl p-10 text-center cursor-pointer transition-all duration-300 transform ${isDragging ? 'scale-102' : 'hover:bg-gray-50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          onChange={handleFileChange}
          accept=".pdf,.docx,.txt,.ppt,.pptx" 
        />
        
        {selectedFile ? (
          <div className="flex flex-col items-center py-4">
            <div className="mb-3 bg-gray-50 rounded-full p-3 shadow-sm">
              {getFileIcon(selectedFile.type)}
            </div>
            <p className="text-xl font-medium mb-2 text-gray-800">{selectedFile.name}</p>
            <p className="text-sm text-gray-500 mb-4">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="flex items-center text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <FaTrashAlt className="mr-2" /> Remove File
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-10">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-8 rounded-full mb-6">
              <FaCloudUploadAlt className="text-6xl text-indigo-600" />
            </div>
            <p className="text-xl font-medium mb-2 text-gray-800">
              Drag & drop your file here
            </p>
            <p className="text-sm text-gray-500 mb-6">
              or click to browse from your computer
            </p>
            <div className="flex space-x-6 mb-4">
              <div className="text-center">
                <div className="bg-red-100 p-4 rounded-lg mb-2 mx-auto shadow-sm hover:shadow transition-shadow duration-200">
                  <FaFilePdf className="text-red-500 text-xl mx-auto" />
                </div>
                <p className="text-xs text-gray-600">PDF</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-lg mb-2 mx-auto shadow-sm hover:shadow transition-shadow duration-200">
                  <FaFileWord className="text-blue-500 text-xl mx-auto" />
                </div>
                <p className="text-xs text-gray-600">DOCX</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 p-4 rounded-lg mb-2 mx-auto shadow-sm hover:shadow transition-shadow duration-200">
                  <FaFileAlt className="text-orange-500 text-xl mx-auto" />
                </div>
                <p className="text-xs text-gray-600">PPT/PPTX</p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-100 p-4 rounded-lg mb-2 mx-auto shadow-sm hover:shadow transition-shadow duration-200">
                  <FaTextFile className="text-yellow-500 text-xl mx-auto" />
                </div>
                <p className="text-xs text-gray-600">TXT</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          className={`flex items-center justify-center px-8 py-4 rounded-lg font-medium text-lg ${
            !selectedFile || isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:-translate-y-1'
          } transition-all duration-300 w-full md:w-auto`}
        >
          {isLoading ? (
            <>
              <ClipLoader size={24} color="white" className="mr-3" />
              Analyzing Document...
            </>
          ) : (
            'Start Risk Analysis'
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;