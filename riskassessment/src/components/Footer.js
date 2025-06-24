import React from 'react';

const Footer = () => (
  <footer className="bg-gradient-to-r from-indigo-800 to-purple-800 text-white py-10 mt-auto">
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">AI-Powered Risk Assessment</h3>
                <p className="text-indigo-200 mt-1">Secure. Reliable. Intelligent.</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <a href="/" className="text-white hover:text-indigo-200 transition-colors">Terms of Service</a>
            <a href="/" className="text-white hover:text-indigo-200 transition-colors">Privacy Policy</a>
            <a href="/" className="text-white hover:text-indigo-200 transition-colors">Contact Us</a>
          </div>
        </div>
        <div className="border-t border-white/20 mt-6 pt-6 text-center text-indigo-200 text-sm">
          © {new Date().getFullYear()} AI Risk Assessment Tool. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
