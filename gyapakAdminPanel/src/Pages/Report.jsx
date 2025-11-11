import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, AlertCircle, TrendingUp, FileText, Users, BookOpen, HelpCircle, Building } from 'lucide-react';
import { getWeeklyReport } from '../Services/ReportService';

const Report = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const generateReport = async () => {
    setLoading(true);
    try {
      
      const data = await getWeeklyReport();
      
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

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2" style={{ color: color }}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon size={24} style={{ color: color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Weekly Report Dashboard</h1>
              <p className="text-gray-600 mt-1">Last 7 days analytics and insights</p>
            </div>
            <button
              onClick={generateReport}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-sm"
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
          
          {report && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
              <Calendar className="text-blue-600" size={20} />
              <div className="text-sm">
                <span className="font-medium text-blue-900">Report Period: </span>
                <span className="text-blue-700">
                  {formatDate(report.period.from)} - {formatDate(report.period.to)}
                </span>
                <span className="mx-2 text-blue-400">|</span>
                <span className="text-blue-600">Generated: {formatDate(report.reportGenerated)}</span>
              </div>
            </div>
          )}
        </div>

        {report ? (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Entries"
                value={report.summary.totalEntries}
                icon={TrendingUp}
                color="#3b82f6"
                subtitle="Last 7 days"
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
                subtitle="Added this week"
              />
              <StatCard
                title="Growth"
                value={report.insights.growthIndicator}
                icon={TrendingUp}
                color="#8b5cf6"
                subtitle="Activity trend"
              />
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="border-b border-gray-200">
                <div className="flex gap-2 px-6">
                  {['overview', 'events', 'analytics'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-3 font-medium capitalize ${
                        activeTab === tab
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
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
                        Entries by Section
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(report.summary.bySection).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-xs font-medium text-gray-600 uppercase mb-1">{key}</p>
                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold mb-3 text-gray-900">Event Type Distribution</h4>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={report.eventTypeDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ _id, percent }) => `${_id} (${(percent * 100).toFixed(0)}%)`}
                              outerRadius={80}
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

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold mb-3 text-gray-900">Question Difficulty</h4>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={report.questionStatistics.byDifficulty}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'events' && (
                  <div className="space-y-6">
                    {/* Urgent Events */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600">
                        <AlertCircle size={20} />
                        Critical - Closing in 2 Days
                      </h3>
                      {report.upcomingEvents.urgent.length > 0 ? (
                        <div className="space-y-3">
                          {report.upcomingEvents.urgent.map((event, idx) => (
                            <div key={idx} className={`p-4 rounded-lg border-2 ${getUrgencyColor(event.daysRemaining)}`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{getUrgencyIcon(event.daysRemaining)}</span>
                                    <h4 className="font-semibold text-gray-900">{event.name}</h4>
                                    <span className="px-2 py-1 bg-white rounded text-xs font-medium border">
                                      {event.event_type}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">{event.organization_id.abbreviation}</span> - {event.organization_id.name}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    End Date: {formatDate(event.end_date)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold">{event.daysRemaining}</div>
                                  <div className="text-xs font-medium">days left</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No critical events</p>
                      )}
                    </div>

                    {/* Soon Events */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-600">
                        <Calendar size={20} />
                        Upcoming - Closing in 3-5 Days
                      </h3>
                      <div className="space-y-3">
                        {report.upcomingEvents.soon.map((event, idx) => (
                          <div key={idx} className={`p-4 rounded-lg border ${getUrgencyColor(event.daysRemaining)}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-gray-900">{event.name}</h4>
                                  <span className="px-2 py-1 bg-white rounded text-xs font-medium border">
                                    {event.event_type}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">{event.organization_id.abbreviation}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-orange-600">{event.daysRemaining}d</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={report.currentAffairsBreakdown}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="_id" angle={-45} textAnchor="end" height={80} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Key Insights */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                      <h3 className="text-lg font-semibold mb-4 text-blue-900">📊 Key Insights</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <p className="text-gray-700">
                            <span className="font-semibold">{report.insights.mostActiveSection}</span> was the most active section this week
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                          <p className="text-gray-700">
                            <span className="font-semibold">{report.insights.criticalEventsCount}</span> events require immediate attention
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <p className="text-gray-700">
                            Platform activity is showing <span className="font-semibold">{report.insights.growthIndicator}</span> growth
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Report Generated</h3>
            <p className="text-gray-500 mb-6">Click the "Generate Report" button to create your weekly analytics report</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;