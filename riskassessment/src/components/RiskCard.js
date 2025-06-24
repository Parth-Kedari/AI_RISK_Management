import React, { useState } from 'react';
import { 
  FaChevronDown, 
  FaExclamationTriangle, 
  FaShieldAlt, 
  FaTools, 
  FaUserShield, 
  FaExchangeAlt, 
  FaCalculator, 
  FaLightbulb, 
  FaCogs, 
  FaUsers,
  FaInfoCircle,
  FaClipboard
} from 'react-icons/fa';

const RiskCard = ({ risk }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    RiskID = 'Unknown ID',
    RiskName = 'Unnamed Risk',
    RiskCategory = 'Uncategorized',
    RiskSeverity = 'Unknown',
    RiskDescription = 'No description provided',
    Probability = 'Unknown',
    Impact = 'Unknown',
    SecurityImplications = 'None specified',
    TechnicalMitigation = 'None provided',
    NonTechnicalMitigation = 'None provided',
    ContingencyPlan = 'None provided',
    RPN = 'Not calculated',
    SuggestedFix = 'No suggestion available'
  } = risk;
  
  const severityConfig = getSeverityConfig(RiskSeverity);
  
  // Enhanced function to format suggested fixes
  const formatSuggestedFix = (fix) => {
    try {
      const parsedFix = JSON.parse(fix);
      const technicalItems = parsedFix.technical_mitigation || parsedFix.technical_actions || parsedFix.technical_steps || [];
      const nonTechnicalItems = parsedFix.non_technical_mitigation || parsedFix.non_technical_actions || parsedFix.process_changes || parsedFix.policy_updates || [];
      const otherSections = Object.entries(parsedFix).filter(([key]) => {
        const lowerKey = key.toLowerCase();
        return !lowerKey.includes('technical') && !lowerKey.includes('process') && !lowerKey.includes('policy');
      });

      return (
        <div className="space-y-6">
          {(technicalItems.length > 0 || nonTechnicalItems.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActionColumn
                title="Technical Solutions"
                icon={FaCogs}
                items={technicalItems}
                colorScheme="blue"
              />
              <ActionColumn
                title="Process & Policy"
                icon={FaUsers}
                items={nonTechnicalItems}
                colorScheme="emerald"
              />
            </div>
          )}

          {otherSections.map(([key, value], index) => (
            <div key={index} className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl p-6 border border-slate-200">
              <h5 className="font-semibold text-slate-800 capitalize mb-4 flex items-center">
                <FaInfoCircle className="mr-2 text-indigo-600" />
                {key.replace(/_/g, ' ')}
              </h5>
              {Array.isArray(value) ? (
                <div className="space-y-3">
                  {value.map((item, idx) => (
                    <div key={idx} className="flex items-start bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                      <div className="flex-shrink-0 w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                        <span className="font-semibold text-indigo-700 text-sm">{idx + 1}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-100">{value}</p>
              )}
            </div>
          ))}
        </div>
      );
    } catch (e) {
      return <FallbackFormat fix={fix} />;
    }
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 hover:border-slate-300">
      {/* Card Header */}
      <div 
        className="flex justify-between items-center p-6 cursor-pointer hover:bg-slate-50 transition-colors duration-200 border-b border-slate-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center flex-1">
          <div className={`${severityConfig.bgColor} p-4 rounded-xl mr-5 shadow-sm`}>
            <FaExclamationTriangle className={`${severityConfig.textColor} text-xl`} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xl text-slate-800 mb-2">{RiskName}</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 font-medium text-sm">
                {RiskID}
              </span>
              <span className="bg-indigo-50 px-3 py-1.5 rounded-lg text-indigo-700 font-medium text-sm">
                {RiskCategory}
              </span>
              <span className={`font-semibold px-4 py-1.5 rounded-lg text-sm ${severityConfig.badgeColor}`}>
                {RiskSeverity}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center ml-4">
          <span className="text-sm font-medium text-slate-500 mr-4 hidden sm:block">
            {isExpanded ? 'Less Details' : 'More Details'}
          </span>
          <div className={`p-3 rounded-full transition-all duration-200 ${isExpanded ? 'bg-indigo-100 rotate-180' : 'bg-slate-100'}`}>
            <FaChevronDown className={`${isExpanded ? 'text-indigo-600' : 'text-slate-500'}`} />
          </div>
        </div>
      </div>
      
      {/* Card Content */}
      {isExpanded && (
        <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
          {/* Risk Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <MetricCard 
              icon={FaCalculator}
              title="Probability"
              value={Probability}
              colorScheme="purple"
            />
            <MetricCard 
              icon={FaExchangeAlt}
              title="Impact"
              value={Impact}
              colorScheme="blue"
            />
            <MetricCard 
              icon={FaCalculator}
              title="Risk Priority Number"
              value={RPN}
              colorScheme="indigo"
            />
          </div>
          
          {/* Risk Details */}
          <div className="space-y-6 mb-8">
            <DetailSection 
              icon={FaInfoCircle}
              title="Risk Description"
              content={RiskDescription}
              colorScheme="slate"
            />
            
            <DetailSection 
              icon={FaShieldAlt}
              title="Security Implications"
              content={SecurityImplications}
              colorScheme="red"
            />
          </div>
          
          {/* Mitigation Strategies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <DetailSection 
              icon={FaTools}
              title="Technical Mitigation"
              content={TechnicalMitigation}
              colorScheme="green"
            />
            
            <DetailSection 
              icon={FaUserShield}
              title="Process Mitigation"
              content={NonTechnicalMitigation}
              colorScheme="orange"
            />
          </div>
          
          <DetailSection 
            icon={FaClipboard}
            title="Contingency Plan"
            content={ContingencyPlan}
            colorScheme="yellow"
          />
          
          {/* AI Suggested Actions */}
          {SuggestedFix !== 'No immediate action required.' && SuggestedFix !== 'No suggestion available' && (
            <div className="mt-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 p-6 rounded-2xl border-l-4 border-indigo-500 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <FaLightbulb className="text-indigo-600 text-xl" />
                </div>
                <h4 className="text-xl font-bold text-indigo-800">AI-Recommended Action Plan</h4>
              </div>
              {formatSuggestedFix(SuggestedFix)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Component for action columns in suggested fixes
const ActionColumn = ({ title, icon: Icon, items, colorScheme }) => {
  const colorConfig = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-800',
      itemBg: 'bg-blue-100',
      itemTextColor: 'text-blue-700'
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      titleColor: 'text-emerald-800',
      itemBg: 'bg-emerald-100',
      itemTextColor: 'text-emerald-700'
    }
  };
  
  const config = colorConfig[colorScheme];
  
  return (
    <div className={`${config.bg} rounded-xl p-6 border ${config.border} shadow-sm`}>
      <div className="flex items-center mb-4">
        <div className={`${config.iconBg} p-3 rounded-full mr-3`}>
          <Icon className={`${config.iconColor}`} />
        </div>
        <h5 className={`font-bold ${config.titleColor}`}>{title}</h5>
      </div>
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item, idx) => (
            <div key={idx} className="flex items-start bg-white p-4 rounded-lg shadow-sm border border-white">
              <div className={`flex-shrink-0 w-7 h-7 ${config.itemBg} rounded-full flex items-center justify-center mr-4 mt-0.5`}>
                <span className={`font-semibold ${config.itemTextColor} text-sm`}>{idx + 1}</span>
              </div>
              <p className="text-slate-700 leading-relaxed">{item}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-500 italic bg-white p-4 rounded-lg">No specific actions identified</p>
        )}
      </div>
    </div>
  );
};

// Component for metric cards
const MetricCard = ({ icon: Icon, title, value, colorScheme }) => {
  const colorConfig = {
    purple: { bg: 'bg-purple-50', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    blue: { bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    indigo: { bg: 'bg-indigo-50', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' }
  };
  
  const config = colorConfig[colorScheme];
  
  return (
    <div className={`${config.bg} p-5 rounded-xl shadow-sm border border-slate-200`}>
      <div className="flex items-center mb-3">
        <div className={`${config.iconBg} p-2 rounded-lg mr-3`}>
          <Icon className={`${config.iconColor}`} />
        </div>
        <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
      </div>
      <p className="text-xl font-bold text-slate-800">{value}</p>
    </div>
  );
};

// Component for detail sections
const DetailSection = ({ icon: Icon, title, content, colorScheme }) => {
  const colorConfig = {
    slate: { iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
    red: { iconBg: 'bg-red-100', iconColor: 'text-red-600' },
    green: { iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    orange: { iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
    yellow: { iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' }
  };
  
  const config = colorConfig[colorScheme];
  
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center mb-4">
        <div className={`${config.iconBg} p-3 rounded-lg mr-3`}>
          <Icon className={`${config.iconColor}`} />
        </div>
        <h4 className="text-lg font-semibold text-slate-700">{title}</h4>
      </div>
      <p className="text-slate-700 leading-relaxed">{content}</p>
    </div>
  );
};

// Fallback component for non-JSON suggested fixes
const FallbackFormat = ({ fix }) => {
  const processText = (text) => {
    const technicalSection = [];
    const nonTechnicalSection = [];
    const generalRecommendations = [];
    
    const cleanText = text.replace(/\*\*/g, '').trim();
    const bulletMatch = cleanText.match(/(?:^|\n)(?:\d+\.|\*|-|•)\s*([^\n]+)/g);
    
    if (bulletMatch && bulletMatch.length > 0) {
      const items = bulletMatch.map(item => 
        item.replace(/^\s*(?:\d+\.|\*|-|•)\s*/, '').trim()
      );
      
      items.forEach(item => {
        if (item.match(/code|software|firewall|encryption|backup|system|database|authentication|password|access control|configuration|server|network|monitor|update|patch|install|deploy/i)) {
          technicalSection.push(item);
        } else if (item.match(/policy|training|awareness|staff|user|documentation|procedure|compliance|communication|governance|review|audit|document|report|educate/i)) {
          nonTechnicalSection.push(item);
        } else {
          generalRecommendations.push(item);
        }
      });
    } else {
      generalRecommendations.push(cleanText);
    }
    
    return { technicalSection, nonTechnicalSection, generalRecommendations };
  };
  
  const { technicalSection, nonTechnicalSection, generalRecommendations } = processText(fix);
  
  return (
    <div className="space-y-6">
      {(technicalSection.length > 0 || nonTechnicalSection.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActionColumn
            title="Technical Solutions"
            icon={FaCogs}
            items={technicalSection}
            colorScheme="blue"
          />
          <ActionColumn
            title="Process & Policy"
            icon={FaUsers}
            items={nonTechnicalSection}
            colorScheme="emerald"
          />
        </div>
      )}
      
      {generalRecommendations.length > 0 && (
        <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl p-6 border border-slate-200">
          <h5 className="font-semibold text-slate-800 mb-4 flex items-center">
            <FaInfoCircle className="mr-2 text-indigo-600" />
            General Recommendations
          </h5>
          <div className="space-y-3">
            {generalRecommendations.map((item, idx) => (
              <div key={idx} className="flex items-start bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                <div className="flex-shrink-0 w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="font-semibold text-indigo-700 text-sm">{idx + 1}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{item.trim()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function for severity configuration
const getSeverityConfig = (severity) => {
  const configs = {
    critical: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      badgeColor: 'bg-red-100 text-red-800 border border-red-200'
    },
    high: {
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      badgeColor: 'bg-orange-100 text-orange-800 border border-orange-200'
    },
    medium: {
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
      badgeColor: 'bg-amber-100 text-amber-800 border border-amber-200'
    },
    low: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      badgeColor: 'bg-green-100 text-green-800 border border-green-200'
    },
    unknown: {
      bgColor: 'bg-slate-100',
      textColor: 'text-slate-600',
      badgeColor: 'bg-slate-100 text-slate-800 border border-slate-200'
    }
  };
  
  return configs[severity?.toLowerCase()] || configs.unknown;
};

export default RiskCard;