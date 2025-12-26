import React, { useEffect, useRef, useState } from "react";
import CurrentAffairUploadForm from "../Components/currentAffairs/CurrentAffairUploadForm";
import { createNewPdf, fetchpdfs } from "../Services/CurrentAffairSevice";

const UploadCurrentAffairsPage = () => {
  const [date, setDate] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledPublishDate, setScheduledPublishDate] = useState("");
  const startTime = useRef(null);
  const CategoryDropdown = [
    "Current Affairs",
    "Editorial",
    "MCQs",
    "Monthly Summary",
  ];
  const [tagInput, setTagInput] = useState("");
  useEffect(() => {
    startTime.current = Date.now();
    console.log(startTime);
  }, []);
  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async () => {
    // Validation for category selection
    if (!category) {
      alert("Please select a category before uploading");
      return;
    }

    // Validation for scheduled uploads
    if (isScheduled && !scheduledPublishDate) {
      alert("Please select a scheduled publish date and time");
      return;
    }

    // Convert scheduledPublishDate from local time to UTC
    let scheduledDateUTC = null;
    if (isScheduled && scheduledPublishDate) {
      // datetime-local gives us "2025-12-15T17:28" in LOCAL timezone
      // We need to convert it to UTC ISO string
      const localDate = new Date(scheduledPublishDate);
      scheduledDateUTC = localDate.toISOString();

      console.log("Local scheduled time:", scheduledPublishDate);
      console.log("UTC scheduled time:", scheduledDateUTC);
      console.log(
        "User timezone offset:",
        -localDate.getTimezoneOffset() / 60,
        "hours"
      );
    }

    const formdata = {
      date,
      pdfLink,
      title,
      category,
      description,
      tags,
      isScheduled,
      scheduledPublishDate: scheduledDateUTC,
    };

    try {
      // Calculate total time and validate
      const totalTime = Math.floor((Date.now() - startTime.current) / 1000);
      
      // Validate totalTime before sending
      if (isNaN(totalTime) || totalTime < 0) {
        console.error("Invalid totalTime calculated:", totalTime);
        alert("Error: Unable to calculate time. Please refresh the page and try again.");
        return;
      }
      
      console.log("total time", totalTime);
      await createNewPdf(formdata, totalTime);
      console.log("Upload data:", formdata);
      alert(
        isScheduled
          ? "PDF scheduled successfully!"
          : "PDF uploaded successfully!"
      );

      // Reset form
      setDate("");
      setPdfLink("");
      setTitle("");
      setCategory("");
      setDescription("");
      setTags([]);
      setIsScheduled(false);
      setScheduledPublishDate("");
      
      // Reset start time for next upload
      startTime.current = Date.now();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload PDF. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="bg-white w-full max-w-3xl shadow-lg rounded-2xl p-8 mb-10">
        {/* Header */}
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Upload Daily Current Affair PDF
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Upload the daily current affairs PDF here. <br />
            <span className="text-red-500 font-medium">
              Only one upload per date is allowed.
            </span>
          </p>
        </div>

        {/* Date */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <label className="text-md font-medium text-gray-700">
            Choose Date of Upload:
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <label className="text-md font-medium text-gray-700">
            Choose Title for Today
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your title here"
            className="border border-gray-300 rounded-xl px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-3 mb-8">
          <label className="text-md font-medium text-gray-700">
            Write a brief Description (max 500 words)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your description here..."
            rows={6}
            maxLength={3000} // roughly 500 words
            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
          />
          <p className="text-sm text-gray-400 text-right">
            {description.length}/3000 characters
          </p>
        </div>

        {/* Category */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <label className="text-md font-medium text-gray-700">
            Choose Category
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              // Reset scheduling when category changes
              if (e.target.value !== "Monthly Summary") {
                setIsScheduled(false);
                setScheduledPublishDate("");
              }
            }}
            className="border border-gray-300 rounded-xl px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option className="text-sm text-gray-400" value="">
              --Choose Category--
            </option>
            {CategoryDropdown.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Scheduling Options - Only for Monthly Summary */}
        {category === "Monthly Summary" && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="scheduleCheckbox"
                checked={isScheduled}
                onChange={(e) => {
                  setIsScheduled(e.target.checked);
                  if (!e.target.checked) {
                    setScheduledPublishDate("");
                  }
                }}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
              />
              <label
                htmlFor="scheduleCheckbox"
                className="text-md font-medium text-gray-700 cursor-pointer"
              >
                Schedule Upload
              </label>
            </div>

            {isScheduled && (
              <div className="flex flex-col gap-3 mt-4">
                <label className="text-sm font-medium text-gray-700">
                  Select Publish Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledPublishDate}
                  onChange={(e) => setScheduledPublishDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="border border-gray-300 rounded-xl px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <p className="text-xs text-gray-500">
                  The PDF will become visible to users after this date and time
                  (in your local timezone)
                </p>
              </div>
            )}

            {!isScheduled && (
              <p className="text-sm text-gray-600 mt-2">
                ✓ This PDF will be published immediately upon upload
              </p>
            )}
          </div>
        )}

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

        <button
          className="border-1 py-3 px-4 rounded-2xl mb-4 bg-purple-700 text-gray-100 hover:bg-purple-800 transition-colors"
          onClick={handleUpload}
        >
          {isScheduled ? "Schedule PDF Upload" : "Upload PDF Immediately"}
        </button>

        {/* Upload Form */}
        <div className="border-t pt-6">
          <CurrentAffairUploadForm selectedDate={date} />
        </div>
      </div>
    </div>
  );
};

export default UploadCurrentAffairsPage;
