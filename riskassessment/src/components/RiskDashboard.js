import React, { useState, useMemo } from 'react';
import { FaFileExcel, FaFileCode, FaSearch, FaSlidersH, FaTimes, FaShieldAlt } from 'react-icons/fa';
import RiskCard from './RiskCard';
import RiskSummary from './RiskSummary';
import RiskCharts from './RiskCharts';
import * as XLSX from 'xlsx';

// Severity configuration with colors and icons
const SEVERITY_CONFIG = {
  Critical: { 
    color: 'red', 
    bgColor: 'bg-red-50', 
    textColor: 'text-red-700', 
    borderColor: 'border-red-200',
    activeClass: 'bg-red-600 text-white shadow-lg shadow-red-200',
    inactiveClass: 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
  },
  High: { 
    color: 'orange', 
    bgColor: 'bg-orange-50', 
    textColor: 'text-orange-700', 
    borderColor: 'border-orange-200',
    activeClass: 'bg-orange-600 text-white shadow-lg shadow-orange-200',
    inactiveClass: 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
  },
  Medium: { 
    color: 'yellow', 
    bgColor: 'bg-yellow-50', 
    textColor: 'text-yellow-700', 
    borderColor: 'border-yellow-200',
    activeClass: 'bg-yellow-600 text-white shadow-lg shadow-yellow-200',
    inactiveClass: 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
  },
  Low: { 
    color: 'green', 
    bgColor: 'bg-green-50', 
    textColor: 'text-green-700', 
    borderColor: 'border-green-200',
    activeClass: 'bg-green-600 text-white shadow-lg shadow-green-200',
    inactiveClass: 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
  },
  Unknown: { 
    color: 'gray', 
    bgColor: 'bg-gray-50', 
    textColor: 'text-gray-700', 
    borderColor: 'border-gray-200',
    activeClass: 'bg-gray-600 text-white shadow-lg shadow-gray-200',
    inactiveClass: 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
  }
};

const RiskDashboard = ({ riskItems, fileName }) => {
  const [selectedSeverity, setSelectedSeverity] = useState(Object.keys(SEVERITY_CONFIG));
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Memoized calculations for better performance
  const { severityCounts, categories, filteredRisks } = useMemo(() => {
    // Calculate severity counts and extract categories
    const counts = Object.keys(SEVERITY_CONFIG).reduce((acc, severity) => ({ ...acc, [severity]: 0 }), {});
    const categorySet = new Set();
    
    riskItems.forEach(item => {
      const severity = item.RiskSeverity || 'Unknown';
      if (counts.hasOwnProperty(severity)) {
        counts[severity]++;
      }
      
      if (item.RiskCategory) {
        categorySet.add(item.RiskCategory);
      }
    });
    
    // Filter risks
    const filtered = riskItems.filter(item => {
      const severityMatch = selectedSeverity.includes(item.RiskSeverity || 'Unknown');
      const categoryMatch = selectedCategories.length === 0 || 
                           selectedCategories.includes(item.RiskCategory || 'Uncategorized');
      const searchMatch = !searchQuery || 
                        [item.RiskName, item.RiskDescription, item.RiskID]
                          .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return severityMatch && categoryMatch && searchMatch;
    });
    
    return {
      severityCounts: counts,
      categories: Array.from(categorySet).sort(),
      filteredRisks: filtered
    };
  }, [riskItems, selectedSeverity, selectedCategories, searchQuery]);
  
  // Toggle functions
  const toggleSeverity = (severity) => {
    setSelectedSeverity(prev => 
      prev.includes(severity) 
        ? prev.filter(s => s !== severity)
        : [...prev, severity]
    );
  };
  
  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedSeverity(Object.keys(SEVERITY_CONFIG));
    setSelectedCategories([]);
    setSearchQuery('');
  };
  
  // Download functions
  const downloadFile = (data, filename, type) => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const downloadReport = () => {
    const jsonString = JSON.stringify(riskItems, null, 2);
    downloadFile(jsonString, `risk_report_${fileName || 'export'}.json`, 'application/json');
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(riskItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Risk Assessment');
    XLSX.writeFile(workbook, `risk_report_${fileName || 'export'}.xlsx`);
  };
  
  // Filter button component
  const FilterButton = ({ value, isSelected, onClick, config, count }) => (
    <button
      onClick={() => onClick(value)}
      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
        isSelected ? config.activeClass : config.inactiveClass
      }`}
    >
      {value}{count !== undefined && ` (${count})`}
    </button>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Risk Assessment Dashboard
                </h1>
                {fileName && (
                  <p className="text-gray-600 mt-1 text-lg">Analysis: {fileName}</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={downloadExcel}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <FaFileExcel />
                Export Excel
              </button>
              <button 
                onClick={downloadReport}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <FaFileCode />
                Export JSON
              </button>
            </div>
          </div>
          
          {/* Risk Summary */}
          <div className="mt-8">
            <RiskSummary 
              total={riskItems.length}
              critical={severityCounts.Critical}
              high={severityCounts.High}
              medium={severityCounts.Medium}
              low={severityCounts.Low}
            />
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-lg" />
              </div>
              <input
                type="text"
                placeholder="Search by risk name, ID, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 w-full border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <FaTimes className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                  showFilters 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaSlidersH />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              
              {(selectedSeverity.length < Object.keys(SEVERITY_CONFIG).length || 
                selectedCategories.length > 0 || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all duration-200 font-medium"
                >
                  <FaTimes />
                  Clear All
                </button>
              )}
            </div>
          </div>
          
          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-gradient-to-r from-gray-50 to-indigo-50/50 rounded-xl p-6 border border-gray-200/50">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Severity Filters */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    Filter by Severity
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(SEVERITY_CONFIG).map(([severity, config]) => (
                      <FilterButton
                        key={severity}
                        value={severity}
                        isSelected={selectedSeverity.includes(severity)}
                        onClick={toggleSeverity}
                        config={config}
                        count={severityCounts[severity]}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Category Filters */}
                {categories.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      Filter by Category
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                            selectedCategories.includes(category)
                              ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Results Counter */}
          <div className="mt-6 flex items-center justify-between">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-lg">
              <span className="text-indigo-800 font-medium">
                Showing {filteredRisks.length} of {riskItems.length} risks
              </span>
            </div>
            
            {filteredRisks.length !== riskItems.length && (
              <div className="text-sm text-gray-600">
                {riskItems.length - filteredRisks.length} risks hidden by filters
              </div>
            )}
          </div>
        </div>
        
        {/* Charts Section */}
        {filteredRisks.length > 0 && (
          <div className="mb-8">
            <RiskCharts riskItems={filteredRisks} />
          </div>
        )}
        
        {/* Risk Cards Section */}
        <div className="space-y-6">
          {filteredRisks.length > 0 ? (
            filteredRisks.map((risk, index) => (
              <RiskCard key={risk.RiskID || `risk-${index}`} risk={risk} />
            ))
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-16 text-center border border-white/20">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-full inline-block mb-6">
                <FaSearch className="text-gray-400 text-5xl" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Risks Found</h3>
              <p className="text-gray-600 text-lg mb-6">
                No risks match your current search and filter criteria
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg font-medium"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskDashboard;