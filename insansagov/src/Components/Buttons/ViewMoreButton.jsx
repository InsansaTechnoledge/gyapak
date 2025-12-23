import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, ChevronsUp, ChevronUp } from 'lucide-react';
import React from 'react';
import { ViewMoreButtonText } from '../../constants/Constants';
// import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const ViewMoreButton = ({ content, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 main-site-color text-white rounded-md hover:main-site-color-hover transition duration-300"
    >
      {content.includes("▲") ? (
        <>
          Back 
        </>
      ) : (
        <>
          {ViewMoreButtonText} <ChevronRight/>
        </>
      )}
    </button>
  );
};

export default ViewMoreButton;
