import React from "react";

const BriefEditableSection = ({ value, onChange }) => {
  return (
    <div className="mt-10">
      <h2 className="text-purple-700 text-4xl mb-4 text-center font-bold">Brief Details</h2>
      <textarea
        className="w-full h-40 border border-purple-300 rounded-md p-4 text-gray-800"
        placeholder="Write a short summary about this opportunity (min 100 characters)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        name="briefDetails"
      />
    </div>
  );
};

export default BriefEditableSection;
