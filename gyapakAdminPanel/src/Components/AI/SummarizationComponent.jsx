import React, { useState } from 'react';
import { API_BASE_URL } from '../../config';
import axios from 'axios';

const SummarizationComponent = () => {
  const [data, setData] = useState('');
  const [convertedData, setConvertedData] = useState('');
  const [loading, setLoading] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState([]);

  const minLengthVariable = 500;

  const handleConvert = async () => {
    if (data.trim().length < minLengthVariable) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/convert`, {
        text: data,
        minLengthVariable,
        keywords,
      });
      setConvertedData(response.data.summary);
    } catch (error) {
      console.error("Error summarizing:", error);
      setConvertedData("❌ Something went wrong while summarizing.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() !== '' && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (word) => {
    setKeywords(keywords.filter(k => k !== word));
  };

  return (
    <div className="p-10 border-2 border-black/40 rounded-2xl shadow-xl bg-white">
      <p className="text-2xl text-center text-purple-800 font-bold">Content Summarizer</p>
      <p className="text-center text-md text-gray-500 m-4">
        Use AI to get meaningful insights from bulk text
      </p>

      {/* Input Section */}
      <div className="max-w-4xl border mx-auto p-4 flex flex-col rounded-xl shadow-inner bg-gray-50">
        <label htmlFor="dataInput" className="font-medium text-gray-700">
          Dump your entire information below 👇🏻
        </label>

        <textarea
          id="dataInput"
          className="mt-4 px-3 py-2 border-2 border-purple-500/80 rounded-lg w-full 
                     focus:outline-none focus:ring-2 focus:ring-purple-400 transition
                     text-gray-700"
          placeholder="Paste your data here!"
          minLength={minLengthVariable}
          rows={8}
          value={data}
          onChange={(e) => {
            setData(e.target.value);
            setConvertedData('');
          }}
        />

        {data.length < minLengthVariable && (
          <p className="text-gray-400 text-xs mt-3">
            {minLengthVariable - data.length} character
            {minLengthVariable - data.length !== 1 && 's'} remaining to enable conversion
          </p>
        )}

        {/* Keyword Input */}
        <label className="font-medium text-gray-700 mt-5 mb-2">Enter SEO Keywords (Optional)</label>
        <div className="flex gap-3 items-center">
          <input
            className="flex-grow px-3 py-2 border-2 border-purple-500/80 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-purple-400 transition
                        text-gray-700"
            type="text"
            placeholder="Add keyword e.g. job, exam, vacancy..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
          />
          <button
            onClick={handleAddKeyword}
            className="border-2 px-3 py-1 bg-green-600 text-gray-100 rounded-xl hover:bg-green-700 transition"
          >
            Add
          </button>
        </div>

        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {keywords.map((word, index) => (
              <span
                key={index}
                className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {word}
                <button
                  onClick={() => handleRemoveKeyword(word)}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Convert Button */}
        <div className="justify-start flex items-center gap-4">
          <button
            className={`mt-6 border-2 px-5 py-2 rounded-full text-sm shadow-2xl transition-all duration-300 ${
              data.length < minLengthVariable || loading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-purple-900 hover:bg-purple-950 text-gray-100 hover:scale-105'
            }`}
            disabled={data.length < minLengthVariable || loading}
            onClick={handleConvert}
          >
            {loading ? 'Loading...' : 'Convert'}
          </button>
        </div>
      </div>

      {/* Output Section */}
      {convertedData.trim() && (
        <div className="border-2 p-6 mt-10 border-black/30 rounded-2xl bg-gray-50 max-w-4xl mx-auto">
          <p className="text-2xl text-center text-purple-800 font-bold mb-4">
            Summarized Content
          </p>
          <p className="text-sm text-gray-500 m-4">
            Length of converted data: {convertedData.length}
          </p>
          <div
            className="content text-gray-700 whitespace-pre-wrap max-h-60 overflow-y-auto
                       border border-gray-300 rounded-lg p-4 bg-white"
          >
            <p>{convertedData}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummarizationComponent;
