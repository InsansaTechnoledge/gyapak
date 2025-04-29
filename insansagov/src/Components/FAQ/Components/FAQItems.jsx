import { useState } from 'react';
import { ChevronDown, ChevronUp, Tag } from 'lucide-react';

const FAQItem = ({ question, answer, categories = [], state = 'published', seoTags = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  // State styling
  const stateStyles = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    archived: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {/* Category tags */}
        {categories.map((category, index) => (
          <span key={`cat-${index}`} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <Tag className="mr-1 h-3 w-3" />
            {category}
          </span>
        ))}
        
        {/* State tag */}
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stateStyles[state] || stateStyles.published}`}>
          {state}
        </span>
      </div>

      <button 
        className="flex w-full justify-between items-center text-left font-medium text-gray-900 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-600">
          <p className="pt-2">{answer}</p>
          
          {/* SEO tags if expanded */}
          {seoTags.length > 0 && (
            <div className="mt-3 pt-2 border-t border-gray-100">
              <div className="flex flex-wrap gap-1">
                {seoTags.map((tag, index) => (
                  <span key={`seo-${index}`} className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FAQItem;
