import React, { useEffect, useState } from 'react';
import CurrentAffairUploadForm from '../Components/currentAffairs/CurrentAffairUploadForm';
import { createNewPdf, fetchpdfs } from '../Services/CurrentAffairSevice';

const UploadCurrentAffairsPage = () => {
  const [date, setDate] = useState('');
  const [pdfLink , setPdfLink] = useState('');
  const [title, setTitle] = useState('');
  const [category , setCategory] = useState('');
  const [description , setDescription] = useState('');
  const [tags , setTags] = useState([]);
  
  const CategoryDropdown = ['Current Affairs', 'Editorial', 'MCQs', 'Monthly Summary'];
  const [tagInput, setTagInput] = useState('');

  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async () => {
    const formdata = {
      date,
      pdfLink,
      title,
      category,
      description,
      tags,
    }
    await createNewPdf(formdata);
    console.log("asd", formdata);
    alert('done')
    
  }


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="bg-white w-full max-w-3xl shadow-lg rounded-2xl p-8 mb-10">

        {/* Header */}
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Upload Daily Current Affair PDF</h1>
          <p className="text-sm text-gray-500 mt-2">
            Upload the daily current affairs PDF here. <br />
            <span className="text-red-500 font-medium">Only one upload per date is allowed.</span>
          </p>
        </div>

        {/* Date */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <label className="text-md font-medium text-gray-700">Choose Date of Upload:</label>
          <input 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <label className="text-md font-medium text-gray-700">Choose Title for Today</label>
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter your title here'
            className="border border-gray-300 rounded-xl px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-3 mb-8">
          <label className="text-md font-medium text-gray-700">Write a brief Description (max 500 words)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your description here..."
            rows={6}
            maxLength={3000} // roughly 500 words
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
          />
          <p className="text-sm text-gray-400 text-right">{description.length}/3000 characters</p>
        </div>

        {/* Category */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <label className="text-md font-medium text-gray-700">Choose Category</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}             
            className="border border-gray-300 rounded-xl px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option className='text-sm text-gray-400' value="">--Choose Category--</option>
            {CategoryDropdown.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* PDF Link */}
        <div className="flex flex-col gap-3 mb-8">
          <label className="text-md font-medium text-gray-700">PDF Link</label>
          <input
            type="url"
            value={pdfLink}
            onChange={(e) => setPdfLink(e.target.value)}
            placeholder="Enter your PDF link here"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Tags Input */}
        <div className="flex flex-col gap-3 mb-8">
          <label className="text-md font-medium text-gray-700">Tags</label>
          <div className="flex flex-wrap items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
              >
                {tag}
                <button
                  onClick={() => removeTag(index)}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none"
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
              placeholder="Type and press Enter..."
              className="flex-grow border-none focus:outline-none text-gray-800 min-w-[150px]"
            />
          </div>
        </div>

        <button className='border-1 py-3 px-4 rounded-2xl mb-4 bg-purple-700 text-gray-100' onClick={handleUpload}>Upload Pdf</button>

        {/* Upload Form */}
        <div className="border-t pt-6">
          <CurrentAffairUploadForm selectedDate={date} />
        </div>

      </div>
    </div>
  );
};

export default UploadCurrentAffairsPage;
