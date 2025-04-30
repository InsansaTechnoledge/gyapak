import { useState } from 'react';
import FAQItem from './FAQItems';

const FAQList = ({ faqs, filterOptions = {} }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeState, setActiveState] = useState('all');

  const safeFAQs = Array.isArray(faqs) ? faqs : [];

  const allCategories = ['all', ...new Set(safeFAQs.flatMap(faq => faq.categories || []))];
  const allStates = ['all', ...new Set(safeFAQs.map(faq => faq.state || 'All'))];

  const filteredFAQs = safeFAQs.filter(faq => {
    const passesCategory = activeCategory === 'all' || (faq.categories && faq.categories.includes(activeCategory));
    const passesState = activeState === 'all' || faq.state === activeState;
    return passesCategory && passesState;
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {filterOptions.showFilters && (
        <div className="bg-purple-50 p-6 rounded-xl shadow-sm mb-8 border border-purple-100">
          <h2 className="text-lg font-semibold text-purple-800 mb-4">Filter FAQs</h2>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            {/* Category filter */}
            {filterOptions.showCategoryFilter && (
              <div className="sm:w-1/2">
                <label htmlFor="category-filter" className="block text-sm font-medium text-purple-700 mb-2">
                  Filter by Category
                </label>
                <div className="relative">
                  <select
                    id="category-filter"
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="appearance-none w-full rounded-lg border border-purple-200 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white text-purple-900 transition duration-200"
                  >
                    {allCategories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-500">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            
            {/* State filter */}
            {filterOptions.showStateFilter && (
              <div className="sm:w-1/2">
              <label htmlFor="category-filter" className="block text-sm font-medium text-purple-700 mb-2">
                Filter by Category
              </label>
              <div className="relative">
                <select
                  id="category-filter"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="appearance-none w-full rounded-lg border border-purple-200 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white text-purple-900 transition duration-200"
                 
                >
                  {allCategories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-500">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            )}
          </div>
        </div>
      )}

      <div className="rounded-xl bg-white border border-purple-100 shadow-sm divide-y divide-purple-100">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              categories={faq.categories || []}
              state={faq.state || 'All'}
              seoTags={faq.seoTags || []}
            />
          ))
        ) : (
          <div className="text-center py-12 px-4">
            <div className="bg-purple-50 rounded-lg p-6 inline-block">
              <svg className="h-12 w-12 text-purple-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
              </svg>
              <p className="text-purple-700 font-medium text-lg">No FAQs match your current filters.</p>
              <button 
                onClick={() => {
                  setActiveCategory('all');
                  setActiveState('all');
                }}
                className="mt-4 text-sm font-medium text-purple-600 hover:text-purple-800 focus:outline-none focus:underline transition duration-200"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQList;