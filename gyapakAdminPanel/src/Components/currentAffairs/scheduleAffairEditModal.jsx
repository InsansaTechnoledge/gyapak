import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Calendar, 
  FileText, 
  Link, 
  Tag, 
  User, 
  Layers 
} from 'lucide-react';

const categoryOptions = [
  'Daily Summary',
  'Weekly Summary',
  'Monthly Summary',
  'Special Edition'
];

const ScheduleAffairEditModal = ({ isOpen, onClose, record, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    pdfLink: '',
    category: '',
    uploadedBy: '',
    description: '',
    tags: [],
    scheduledPublishDate: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

// Helper function to convert UTC to Local string for datetime-local input
const utcToLocalInput = (utcISOString) => {
    if (!utcISOString) return '';
    
    // Create date from UTC ISO string
    const date = new Date(utcISOString);
    
    // Format to datetime-local format (YYYY-MM-DDTHH:mm)
    // This automatically uses the browser's local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };


// Helper function to convert Local input to UTC for storage
const localToUTC = (localDateString) => {
  if (!localDateString) return '';
  
  // Create date from local input (browser interprets as local time)
  const localDate = new Date(localDateString);
  return localDate.toISOString();
};

  // Tag handling functions
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, index) => index !== indexToRemove)
    });
  };
useEffect(() => {
    if (record) {
      console.log('📋 Record received:', record);
      console.log('📅 scheduledPublishDate (UTC):', record.scheduledPublishDate);
      console.log('📅 Converted to local for input:', utcToLocalInput(record.scheduledPublishDate));
      
      setFormData({
        date: utcToLocalInput(record.date),
        title: record.title || '',
        pdfLink: record.pdfLink || '',
        category: record.category || '',
        uploadedBy: record.uploadedBy || 'Admin',
        description: record.description || '',
        tags: Array.isArray(record.tags) ? record.tags : [],
        scheduledPublishDate: utcToLocalInput(record.scheduledPublishDate)
      });
      setTagInput('');
    }
  }, [record]);


const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Convert local datetime to UTC - EXACT same logic as CurrentAffairUpload.jsx
      const localDateForDate = new Date(formData.date);
      const dateUTC = localDateForDate.toISOString();
      
      const localDateForScheduled = new Date(formData.scheduledPublishDate);
      const scheduledDateUTC = localDateForScheduled.toISOString();
      const updatedData = {
        ...record,
        date: dateUTC,
        title: formData.title,
        pdfLink: formData.pdfLink,
        category: formData.category,
        uploadedBy: formData.uploadedBy,
        description: formData.description,
        tags: formData.tags,
        scheduledPublishDate: scheduledDateUTC
      };
      
      console.log('📤 Full updated data:', updatedData);
      
      await onSubmit(updatedData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-gray-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 rounded-t-2xl flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Edit Scheduled Current Affair
              </h2>
             
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
        
        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title Field */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <FileText className="w-4 h-4 mr-2 text-blue-500" />
                Title
              </label>
              <input
                type="text"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter the title for this current affair"
                required
              />
            </div>

            {/* Date and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Field */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                  <Calendar className="w-4 h-4 mr-2 text-green-500" />
                  Date (IST)
                </label>
                <input
                  type="datetime-local"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              {/* Category Field */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                  <Layers className="w-4 h-4 mr-2 text-purple-500" />
                  Category
                </label>
                <select
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                
                    <option value={"Monthly Summary"}>Monthly Summary</option>
               
                </select>
              </div>
            </div>

            {/* PDF Link Field */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <Link className="w-4 h-4 mr-2 text-orange-500" />
                PDF Link
              </label>
              <input
                type="text"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                value={formData.pdfLink}
                onChange={(e) => setFormData({ ...formData, pdfLink: e.target.value })}
                placeholder="Enter PDF link or ID"
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <FileText className="w-4 h-4 mr-2 text-teal-500" />
                Description
              </label>
              <textarea
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none bg-gray-50 focus:bg-white"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter a brief description"
                rows="4"
                required
              />
            </div>

            {/* Tags Field */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <Tag className="w-4 h-4 mr-2 text-pink-500" />
                Tags
              </label>
              <div className="flex flex-wrap items-center gap-2 border-2 border-gray-200 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-gray-50 focus-within:bg-white transition-all duration-200 min-h-[50px]">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-blue-600 hover:text-blue-800 focus:outline-none transition-colors"
                    >
                      &times;
                    </button>
                  </span>
                ))}

                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={formData.tags.length === 0 ? "Type and press Enter to add tags..." : "Add more..."}
                  className="flex-grow border-none focus:outline-none text-gray-800 min-w-[150px] bg-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Type a tag and press Enter to add it. Click × to remove.
              </p>
            </div>

            {/* Uploaded By and Scheduled Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Uploaded By Field */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                  <User className="w-4 h-4 mr-2 text-indigo-500" />
                  Uploaded By
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  value={formData.uploadedBy}
                  onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
                  placeholder="Admin"
                  required
                />
              </div>

              {/* Scheduled Publish Date */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                  <Calendar className="w-4 h-4 mr-2 text-red-500" />
                  Scheduled Publish Date (IST)
                </label>
                <input
                  type="datetime-local"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  value={formData.scheduledPublishDate}
                  onChange={(e) => setFormData({ ...formData, scheduledPublishDate: e.target.value })}
                  required
                />
              </div>
            </div>

        
          </form>
        </div>

        {/* Modal Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-t border-gray-200 flex justify-end gap-4 flex-shrink-0">
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
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span>Update Schedule</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAffairEditModal;
