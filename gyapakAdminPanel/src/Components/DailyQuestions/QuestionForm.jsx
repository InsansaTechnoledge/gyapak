import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';

const QuestionForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingQuestion, 
  categories 
}) => {
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    category: '',
    difficulty: 'Medium',
    explanation: '',
    year: ''
  });

  useEffect(() => {
    if (editingQuestion) {
      setFormData({
        question: editingQuestion.question,
        options: editingQuestion.options,
        correctAnswer: editingQuestion.correctAnswer,
        category: editingQuestion.category,
        difficulty: editingQuestion.difficulty,
        explanation: editingQuestion.explanation || '',
        year: editingQuestion.year || ''
      });
    } else {
      setFormData({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        category: '',
        difficulty: 'Medium',
        explanation: '',
        year: ''
      });
    }
  }, [editingQuestion, isOpen]);

  const handleSubmit = () => {
    if (!formData.question || !formData.category) return;
    
    // Check if all options are filled
    const filledOptions = formData.options.filter(option => option.trim() !== '');
    if (filledOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    // Check if correct answer is valid
    if (formData.correctAnswer >= filledOptions.length || !formData.options[formData.correctAnswer].trim()) {
      alert('Please select a valid correct answer');
      return;
    }

    onSubmit(formData);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        options: newOptions,
        correctAnswer: prev.correctAnswer >= index ? Math.max(0, prev.correctAnswer - 1) : prev.correctAnswer
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col border border-gray-200">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 rounded-t-2xl flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-white">
                {editingQuestion ? 'Edit MCQ Question' : 'Create New MCQ Question'}
              </h3>
              <p className="text-indigo-100 mt-1">
                {editingQuestion ? 'Update question details below' : 'Fill in the details to create a new multiple choice question'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8 bg-gray-50/50">
            {/* Question Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                Question *
              </label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none bg-gray-50 focus:bg-white"
                rows="4"
                placeholder="Enter your multiple choice question here..."
              />
            </div>

            {/* Answer Options Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-4">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Answer Options *
              </label>
              <div className="space-y-4">
                {formData.options.map((option, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-2 border-transparent hover:border-gray-200 transition-all duration-200">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={formData.correctAnswer === index}
                          onChange={() => setFormData(prev => ({ ...prev, correctAnswer: index }))}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                          disabled={!option.trim()}
                        />
                        <span className="ml-3 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-semibold">
                          {String.fromCharCode(65 + index)}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                        placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                      />
                      {formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                        >
                          <Minus size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {formData.options.length < 6 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 border-2 border-dashed border-indigo-200 hover:border-indigo-300 w-full justify-center"
                  >
                    <Plus size={18} />
                    Add Another Option
                  </button>
                )}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 flex items-center">
                  <span className="w-4 h-4 bg-blue-500 rounded-full mr-2 flex items-center justify-center text-white text-xs">!</span>
                  Select the radio button next to the correct answer
                </p>
              </div>
            </div>

            {/* Category and Difficulty Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Question Classification
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  >
                    <option value="Easy">🟢 Easy</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Hard">🔴 Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Year Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                Previously Asked in Year *
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="e.g., 2023, 2024"
              />
            </div>

            {/* Explanation Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Explanation (Optional)
              </label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none bg-gray-50 focus:bg-white"
                rows="4"
                placeholder="Provide a detailed explanation for the correct answer..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Help students understand why this is the correct answer
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="bg-white border-t border-gray-200 px-8 py-6 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center rounded-b-2xl flex-shrink-0">
          <div className="text-sm text-gray-600">
            <span className="text-red-500">*</span> Required fields
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {editingQuestion ? '✓ Update Question' : '+ Create Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;