import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Tag, 
  Image as ImageIcon, 
  Video, 
  Globe, 
  Layers,
  Link
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
    updated[affairIndex].questions = updated[affairIndex].questions || [];
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            Edit Current Affairs
            <span className="block text-sm font-normal text-gray-500 mt-1">
              {formatDate(formData.date)}
            </span>
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="overflow-y-auto p-6 flex-grow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {formData.affairs && formData.affairs.map((affair, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Current Affair #{i + 1}</h3>
                </div>
                
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      value={affair.title || ''}
                      onChange={(e) => handleFieldChange(i, 'title', e.target.value)}
                      placeholder="Enter title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      rows={3}
                      value={affair.content || ''}
                      onChange={(e) => handleFieldChange(i, 'content', e.target.value)}
                      placeholder="Enter content"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Layers className="h-4 w-4 mr-1 text-blue-600" />
                        Category
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                        value={affair.category || ''}
                        onChange={(e) => handleFieldChange(i, 'category', e.target.value)}
                      >
                        <option value="">Select Category</option>
                        {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Globe className="h-4 w-4 mr-1 text-blue-600" />
                        Language
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                        value={affair.language || 'en'}
                        onChange={(e) => handleFieldChange(i, 'language', e.target.value)}
                      >
                        {languageOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <Tag className="h-4 w-4 mr-1 text-blue-600" />
                      Tags
                    </label>
                    <input
                      placeholder="Enter tags separated by commas"
                      value={Array.isArray(affair.tags) ? affair.tags.join(', ') : affair.tags || ''}
                      onChange={(e) => handleFieldChange(i, 'tags', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <Link className="h-4 w-4 mr-1 text-blue-600" />
                      Source URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/source"
                      value={affair.source || ''}
                      onChange={(e) => handleFieldChange(i, 'source', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <ImageIcon className="h-4 w-4 mr-1 text-blue-600" />
                        Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={affair.imageUrl || ''}
                        onChange={(e) => handleFieldChange(i, 'imageUrl', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Notes</label>
                    <textarea
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        rows={5}
                        value={affair.details || ''}
                        onChange={(e) => handleFieldChange(i, 'details', e.target.value)}
                        placeholder="Add background, impact, analysis, etc."
                    />
                    </div>

                    
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Video className="h-4 w-4 mr-1 text-blue-600" />
                        Video URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/watch?v=xyz"
                        value={affair.videoUrl || ''}
                        onChange={(e) => handleFieldChange(i, 'videoUrl', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>

                    {affair.questions && affair.questions.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-md font-semibold text-purple-800 mb-3">🧠 Edit Questions</h4>
                        {affair.questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-purple-50 p-4 rounded border border-purple-200 mb-4 space-y-3">
                            <input
                            type="text"
                            value={q.text}
                            onChange={(e) => handleQuestionChange(i, qIndex, 'text', e.target.value)}
                            placeholder="Question text"
                            className="w-full border border-gray-300 p-2 rounded"
                            />
                            {q.options.map((opt, optIndex) => (
                            <input
                                key={optIndex}
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(i, qIndex, optIndex, e.target.value)}
                                placeholder={`Option ${optIndex + 1}`}
                                className="w-full border border-gray-300 p-2 rounded"
                            />
                            ))}
                            <input
                            type="text"
                            value={q.answer}
                            onChange={(e) => handleQuestionChange(i, qIndex, 'answer', e.target.value)}
                            placeholder="Correct answer"
                            className="w-full border border-green-300 p-2 rounded"
                            />
                            <button
                            type="button"
                            onClick={() => removeQuestion(i, qIndex)}
                            className="text-red-600 text-sm underline"
                            >
                            Remove Question
                            </button>
                        </div>
                        ))}
                        <button
                        type="button"
                        onClick={() => addQuestion(i)}
                        className="text-blue-600 text-sm underline"
                        >
                        + Add Question
                        </button>
                    </div>
                    )}

                    {/* Single Line Questions */}
                    {Array.isArray(affair.singleLineQuestions) &&
  affair.singleLineQuestions.map((q, qIndex) => (
    <div key={qIndex} className="flex gap-2 mb-2">
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
        placeholder={`Question ${qIndex + 1}`}
        className="w-full border border-gray-300 px-3 py-2 rounded-lg"
      />
      <button
        type="button"
        onClick={() => {
          const updated = [...formData.affairs];
          updated[i].singleLineQuestions.splice(qIndex, 1);
          setFormData({ ...formData, affairs: updated });
        }}
        className="text-red-600 text-xs underline"
      >
        Remove
      </button>
    </div>
  ))}
<button
  type="button"
  onClick={() => {
    const updated = [...formData.affairs];
    updated[i].singleLineQuestions = updated[i].singleLineQuestions || [];
    updated[i].singleLineQuestions.push({ text: '' });
    setFormData({ ...formData, affairs: updated });
  }}
  className="text-blue-600 text-sm underline mt-2"
>
  + Add Single Line Question
</button>


                  </div>
                </div>
              </div>
            ))}
          </form>
        </div>
        
        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white z-10">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center justify-center"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2 block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span>Update</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAffairModal;