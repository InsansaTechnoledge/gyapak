import React from "react";
import { useAuth } from "../../Context/AuthContext";
import { TrendingUp, Award, Calendar, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Exams",
      value: "12",
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Average Score",
      value: "85%",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Best Score",
      value: "98%",
      icon: Award,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  const recentActivity = [
    {
      exam: "SSC CGL Mock Test 5",
      date: "2 days ago",
      score: "92%",
    },
    {
      exam: "UPSC Prelims Practice",
      date: "5 days ago",
      score: "88%",
    },
    {
      exam: "Banking Awareness Quiz",
      date: "1 week ago",
      score: "95%",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || "User"}! 👋
        </h1>
        <p className="text-indigo-100">
          Here's an overview of your exam performance and activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`${stat.bgColor} p-4 rounded-xl`}
              >
                <stat.icon className={`${stat.textColor}`} size={28} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <a
            href="/dashboard/exam-history"
            className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 border border-gray-100"
            >
              <div>
                <h3 className="font-semibold text-gray-900">{activity.exam}</h3>
                <p className="text-sm text-gray-600">{activity.date}</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold">
                  {activity.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Start New Exam
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            Choose from our collection of practice exams and mock tests.
          </p>
          <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/30">
            Browse Exams
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Study Resources
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            Access study materials, notes, and preparation guides.
          </p>
          <button className="w-full border-2 border-purple-600 text-purple-600 font-semibold py-3 px-4 rounded-lg hover:bg-purple-50 transition-all duration-300">
            View Resources
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
