import React, { useState } from "react";
import { Calendar, Clock, Award, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const ExamHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sample exam data
  const examData = [
    {
      id: 1,
      name: "SSC CGL Mock Test 5",
      date: "2024-12-10",
      score: 92,
      totalMarks: 100,
      duration: "60 min",
      status: "Passed",
    },
    {
      id: 2,
      name: "UPSC Prelims Practice Test",
      date: "2024-12-07",
      score: 88,
      totalMarks: 100,
      duration: "120 min",
      status: "Passed",
    },
    {
      id: 3,
      name: "Banking Awareness Quiz",
      date: "2024-12-05",
      score: 95,
      totalMarks: 100,
      duration: "30 min",
      status: "Passed",
    },
    {
      id: 4,
      name: "General Knowledge Test",
      date: "2024-12-03",
      score: 78,
      totalMarks: 100,
      duration: "45 min",
      status: "Passed",
    },
    {
      id: 5,
      name: "Quantitative Aptitude Mock",
      date: "2024-12-01",
      score: 85,
      totalMarks: 100,
      duration: "90 min",
      status: "Passed",
    },
    {
      id: 6,
      name: "English Comprehension Test",
      date: "2024-11-28",
      score: 90,
      totalMarks: 100,
      duration: "60 min",
      status: "Passed",
    },
    {
      id: 7,
      name: "Reasoning Ability Test",
      date: "2024-11-25",
      score: 82,
      totalMarks: 100,
      duration: "75 min",
      status: "Passed",
    },
  ];

  // Pagination
  const totalPages = Math.ceil(examData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExams = examData.slice(startIndex, endIndex);

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 75) return "text-blue-600 bg-blue-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam History</h1>
        <p className="text-gray-600">
          View all your past exam attempts and performance
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Award className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Exams</p>
              <p className="text-2xl font-bold text-gray-900">{examData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Award className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  examData.reduce((acc, exam) => acc + exam.score, 0) /
                    examData.length
                )}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Award className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Best Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.max(...examData.map((exam) => exam.score))}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Exam Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Score
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentExams.map((exam) => (
                <tr
                  key={exam.id}
                  className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{exam.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span>{formatDate(exam.date)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <span>{exam.duration}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-semibold ${getScoreColor(
                        exam.score
                      )}`}
                    >
                      {exam.score}/{exam.totalMarks}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium transition-colors">
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exam Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {currentExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-xl shadow-lg p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-gray-900 text-lg">{exam.name}</h3>
              <span
                className={`px-3 py-1 rounded-full font-semibold text-sm ${getScoreColor(
                  exam.score
                )}`}
              >
                {exam.score}%
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={16} />
                <span>{formatDate(exam.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={16} />
                <span>{exam.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Status:</span>
                <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                  {exam.status}
                </span>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
              <Eye size={16} />
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === page
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Empty State */}
      {examData.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Exams Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't taken any exams yet. Start your first exam to see your
              history here.
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/30">
              Browse Exams
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamHistory;
