import React, { useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer
} from 'recharts';

// Custom SVG Icons
const TrendingUp = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const Shield = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const AlertTriangle = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
    <path d="M12 9v4"></path>
    <path d="m12 17 .01 0"></path>
  </svg>
);

const BarChart3 = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18"></path>
    <path d="M18 17V9"></path>
    <path d="M13 17V5"></path>
    <path d="M8 17v-3"></path>
  </svg>
);

const Target = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

const Grid = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const RiskCharts = ({ riskItems = [] }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Constants
  //use memo to wrap 
  const SEVERITY_CONFIG = useMemo(() => ({
    Critical: { color: '#dc2626', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' },
    High: { color: '#ea580c', bgColor: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-200' },
    Medium: { color: '#ca8a04', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' },
    Low: { color: '#16a34a', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200' },
    Unknown: { color: '#6b7280', bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200' }
  }), []);

  const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#84cc16'];
  
  // Memoized data calculations
  const analyticsData = useMemo(() => {
    if (!riskItems.length) return null;

    // Severity distribution
    const severityCounts = Object.keys(SEVERITY_CONFIG).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    
    riskItems.forEach(item => {
      const severity = item.RiskSeverity || 'Unknown';
      if (severityCounts.hasOwnProperty(severity)) {
        severityCounts[severity]++;
      }
    });

    const severityData = Object.entries(severityCounts)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);

    // Category distribution
    const categoryCounts = {};
    riskItems.forEach(item => {
      const category = item.RiskCategory || 'Uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const categoryData = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Risk score calculation
    const weights = { Critical: 100, High: 70, Medium: 40, Low: 10, Unknown: 25 };
    const totalScore = riskItems.reduce((sum, item) => 
      sum + (weights[item.RiskSeverity] || weights.Unknown), 0
    );
    const riskScore = Math.min(100, totalScore / (riskItems.length * 25));

    // Top risk categories by weighted score
    const categoryRiskScores = Object.entries(categoryCounts).map(([category, count]) => {
      const risksInCategory = riskItems.filter(item => 
        (item.RiskCategory || 'Uncategorized') === category
      );
      
      const score = risksInCategory.reduce((sum, risk) => {
        const severityScore = { Critical: 10, High: 5, Medium: 3, Low: 1 }[risk.RiskSeverity] || 2;
        return sum + severityScore;
      }, 0);
      
      return { category, score, count };
    }).sort((a, b) => b.score - a.score);

    // RPN distribution for risk matrix
    const rpnRanges = { '1-25': 0, '26-50': 0, '51-75': 0, '76-100': 0, '100+': 0 };
    
    riskItems.forEach(item => {
      const rpn = Number(item.RPN);
      if (!isNaN(rpn)) {
        if (rpn <= 25) rpnRanges['1-25']++;
        else if (rpn <= 50) rpnRanges['26-50']++;
        else if (rpn <= 75) rpnRanges['51-75']++;
        else if (rpn <= 100) rpnRanges['76-100']++;
        else rpnRanges['100+']++;
      }
    });

    const rpnData = Object.entries(rpnRanges)
      .map(([range, count]) => ({ range, count }))
      .filter(item => item.count > 0);

    // Risk matrix data
    const riskMatrixData = [];
    [5, 4, 3, 2, 1].forEach(impact => {
      [1, 2, 3, 4, 5].forEach(probability => {
        const riskLevel = probability * impact;
        let riskCategory = 'Low';
        let color = '#16a34a';
        
        if (riskLevel >= 15) {
          riskCategory = 'High';
          color = '#dc2626';
        } else if (riskLevel >= 8) {
          riskCategory = 'Medium';
          color = '#ca8a04';
        }
        
        const risksInCell = riskItems.filter(risk => {
          const probMap = { 'very low': 1, 'low': 2, 'medium': 3, 'high': 4, 'very high': 5 };
          const impactMap = { 'very low': 1, 'low': 2, 'medium': 3, 'high': 4, 'very high': 5, 'critical': 5 };
          
          const riskProb = probMap[risk.Probability?.toLowerCase()] || 3;
          const riskImpact = impactMap[risk.Impact?.toLowerCase()] || 3;
          
          return riskProb === probability && riskImpact === impact;
        });
        
        riskMatrixData.push({
          id: `P${probability}I${impact}`,
          probability,
          impact,
          riskLevel,
          riskCategory,
          count: risksInCell.length,
          color
        });
      });
    });

    return {
      severityData,
      severityCounts,
      categoryData,
      riskScore,
      categoryRiskScores,
      totalRisks: riskItems.length,
      rpnData,
      riskMatrixData
    };
  }, [riskItems, SEVERITY_CONFIG]);

  // Reusable Components
  const Card = ({ children, className = "", gradient = false }) => (
    <div className={`
      ${gradient 
        ? 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50' 
        : 'bg-white'
      } 
      rounded-2xl shadow-sm border border-gray-100 backdrop-blur-sm 
      hover:shadow-md transition-all duration-300 ${className}
    `}>
      {children}
    </div>
  );

  const SectionHeader = ({ title, subtitle, icon: Icon }) => (
    <div className="flex items-center gap-3 mb-6">
      {Icon && (
        <div className="p-2 bg-blue-100 rounded-xl">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-700">{entry.name}: </span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const RiskScoreGauge = ({ score }) => {
    const getRiskLevel = (score) => {
      if (score >= 90) return { level: "Critical", color: "#dc2626", bgColor: "bg-red-100", textColor: "text-red-700" };
      if (score >= 70) return { level: "High", color: "#ea580c", bgColor: "bg-orange-100", textColor: "text-orange-700" };
      if (score >= 30) return { level: "Medium", color: "#ca8a04", bgColor: "bg-yellow-100", textColor: "text-yellow-700" };
      return { level: "Low", color: "#16a34a", bgColor: "bg-green-100", textColor: "text-green-700" };
    };

    const { level, color, bgColor, textColor } = getRiskLevel(score);
    const circumference = 2 * Math.PI * 60;
    const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <svg className="w-40 h-40 -rotate-90">
            <circle cx="80" cy="80" r="60" fill="none" stroke="#e5e7eb" strokeWidth="12" />
            <circle 
              cx="80" cy="80" r="60" 
              fill="none" 
              stroke={color}
              strokeWidth="12"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-900">{Math.round(score)}</span>
            <span className="text-sm text-gray-500">Risk Score</span>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${bgColor} ${textColor}`}>
          {level} Risk
        </div>
      </div>
    );
  };

  const TabButton = ({ tab, isActive, onClick }) => {
    const Icon = tab.icon;
    return (
      <button
        onClick={onClick}
        className={`
          flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200
          ${isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' 
            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 shadow-sm hover:shadow-md'
          }
        `}
      >
        <Icon size={18} />
        <span>{tab.name}</span>
      </button>
    );
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'distribution', name: 'Analysis', icon: TrendingUp },
    { id: 'matrix', name: 'Risk Matrix', icon: Grid },
    { id: 'insights', name: 'Insights', icon: Shield }
  ];

  // No data state
  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-6">
        <Card className="p-12 text-center max-w-md" gradient>
          <AlertTriangle className="w-20 h-20 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No Risk Data Available</h2>
          <p className="text-gray-600 text-lg">Upload a valid risk assessment file to view comprehensive analytics and insights</p>
        </Card>
      </div>
    );
  }

  const { severityData, severityCounts, categoryData, riskScore, categoryRiskScores, totalRisks, rpnData, riskMatrixData } = analyticsData;

  // Tab Components
  const OverviewTab = () => (
    <div className="space-y-8">
      <SectionHeader 
        title="Risk Overview" 
        subtitle="Comprehensive view of your risk landscape"
        icon={BarChart3}
      />
      {/* Risk Score and Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-2 p-8 flex justify-center items-center" gradient>
          <RiskScoreGauge score={riskScore} />
        </Card>

        <ChartCard 
          title="Risk Distribution" 
          subtitle="Breakdown by severity levels"
          className="lg:col-span-3"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%" cy="50%"
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {severityData.map((entry) => (
                  <Cell key={entry.name} fill={SEVERITY_CONFIG[entry.name].color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Category Analysis */}
      <ChartCard 
        title="Risk Categories" 
        subtitle="Distribution across different risk categories"
      >
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={categoryData.slice(0, 8)} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {categoryData.slice(0, 8).map((entry, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );

  const AnalysisTab = () => (
    <div className="space-y-8">
      <SectionHeader 
        title="Detailed Analysis" 
        subtitle="Deep dive into risk patterns and distributions"
        icon={TrendingUp}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard 
          title="Top Risk Categories" 
          subtitle="Ranked by weighted risk score"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={categoryRiskScores.slice(0, 6)} 
              layout="vertical"
              margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis 
                type="category" 
                dataKey="category" 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                width={110}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                {categoryRiskScores.slice(0, 6).map((entry, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Summary</h3>
            <div className="space-y-3">
              {Object.entries(severityCounts).map(([severity, count]) => {
                const config = SEVERITY_CONFIG[severity];
                const percentage = ((count / totalRisks) * 100).toFixed(1);
                
                return (
                  <div key={severity} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: config.color }}
                      />
                      <span className="font-medium text-gray-900">{severity}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">{count}</span>
                      <span className="text-sm text-gray-500 ml-2">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalRisks}</div>
                <div className="text-sm text-gray-600">Total Risks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{categoryData.length}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const RiskMatrixTab = () => (
    <div className="space-y-8">
      <SectionHeader 
        title="Risk Assessment Matrix" 
        subtitle="Probability vs Impact analysis and RPN distribution"
        icon={Grid}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Risk Matrix Heatmap */}
        <Card className="xl:col-span-2 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Risk Priority Matrix</h3>
          
          {/* Matrix Grid */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 rounded-xl">
            <div className="grid grid-cols-6 gap-2 text-sm">
              {/* Header Row */}
              <div className="text-center font-semibold text-gray-700 py-2"></div>
              {[1, 2, 3, 4, 5].map(prob => (
                <div key={prob} className="text-center font-semibold text-gray-700 py-2">
                  P{prob}
                </div>
              ))}
              
              {/* Matrix Rows */}
              {[5, 4, 3, 2, 1].map(impact => (
                <React.Fragment key={impact}>
                  <div className="text-center font-semibold text-gray-700 py-2 flex items-center justify-center">
                    I{impact}
                  </div>
                  {[1, 2, 3, 4, 5].map(probability => {
                    const cellData = riskMatrixData.find(
                      item => item.probability === probability && item.impact === impact
                    );
                    
                    return (
                      <div
                        key={`${probability}-${impact}`}
                        className="aspect-square rounded-lg flex flex-col items-center justify-center text-white font-semibold text-sm border-2 border-white shadow-sm hover:shadow-md transition-all duration-200"
                        style={{ backgroundColor: cellData?.color || '#6b7280' }}
                      >
                        <div className="text-lg font-bold">{cellData?.count || 0}</div>
                        <div className="text-xs opacity-90">
                          {cellData?.riskLevel || 0}
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            
            {/* Axis Labels */}
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
              <span className="transform -rotate-90 origin-center">← Impact</span>
              <div className="text-center">
                <div>Probability →</div>
                <div className="text-xs mt-1 text-gray-500">Risk Level = Probability × Impact</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-sm text-gray-700">Low Risk (1-7)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-600 rounded"></div>
              <span className="text-sm text-gray-700">Medium Risk (8-14)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-sm text-gray-700">High Risk (15-25)</span>
            </div>
          </div>
        </Card>

        {/* Matrix Summary */}
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Matrix Summary</h3>
            <div className="space-y-3">
              {['High', 'Medium', 'Low'].map(category => {
                const count = riskMatrixData
                  .filter(item => item.riskCategory === category)
                  .reduce((sum, item) => sum + item.count, 0);
                
                const color = category === 'High' ? '#dc2626' : 
                             category === 'Medium' ? '#ca8a04' : '#16a34a';
                
                return (
                  <div key={category} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-medium">{category} Risk</span>
                    </div>
                    <span className="font-bold text-gray-900">{count}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {riskMatrixData.reduce((sum, item) => sum + item.count, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Mapped Risks</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-red-600">
                    {riskMatrixData.filter(item => item.riskLevel >= 15).reduce((sum, item) => sum + item.count, 0)}
                  </div>
                  <div className="text-xs text-gray-600">Critical Priority</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">
                    {riskMatrixData.filter(item => item.riskLevel <= 7).reduce((sum, item) => sum + item.count, 0)}
                  </div>
                  <div className="text-xs text-gray-600">Manageable</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* RPN Distribution Chart */}
      {rpnData && rpnData.length > 0 && (
        <ChartCard 
          title="Risk Priority Number (RPN) Distribution" 
          subtitle="Distribution of calculated risk priority numbers"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rpnData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="range" 
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {rpnData.map((entry, index) => (
                  <Cell 
                    key={index} 
                    fill={
                      entry.range === '100+' ? '#dc2626' :
                      entry.range === '76-100' ? '#ea580c' :
                      entry.range === '51-75' ? '#ca8a04' :
                      entry.range === '26-50' ? '#16a34a' : '#10b981'
                    } 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600">
            <p>RPN = Severity × Occurrence × Detection. Higher values indicate higher priority risks.</p>
          </div>
        </ChartCard>
      )}
    </div>
  );

  const InsightsTab = () => (
    <div className="space-y-8">
      <SectionHeader 
        title="Risk Insights" 
        subtitle="Actionable intelligence and recommendations"
        icon={Shield}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" gradient>
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-blue-600" />
            Key Insights
          </h3>
          <div className="space-y-4">
            {[
              {
                metric: severityCounts.Critical + severityCounts.High,
                label: "high-priority risks need immediate attention",
                color: "text-red-600"
              },
              {
                metric: categoryRiskScores[0]?.category || "N/A",
                label: "is your most critical risk category",
                color: "text-orange-600"
              },
              {
                metric: `${riskScore.toFixed(0)}%`,
                label: "overall risk exposure score",
                color: "text-blue-600"
              }
            ].map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-white/60 rounded-xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0" />
                <p className="text-gray-700">
                  <span className={`font-bold ${insight.color}`}>{insight.metric}</span>
                  {' '}{insight.label}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" gradient>
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-green-600" />
            Recommendations
          </h3>
          <div className="space-y-4">
            {[
              "Prioritize mitigation strategies for Critical and High severity risks",
              `Allocate additional resources to monitor ${categoryRiskScores[0]?.category || "top"} category risks`,
              "Implement regular risk assessment reviews for medium-priority items",
              "Establish automated monitoring systems for early risk detection"
            ].map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-white/60 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0" />
                <p className="text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50" gradient>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Risk Analytics Dashboard</h1>
              <p className="text-gray-600 text-lg">Comprehensive risk assessment and strategic insights</p>
            </div>
            <div className="mt-6 lg:mt-0 text-center lg:text-right">
              <div className="text-sm text-gray-500 mb-1">Total Risk Items</div>
              <div className="text-4xl font-bold text-blue-600">{totalRisks}</div>
              <div className="text-sm text-blue-500">Analyzed</div>
            </div>
          </div>
        </Card>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-500 ease-in-out">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'distribution' && <AnalysisTab />}
          {activeTab === 'matrix' && <RiskMatrixTab />}
          {activeTab === 'insights' && <InsightsTab />}
        </div>
      </div>
    </div>
  );
};

export default RiskCharts;

const ChartCard = ({ title, subtitle, className = '', children }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
    </div>
    {children}
  </div>
);