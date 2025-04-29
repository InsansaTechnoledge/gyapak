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
    <div className="space-y-6">
      {filterOptions.showFilters && (
        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          {/* Category filter */}
          {filterOptions.showCategoryFilter && (
            <div className="min-w-40">
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Category
              </label>
              <select
                id="category-filter"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                {allCategories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          
          {filterOptions.showStateFilter && (
            <div className="min-w-40">
              <label htmlFor="state-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by State
              </label>
              <select
                id="state-filter"
                value={activeState}
                onChange={(e) => setActiveState(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                {allStates.map(state => (
                  <option key={state} value={state}>
                    {state.charAt(0).toUpperCase() + state.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg bg-white   ">
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
          <div className="text-center py-8 text-gray-500">
            No FAQs match your current filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQList;
