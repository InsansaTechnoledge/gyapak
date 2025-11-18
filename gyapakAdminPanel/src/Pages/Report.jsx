import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, AlertCircle, TrendingUp, FileText, BookOpen, HelpCircle, Building, Download, FileSpreadsheet, Clock } from 'lucide-react';
import { downloadExcelService, downloadPDFService, getReportService } from '../Services/ReportService';

const Report = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('1month');
  const [downloading, setDownloading] = useState({ pdf: false, excel: false });

  const periods = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '15days', label: 'Last 15 Days' },
    { value: '1month', label: 'Last Month' },
    { value: '2months', label: 'Last 2 Months' },
    { value: '3months', label: 'Last 3 Months' }
  ];

  const generateReport = async () => {
    setLoading(true);
    try {
      const data= await getReportService(selectedPeriod);
      
      if (data.success) {
        setReport(data.data);
      } else {
        console.error('Failed to fetch report:', data.message);
        alert('Failed to generate report. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      alert('Error connecting to server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    setDownloading({ ...downloading, pdf: true });
      try {
      const blob = await downloadPDFService(selectedPeriod);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gyapak-critical-event-booklet-${selectedPeriod}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF');
    } finally {
      setDownloading({ ...downloading, pdf: false });
    }
  };

  const downloadExcel = async () => {
    setDownloading({ ...downloading, excel: true });
    try {
      const blob = await downloadExcelService(selectedPeriod);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gyapak-report-${selectedPeriod}-${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading Excel:', error);
      alert('Failed to download Excel');
    } finally {
      setDownloading({ ...downloading, excel: false });
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getUrgencyColor = (days) => {
    if (days <= 2) return 'text-red-600 bg-red-50 border-red-200';
    if (days <= 5) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getUrgencyIcon = (days) => {
    if (days <= 2) return '🔴';
    if (days <= 5) return '🟠';
    return '🔵';
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 hover:shadow-lg transition-shadow" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold" style={{ color: color }}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp size={14} className="text-green-600" />
              <span className="text-xs font-medium text-green-600">{trend}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon size={28} style={{ color: color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Activity Report</h1>
              <p className="text-gray-600 mt-2">Comprehensive analytics and insights for GYAPAK platform</p>
            </div>
            
            <div className="flex gap-3">
              {report && (
                <>
                  <button
                    onClick={downloadPDF}
                    disabled={downloading.pdf}
                    className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    {downloading.pdf ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download size={18} />
                        Download Critical Event Booklet
                      </>
                    )}
                  </button>
                  <button
                    onClick={downloadExcel}
                    disabled={downloading.excel}
                    className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    {downloading.excel ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet size={18} />
                        Download Report Excel
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Period Selection Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <Clock className="text-blue-600" size={24} />
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Select Time Period</p>
                  <div className="flex gap-2 flex-wrap">
                    {periods.map((period) => (
                      <button
                        key={period.value}
                        onClick={() => setSelectedPeriod(period.value)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          selectedPeriod === period.value
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {period.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <button
                onClick={generateReport}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText size={20} />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>

          {report && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <Calendar className="text-blue-600" size={24} />
              <div className="flex-1">
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-blue-900">Period: </span>
                    <span className="text-blue-700 font-medium">{report.period.label}</span>
                  </div>
                  <div className="w-px h-4 bg-blue-300"></div>
                  <div>
                    <span className="font-semibold text-blue-900">Generated: </span>
                    <span className="text-blue-700">{formatDate(report.reportGenerated)}</span>
                  </div>
                  <div className="w-px h-4 bg-blue-300"></div>
                  <div>
                    <span className="font-semibold text-blue-900">Total Entries: </span>
                    <span className="text-blue-700 font-bold">{report.summary.totalEntries}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {report ? (
          <>
            {/* Monthly Trends Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Monthly Trends</h2>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={report.monthlyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="label" 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="data.total" stroke="#3b82f6" name="Total" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="data.events" stroke="#10b981" name="Events" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="data.blogs" stroke="#f59e0b" name="Blogs" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="data.questions" stroke="#8b5cf6" name="Questions" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>

                {/* Monthly Stats Table */}
                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Month</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Events</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Blogs</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Questions</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Affairs</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {report.monthlyBreakdown.map((month, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {month.month} {month.year}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">{month.data.events}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">{month.data.blogs}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">{month.data.questions}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">{month.data.currentAffairs}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-blue-600">{month.data.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Entries"
                value={report.summary.totalEntries}
                icon={TrendingUp}
                color="#3b82f6"
                subtitle={report.period.label}
              />
              <StatCard
                title="Critical Events"
                value={report.insights.criticalEventsCount}
                icon={AlertCircle}
                color="#ef4444"
                subtitle="Closing in 2 days"
              />
              <StatCard
                title="New Questions"
                value={report.summary.bySection.questions}
                icon={HelpCircle}
                color="#10b981"
                subtitle="Added in period"
              />
              <StatCard
                title="Growth Status"
                value={report.insights.growthIndicator}
                icon={TrendingUp}
                color="#8b5cf6"
                subtitle={`${report.insights.totalUpcomingEvents} upcoming events`}
              />
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md mb-8">
              <div className="border-b border-gray-200">
                <div className="flex gap-1 px-6">
                  {['overview', 'events', 'analytics'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 font-semibold capitalize transition-all relative ${
                        activeTab === tab
                          ? 'text-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Section Breakdown */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Building size={20} className="text-blue-600" />
                        Section Breakdown
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(report.summary.bySection).map(([key, value]) => (
                          <div key={key} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow">
                            <p className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wide">{key}</p>
                            <p className="text-3xl font-bold text-gray-900">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <h4 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
                          <div className="w-1 h-5 bg-blue-600 rounded"></div>
                          Event Type Distribution
                        </h4>
                        <ResponsiveContainer width="100%" height={280}>
                          <PieChart>
                            <Pie
                              data={report.eventTypeDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={90}
                              fill="#8884d8"
                              dataKey="count"
                              nameKey="_id"
                            >
                              {report.eventTypeDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <h4 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
                          <div className="w-1 h-5 bg-green-600 rounded"></div>
                          Question Difficulty
                        </h4>
                        <ResponsiveContainer width="100%" height={280}>
                          <BarChart data={report.questionStatistics.byDifficulty}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'events' && (
                  <div className="space-y-6">
                    {/* Critical Events */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600">
                        <AlertCircle size={22} />
                        Critical Events - Closing in 2 Days
                      </h3>
                      {report.upcomingEvents.urgent.length > 0 ? (
                        <div className="space-y-3">
                          {report.upcomingEvents.urgent.map((event, idx) => (
                            <div key={idx} className={`p-5 rounded-xl border-2 ${getUrgencyColor(event.daysRemaining)} hover:shadow-lg transition-shadow`}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">{getUrgencyIcon(event.daysRemaining)}</span>
                                    <h4 className="font-bold text-gray-900 text-lg">{event.name}</h4>
                                    <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold border shadow-sm">
                                      {event.event_type}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 mb-2">
                                    <span className="font-semibold">{event.organization_id.abbreviation}</span> - {event.organization_id.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">End Date:</span> {formatDate(event.end_date)}
                                  </p>
                                  {event.briefDetails && (
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.briefDetails}</p>
                                  )}
                                </div>
                                <div className="text-center bg-white rounded-lg p-4 shadow-sm min-w-[80px]">
                                  <div className="text-3xl font-bold text-red-600">{event.daysRemaining}</div>
                                  <div className="text-xs font-semibold text-gray-600 uppercase">days left</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-500 italic">No critical events at the moment</p>
                        </div>
                      )}
                    </div>

                    {/* Upcoming Events */}
                    {report.upcomingEvents.soon.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-600">
                          <Calendar size={22} />
                          Upcoming Events - 3 to 5 Days
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {report.upcomingEvents.soon.map((event, idx) => (
                            <div key={idx} className={`p-4 rounded-lg border-2 ${getUrgencyColor(event.daysRemaining)} hover:shadow-md transition-shadow`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-1">{event.name}</h4>
                                  <p className="text-sm text-gray-700">{event.organization_id.abbreviation}</p>
                                  <span className="inline-block mt-2 px-2 py-1 bg-white rounded text-xs font-medium border">
                                    {event.event_type}
                                  </span>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-2xl font-bold text-orange-600">{event.daysRemaining}</div>
                                  <div className="text-xs text-gray-600">days</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    {/* Current Affairs Breakdown */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <BookOpen size={20} className="text-blue-600" />
                        Current Affairs by Category
                      </h3>
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={report.currentAffairsBreakdown}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="_id" angle={-45} textAnchor="end" height={100} style={{ fontSize: '12px' }} />
                          <YAxis style={{ fontSize: '12px' }} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Key Insights */}
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border border-blue-200 shadow-md">
                      <h3 className="text-lg font-semibold mb-4 text-blue-900 flex items-center gap-2">
                        <span className="text-2xl">📊</span>
                        Key Insights
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 bg-white bg-opacity-60 rounded-lg p-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          <p className="text-gray-800 flex-1">
                            <span className="font-bold text-blue-900">{report.insights.mostActiveSection}</span> was the most active section during this period with significant contributions
                          </p>
                        </div>
                        <div className="flex items-start gap-3 bg-white bg-opacity-60 rounded-lg p-3">
                          <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                          <p className="text-gray-800 flex-1">
                            <span className="font-bold text-red-900">{report.insights.criticalEventsCount}</span> critical events require immediate attention and action
                          </p>
                        </div>
                        <div className="flex items-start gap-3 bg-white bg-opacity-60 rounded-lg p-3">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                          <p className="text-gray-800 flex-1">
                            Platform activity shows <span className="font-bold text-green-900">{report.insights.growthIndicator}</span> growth trajectory with {report.insights.totalUpcomingEvents} total upcoming events
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Top Organizations */}
                    {report.organizationActivity.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Building size={20} className="text-purple-600" />
                          Most Active Organizations
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="space-y-2">
                            {report.organizationActivity.slice(0, 10).map((org, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold text-purple-700">{idx + 1}</span>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900">{org.name}</p>
                                    <p className="text-xs text-gray-600">{org.abbreviation}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-purple-600">{org.eventCount}</p>
                                  <p className="text-xs text-gray-600">events</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText size={48} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Report Generated Yet</h3>
              <p className="text-gray-600 mb-8">
                Select your desired time period above and click "Generate Report" to create a comprehensive analytics report with trends, insights, and detailed breakdowns.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-600" />
                  <span>Monthly Trends</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-600" />
                  <span>Critical Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download size={16} className="text-green-600" />
                  <span>Export Options</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;