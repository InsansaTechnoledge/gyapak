import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Tag, 
  Image as ImageIcon, 
  Video, 
  Globe, 
  Layers,
  Link,
  FileText,
  Plus,
  Trash2,
  FileQuestion,
  HelpCircle
} from 'lucide-react';

const categoryOptions = [
  'Politics', 'Economy', 'International', 'Science & Tech',
  'Environment', 'Sports', 'Awards', 'Obituaries', 'Miscellaneous'
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' }
];

const EditAffairModal = ({ isOpen, onClose, record, onSubmit }) => {
  const [formData, setFormData] = useState({ affairs: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData(record);
    }
  }, [record]);

  const handleFieldChange = (i, field, value) => {
    const updated = [...formData.affairs];
    updated[i][field] = value;
    setFormData({ ...formData, affairs: updated });
  };

  const handleQuestionChange = (affairIndex, qIndex, field, value) => {
    const updatedAffairs = [...formData.affairs];
    updatedAffairs[affairIndex].questions[qIndex][field] = value;
    setFormData({ ...formData, affairs: updatedAffairs });
  };
  
  const handleOptionChange = (affairIndex, qIndex, optIndex, value) => {
    const updated = [...formData.affairs];
    updated[affairIndex].questions[qIndex].options[optIndex] = value;
    setFormData({ ...formData, affairs: updated });
  };
  
  const addQuestion = (affairIndex) => {
    const updated = [...formData.affairs];
    if (!updated[affairIndex].questions) {
      updated[affairIndex].questions = [];
    }
    updated[affairIndex].questions.push({
      text: '',
      options: ['', '', '', ''],
      answer: ''
    });
    setFormData({ ...formData, affairs: updated });
  };
  
  const removeQuestion = (affairIndex, qIndex) => {
    const updated = [...formData.affairs];
    updated[affairIndex].questions.splice(qIndex, 1);
    setFormData({ ...formData, affairs: updated });
  };

  const addAffair = () => {
    const newAffair = {
      title: '',
      content: '',
      category: '',
      language: 'en',
      tags: '',
      source: '',
      imageUrl: '',
      videoUrl: '',
      details: '',
      questions: [],
      singleLineQuestions: []
    };
    setFormData({ 
      ...formData, 
      affairs: [...formData.affairs, newAffair] 
    });
  };

  const removeAffair = (affairIndex) => {
    if (formData.affairs.length > 1) {
      const updated = formData.affairs.filter((_, i) => i !== affairIndex);
      setFormData({ ...formData, affairs: updated });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const cleaned = {
        ...formData,
        affairs: formData.affairs.map(a => ({
          ...a,
          tags: Array.isArray(a.tags) ? a.tags : a.tags.split(',').map(t => t.trim()).filter(Boolean)
        }))
      };
      await onSubmit(cleaned);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-md z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col border border-gray-200">
        {/* Modal Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 rounded-t-2xl flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Edit Current Affairs
              </h2>
              <p className="text-blue-100 mt-1">
                {formatDate(formData.date)}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8 bg-gray-50/50">
            <form onSubmit={handleSubmit} className="space-y-8">
              {formData.affairs && formData.affairs.map((affair, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Current Affair #{i + 1}
                    </h3>
                    {formData.affairs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAffair(i)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                        title="Remove this current affair"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Title Field */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Title
                      </label>
                      <input
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        value={affair.title || ''}
                        onChange={(e) => handleFieldChange(i, 'title', e.target.value)}
                        placeholder="Enter a compelling title for this current affair"
                      />
                    </div>
                    
                    {/* Content Field */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                        <FileText className="w-4 h-4 mr-2 text-blue-500" />
                        Content
                      </label>
                      <textarea
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none bg-gray-50 focus:bg-white"
                        value={affair.content || ''}
                        onChange={(e) => handleFieldChange(i, 'content', e.target.value)}
                        placeholder="Write the detailed content of this current affair..."
                        rows="6"
                      />
                    </div>
                    
                    {/* Category and Language Section */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        Classification
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Layers className="h-4 w-4 mr-2 text-purple-500" />
                            Category
                          </label>
                          <select
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                            value={affair.category || ''}
                            onChange={(e) => handleFieldChange(i, 'category', e.target.value)}
                          >
                            <option value="">Select Category</option>
                            {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                        
                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Globe className="h-4 w-4 mr-2 text-blue-500" />
                            Language
                          </label>
                          <select
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                            value={affair.language || 'en'}
                            onChange={(e) => handleFieldChange(i, 'language', e.target.value)}
                          >
                            {languageOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.value === 'en' ? '🇺🇸' : '🇮🇳'} {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tags and Source Section */}
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                          <Tag className="h-4 w-4 mr-2 text-orange-500" />
                          Tags
                        </label>
                        <input
                          placeholder="Enter tags separated by commas (e.g., economy, budget, finance)"
                          value={Array.isArray(affair.tags) ? affair.tags.join(', ') : affair.tags || ''}
                          onChange={(e) => handleFieldChange(i, 'tags', e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                          <Link className="h-4 w-4 mr-2 text-blue-500" />
                          Source URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://example.com/news-source"
                          value={affair.source || ''}
                          onChange={(e) => handleFieldChange(i, 'source', e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        />
                      </div>
                    </div>
                    
                    {/* Media URLs Section */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                        Media & Resources
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <ImageIcon className="h-4 w-4 mr-2 text-green-500" />
                            Image URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={affair.imageUrl || ''}
                            onChange={(e) => handleFieldChange(i, 'imageUrl', e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                          />
                        </div>
                        
                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Video className="h-4 w-4 mr-2 text-red-500" />
                            Video URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://youtube.com/watch?v=xyz"
                            value={affair.videoUrl || ''}
                            onChange={(e) => handleFieldChange(i, 'videoUrl', e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Detailed Notes Section */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                      <h4 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                        Detailed Analysis & Notes
                      </h4>
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                          <FileText className="h-4 w-4 mr-2 text-indigo-500" />
                          Background Information & Impact Analysis
                        </label>
                        <textarea
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white resize-none"
                          value={affair.details || ''}
                          onChange={(e) => handleFieldChange(i, 'details', e.target.value)}
                          placeholder="Add comprehensive background information, impact analysis, key stakeholders, implications, and additional context that helps understand the significance of this current affair..."
                          rows="6"
                        />
                        <p className="text-xs text-gray-500 mt-2 flex items-center">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                          Include background context, impact analysis, and key takeaways for better understanding
                        </p>
                      </div>
                    </div>

                    {/* MCQ Questions Section */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-semibold text-purple-800 flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                          Multiple Choice Questions
                        </h4>
                        <button
                          type="button"
                          onClick={() => addQuestion(i)}
                          className="flex items-center text-sm bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Question
                        </button>
                      </div>
                      
                      {affair.questions && affair.questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-white rounded-xl p-5 border border-purple-200 mb-4 shadow-sm">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                              Question {qIndex + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeQuestion(i, qIndex)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            <input
                              type="text"
                              value={q.text}
                              onChange={(e) => handleQuestionChange(i, qIndex, 'text', e.target.value)}
                              placeholder="Enter your question here..."
                              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {q.options.map((opt, optIndex) => (
                                <input
                                  key={optIndex}
                                  type="text"
                                  value={opt}
                                  onChange={(e) => handleOptionChange(i, qIndex, optIndex, e.target.value)}
                                  placeholder={`Option ${optIndex + 1}`}
                                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                />
                              ))}
                            </div>
                            
                            <input
                              type="text"
                              value={q.answer}
                              onChange={(e) => handleQuestionChange(i, qIndex, 'answer', e.target.value)}
                              placeholder="Correct answer"
                              className="w-full border-2 border-green-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-green-50"
                            />
                          </div>
                        </div>
                      ))}
                      
                      {!affair.questions || affair.questions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FileQuestion className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                          <p>No questions added yet. Click "Add Question" to start.</p>
                        </div>
                      ) : null}
                    </div>

                    {/* Single Line Questions Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-semibold text-blue-800 flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                          Short Answer Questions
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.affairs];
                            updated[i].singleLineQuestions = updated[i].singleLineQuestions || [];
                            updated[i].singleLineQuestions.push({ text: '' });
                            setFormData({ ...formData, affairs: updated });
                          }}
                          className="flex items-center text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Question
                        </button>
                      </div>
                      
                      {Array.isArray(affair.singleLineQuestions) && affair.singleLineQuestions.length > 0 ?
                        affair.singleLineQuestions.map((q, qIndex) => (
                          <div key={qIndex} className="bg-white rounded-xl p-4 border border-blue-200 mb-3 shadow-sm">
                            <div className="flex gap-3 items-center">
                              <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full flex-shrink-0">
                                Q{qIndex + 1}
                              </span>
                              <input
                                type="text"
                                value={q.text}
                                onChange={(e) => {
                                  const updated = [...formData.affairs];
                                  updated[i].singleLineQuestions[qIndex] = {
                                    ...updated[i].singleLineQuestions[qIndex],
                                    text: e.target.value
                                  };
                                  setFormData({ ...formData, affairs: updated });
                                }}
                                placeholder={`Enter short question ${qIndex + 1}...`}
                                className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...formData.affairs];
                                  updated[i].singleLineQuestions.splice(qIndex, 1);
                                  setFormData({ ...formData, affairs: updated });
                                }}
                                className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )) :
                        <div className="text-center py-8 text-gray-500">
                          <HelpCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                          <p>No short questions added yet. Click "Add Question" to start.</p>
                        </div>
                      }
                    </div>
                  </div>
                </div>
            ))}

            {/* Add Another Current Affair Button */}
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={addAffair}
                className="flex items-center justify-center text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 transition px-4 py-2 rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>Add Another Current Affair</span>
              </button>
            </div>
          </form>
        </div>
        </div>
        
        {/* Professional Modal Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-t border-gray-200 flex justify-end gap-4 sticky bottom-0 z-10">
          <button
            type="button"
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-medium transition-all duration-200 flex items-center"
            onClick={onClose}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2 block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Updating Current Affairs...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span>Update Current Affairs</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAffairModal;