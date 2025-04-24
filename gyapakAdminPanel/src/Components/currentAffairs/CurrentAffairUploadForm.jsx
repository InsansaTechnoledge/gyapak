import React, { useState } from 'react';
import { uploadCurrentAffair } from '../../Services/service';
import { Calendar, Tag, Globe, Eye, Link, Image, Video, Plus, Trash2, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const categoryOptions = [
  'Politics', 'Economy', 'International', 'Science & Tech',
  'Environment', 'Sports', 'Awards', 'Obituaries', 'Miscellaneous'
];

const initialAffair = {
  title: '',
  content: '',
  tags: '',
  category: '',
  language: 'en',
  visibility: 'public',
  source: '',
  imageUrl: '',
  videoUrl: '',
  questions: [
    {
      text: '',
      options: ['', '', '', ''],
      answer: ''
    }
  ]
  
};

export default function CurrentAffairUploadForm() {
  const [date, setDate] = useState('');
  const [affairs, setAffairs] = useState([{ ...initialAffair }]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (index, field, value) => {
    const updated = [...affairs];
    updated[index][field] = value;
    setAffairs(updated);
  };

  const addAffair = () => {
    setAffairs([...affairs, { ...initialAffair }]);
  };

  const removeAffair = (index) => {
    const updated = affairs.filter((_, i) => i !== index);
    setAffairs(updated);
  };

  const handleQuestionChange = (affairIndex, qIndex, field, value) => {
    const updatedAffairs = [...affairs];
    updatedAffairs[affairIndex].questions[qIndex][field] = value;
    setAffairs(updatedAffairs);
  };
  
  const handleOptionChange = (affairIndex, qIndex, optIndex, value) => {
    const updated = [...affairs];
    updated[affairIndex].questions[qIndex].options[optIndex] = value;
    setAffairs(updated);
  };
  
  const addQuestion = (affairIndex) => {
    const updated = [...affairs];
    updated[affairIndex].questions.push({
      text: '',
      options: ['', '', '', ''],
      answer: ''
    });
    setAffairs(updated);
  };
  
  const removeQuestion = (affairIndex, qIndex) => {
    const updated = [...affairs];
    updated[affairIndex].questions.splice(qIndex, 1);
    setAffairs(updated);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
  
    const formatted = affairs.map((a) => ({
      ...a,
      tags: Array.isArray(a.tags)
        ? a.tags
        : a.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    }));
  
    const payload = { date, affairs: formatted };
  
    console.log('📤 Uploading payload:', payload);
  
    try {
      const res = await uploadCurrentAffair(payload);
      console.log('✅ Response:', res);
      setSuccessMsg('Current affairs uploaded successfully!');
      setErrorMsg('');
      setAffairs([{ ...initialAffair }]);
      setDate('');
    } catch (err) {
      console.error('❌ Upload failed:', err);
      setErrorMsg(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Current Affairs Management</h1>
        <p className="text-gray-500 mt-2">Upload and manage daily current affairs content</p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>{successMsg}</span>
        </div>
      )}
      
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-gray-700 font-medium mb-2 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            <span>Select Date</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        {affairs.map((affair, index) => (
          <div key={index} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <div className="bg-blue-50 p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                Current Affair #{index + 1}
                {affairs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAffair(index)}
                    className="ml-auto flex items-center text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span>Remove</span>
                  </button>
                )}
              </h3>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={affair.title}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  placeholder="Enter a descriptive title"
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Content</label>
                <textarea
                  value={affair.content}
                  onChange={(e) => handleChange(index, 'content', e.target.value)}
                  placeholder="Enter the detailed content here"
                  required
                  rows={4}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Tags</span>
                  </label>
                  <input
                    type="text"
                    value={affair.tags}
                    onChange={(e) => handleChange(index, 'tags', e.target.value)}
                    placeholder="Separate tags with commas"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Category</label>
                  <select
                    value={affair.category}
                    onChange={(e) => handleChange(index, 'category', e.target.value)}
                    required
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                  >
                    <option value="">Select a category</option>
                    {categoryOptions.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Language</span>
                  </label>
                  <select
                    value={affair.language}
                    onChange={(e) => handleChange(index, 'language', e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Visibility</span>
                  </label>
                  <select
                    value={affair.visibility}
                    onChange={(e) => handleChange(index, 'visibility', e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <Link className="h-4 w-4 mr-2 text-blue-600" />
                  <span>Source URL</span>
                </label>
                <input
                  type="url"
                  value={affair.source}
                  onChange={(e) => handleChange(index, 'source', e.target.value)}
                  placeholder="https://source.com/article"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <Image className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Image URL</span>
                  </label>
                  <input
                    type="url"
                    value={affair.imageUrl}
                    onChange={(e) => handleChange(index, 'imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <Video className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Video URL</span>
                  </label>
                  <input
                    type="url"
                    value={affair.videoUrl}
                    onChange={(e) => handleChange(index, 'videoUrl', e.target.value)}
                    placeholder="https://youtube.com/watch?v=xyz"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div className="mt-6">
  <h4 className="text-md font-semibold text-purple-800 mb-3">🧠 Add Questions</h4>
  {affair.questions.map((q, qIndex) => (
    <div key={qIndex} className="bg-purple-50 p-4 rounded border border-purple-200 mb-4 space-y-3">
      <input
        type="text"
        value={q.text}
        onChange={(e) => handleQuestionChange(index, qIndex, 'text', e.target.value)}
        placeholder="Enter question text"
        className="w-full border border-gray-300 p-2 rounded"
      />
      {q.options.map((opt, optIndex) => (
        <input
          key={optIndex}
          type="text"
          value={opt}
          onChange={(e) => handleOptionChange(index, qIndex, optIndex, e.target.value)}
          placeholder={`Option ${optIndex + 1}`}
          className="w-full border border-gray-300 p-2 rounded"
        />
      ))}
      <input
        type="text"
        value={q.answer}
        onChange={(e) => handleQuestionChange(index, qIndex, 'answer', e.target.value)}
        placeholder="Correct answer"
        className="w-full border border-green-300 p-2 rounded"
      />
      <button
        type="button"
        onClick={() => removeQuestion(index, qIndex)}
        className="text-red-600 text-sm underline"
      >
        Remove Question
      </button>
    </div>
  ))}
  <button
    type="button"
    onClick={() => addQuestion(index)}
    className="text-blue-600 text-sm underline"
  >
    + Add Question
  </button>
</div>

              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
          <button
            type="button"
            onClick={addAffair}
            className="flex items-center justify-center text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 transition px-4 py-2 rounded-lg w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Add Another Current Affair</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition w-full sm:w-auto"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2 block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                <span>Submit</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}