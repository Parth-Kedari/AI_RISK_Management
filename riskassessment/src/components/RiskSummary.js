const RiskSummary = ({ total, critical, high, medium, low }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm p-5 text-center transform transition-transform hover:scale-105 duration-200">
        <div className="flex justify-center mb-3">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
        </div>
        <p className="text-gray-700 text-lg font-medium">Total Risks</p>
        <p className="text-4xl font-bold mt-3 text-indigo-700">{total}</p>
      </div>
      
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl shadow-sm p-5 text-center transform transition-transform hover:scale-105 duration-200">
        <div className="flex justify-center mb-3">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        </div>
        <p className="text-red-600 text-lg font-medium">Critical Risks</p>
        <p className="text-4xl font-bold mt-3 text-red-700">{critical}</p>
      </div>
      
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-sm p-5 text-center transform transition-transform hover:scale-105 duration-200">
        <div className="flex justify-center mb-3">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>
        <p className="text-orange-600 text-lg font-medium">High Risks</p>
        <p className="text-4xl font-bold mt-3 text-orange-700">{high}</p>
      </div>
      
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-sm p-5 text-center transform transition-transform hover:scale-105 duration-200">
        <div className="flex justify-center mb-3">
          <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="16" />
              <line x1="12" y1="8" x2="12" y2="12" />
            </svg>
          </div>
        </div>
        <p className="text-yellow-600 text-lg font-medium">Medium Risks</p>
        <p className="text-4xl font-bold mt-3 text-yellow-700">{medium}</p>
      </div>
      
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm p-5 text-center transform transition-transform hover:scale-105 duration-200">
        <div className="flex justify-center mb-3">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>
        <p className="text-green-600 text-lg font-medium">Low Risks</p>
        <p className="text-4xl font-bold mt-3 text-green-700">{low}</p>
      </div>
    </div>
  );
};

export default RiskSummary;