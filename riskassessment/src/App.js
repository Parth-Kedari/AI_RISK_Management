import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import routes from './routes';

function App() {
  // Move dashboard-related state here
  const [riskItems, setRiskItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ToastContainer 
          position="top-right" 
          autoClose={5000} 
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          {routes.map((route, idx) => (
            <Route 
              key={route.path}
              path={route.path}
              element={route.element({
                riskItems,
                setRiskItems,
                isLoading,
                setIsLoading,
                uploadedFileName,
                setUploadedFileName
              })}
            />
          ))}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;