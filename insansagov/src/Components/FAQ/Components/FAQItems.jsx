import { useState } from 'react';
import { ChevronDown, ChevronUp, Tag, Bookmark, Archive, CheckCircle } from 'lucide-react';

const FAQItem = ({ question, answer, categories = [], state = 'published', seoTags = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  
  const stateConfig = {
    published: {
      className: 'light-site-color-2  text-gray-800 border border-gray-200',
      icon: <CheckCircle className="mr-1 h-3 w-3" />
    }
  };

  const stateDisplay = stateConfig[state] || stateConfig.published;

  return (
    <div className={`border-b border-gray-200 transition-colors duration-200 ${isOpen ? 'bg-gray-50' : 'hover:bg-gray-50/20'}`}>
      <div className="px-6 py-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {/* Category tags */}
          {categories.map((category, index) => (
            <span key={`cat-${index}`} className="inline-flex items-center rounded-md bg-white border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
              <Tag className="mr-1 h-3 w-3 main-site-text-color" strokeWidth={2} />
              {category}
            </span>
          ))}
          
          {/* State tag */}
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${stateDisplay.className}`}>
            {stateDisplay.icon}
            {state}
          </span>
        </div>

        <button 
          className="flex w-full justify-between items-center text-left font-medium focus:outline-none group"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span className={`text-lg transition-colors duration-200 ${isOpen ? 'text-gray-900 font-semibold' : 'text-gray-800 group-hover:text-gray-900'}`}>
            {question}
          </span>
          <div className="ml-4 flex-shrink-0 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
            {isOpen ? (
              <ChevronUp className="h-4 w-4 main-site-text-color" />
            ) : (
              <ChevronDown className="h-4 w-4 main-site-text-color" /> 
            )}
          </div>
        </button>
        
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-4 pb-1 text-gray-700">
            {typeof answer === 'string' ? (
              <p className="leading-relaxed">{answer}</p>
            ) : (
              answer
            )}
            
            {/* SEO tags if expanded */}
            {seoTags.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-2">Related Topics</p>
                <div className="flex flex-wrap gap-2">
                  {seoTags.map((tag, index) => (
                    <span 
                      key={`seo-${index}`} 
                      className="inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200"
                    >
                      <Tag className="mr-1 h-3 w-3 main-site-text-color" strokeWidth={2} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;