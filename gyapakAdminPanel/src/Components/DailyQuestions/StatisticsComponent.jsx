import React from 'react';
import { BarChart3, TrendingUp, Target, Calendar } from 'lucide-react';

const Statistics = ({ questions, categories }) => {
  const totalQuestions = questions.length;
  const usedQuestions = questions.filter(q => q.lastUsed).length;
  const unusedQuestions = totalQuestions - usedQuestions;

  // Category distribution
  const categoryStats = categories.map(category => ({
    name: category,
    count: questions.filter(q => q.category === category).length
  })).filter(stat => stat.count > 0);

  // Difficulty distribution
  const difficultyStats = [
    { name: 'Easy', count: questions.filter(q => q.difficulty === 'Easy').length, color: 'bg-green-500' },
    { name: 'Medium', count: questions.filter(q => q.difficulty === 'Medium').length, color: 'bg-yellow-500' },
    { name: 'Hard', count: questions.filter(q => q.difficulty === 'Hard').length, color: 'bg-red-500' }
  ].filter(stat => stat.count > 0);

  // Recent activity (questions created in last 7 days)
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const recentQuestions = questions.filter(q => new Date(q.createdAt) > lastWeek).length;

  // Most used category
  const mostUsedCategory = categoryStats.length > 0 
    ? categoryStats.reduce((prev, current) => (prev.count > current.count) ? prev : current)
    : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 size={24} className="text-purple-600" />
        <h3 className="text-xl font-bold text-purple-800">Statistics</h3>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-3xl font-bold text-purple-600 mb-1">{totalQuestions}</div>
          <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
            <Target size={14} />
            Total Questions
          </div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-3xl font-bold text-green-600 mb-1">{usedQuestions}</div>
          <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
            <TrendingUp size={14} />
            Questions Used
          </div>
        </div>

        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600 mb-1">{unusedQuestions}</div>
          <div className="text-sm text-gray-600">Unused Questions</div>
        </div>

        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-3xl font-bold text-orange-600 mb-1">{recentQuestions}</div>
          <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
            <Calendar size={14} />
            Created This Week
          </div>
        </div>
      </div>

      {/* Usage Rate */}
      {totalQuestions > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Usage Rate</span>
            <span className="text-sm text-gray-600">
              {Math.round((usedQuestions / totalQuestions) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(usedQuestions / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Category and Difficulty Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        {categoryStats.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Category Distribution</h4>
            <div className="space-y-2">
              {categoryStats.map((stat, index) => (
                <div key={stat.name} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{stat.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-purple-500 h-1.5 rounded-full"
                        style={{ width: `${(stat.count / totalQuestions) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800 w-6 text-right">
                      {stat.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {mostUsedCategory && (
              <div className="mt-3 text-xs text-gray-500">
                Most questions: {mostUsedCategory.name} ({mostUsedCategory.count})
              </div>
            )}
          </div>
        )}

        {/* Difficulty Distribution */}
        {difficultyStats.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Difficulty Distribution</h4>
            <div className="space-y-2">
              {difficultyStats.map((stat) => (
                <div key={stat.name} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{stat.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`${stat.color} h-1.5 rounded-full`}
                        style={{ width: `${(stat.count / totalQuestions) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800 w-6 text-right">
                      {stat.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {totalQuestions === 0 && (
        <div className="text-center py-8 text-gray-500">
          <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2">No questions yet</p>
          <p className="text-sm">Create your first MCQ question to see statistics</p>
        </div>
      )}
    </div>
  );
};

export default Statistics;