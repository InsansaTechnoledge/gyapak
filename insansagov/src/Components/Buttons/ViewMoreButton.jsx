import { ArrowDown, ArrowUp } from 'lucide-react';
import React from 'react';
// import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const ViewMoreButton = ({ content, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-900 transition duration-300"
    >
      {content.includes("▲") ? (
        <>
          View Less <ArrowUp/>
        </>
      ) : (
        <>
          View More <ArrowDown/>
        </>
      )}
    </button>
  );
};

export default ViewMoreButton;
