import React, { useState } from 'react';
import { Edit, Trash2, RotateCcw, Calendar, Eye, EyeOff } from 'lucide-react';

const QuestionCard = ({ question, onEdit, onDelete, onReuse, isLoading }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [actionLoading, setActionLoading] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return 'Never used';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = async (action, actionName) => {
    setActionLoading(actionName);
    try {
      await action();
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      handleAction(() => onDelete(question._id), 'delete');
    }
  };

  const getOptionLabel = (index) => String.fromCharCode(65 + index);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
            {question.category}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            MCQ
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{question.question}</h3>

        <div className="space-y-2 mb-4">
          {question.options.filter(option => option.trim() !== '').map((option, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-3 p-2 rounded-lg border ${
                showAnswer && index === question.correctAnswer 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <span className="font-medium text-gray-600 min-w-[20px]">
                {getOptionLabel(index)}.
              </span>
              <span className={`flex-1 ${
                showAnswer && index === question.correctAnswer 
                  ? 'text-green-800 font-medium' 
                  : 'text-gray-700'
              }`}>
                {option}
              </span>
              {showAnswer && index === question.correctAnswer && (
                <span className="text-green-600 text-sm font-medium">✓ Correct</span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium mb-3"
        >
          {showAnswer ? '👁️‍🗨️ Hide Answer' : '👁️ Show Answer'}
        </button>

        {showAnswer && question.explanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <h4 className="font-medium text-blue-800 mb-1">Explanation:</h4>
            <p className="text-blue-700 text-sm">{question.explanation}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>📅 Created: {formatDate(question.createdAt)}</span>
          {question.lastUsed && (
            <span>🔄 Last used: {formatDate(question.lastUsed)}</span>
          )}
          {question.year && <span>📅 Previously asked in: {question.year}</span>}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleAction(() => onEdit(question), 'edit')}
            disabled={isLoading || actionLoading}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 px-3 py-1 rounded hover:bg-blue-50 transition-colors text-sm disabled:opacity-50"
          >
            {actionLoading === 'edit' ? '⏳' : '✏️'} Edit
          </button>
          
          <button
            onClick={() => handleAction(() => onReuse(question._id), 'reuse')}
            disabled={isLoading || actionLoading}
            className="flex items-center gap-1 text-green-600 hover:text-green-700 px-3 py-1 rounded hover:bg-green-50 transition-colors text-sm disabled:opacity-50"
          >
            {actionLoading === 'reuse' ? '⏳' : '🔄'} Reuse
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isLoading || actionLoading}
            className="flex items-center gap-1 text-red-600 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50 transition-colors text-sm disabled:opacity-50"
          >
            {actionLoading === 'delete' ? '⏳' : '🗑️'} Delete
          </button>
        </div>
      </div>
    </div>
  );
};


export default QuestionCard;