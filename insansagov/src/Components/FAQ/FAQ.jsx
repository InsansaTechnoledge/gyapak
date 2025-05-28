import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import FAQList from './Components/FAQLists';
import { useFAQ } from './hooks/useFAQs';
import { Helmet } from 'react-helmet'; // Use React Helmet for managing head tags

const FAQ = ({ 
  title = 'frequently asked questions',
  customFAQs,
  orgId = null,
  showSearch = true,
  showCategoryFilter = true,
  showStateFilter = false,
  showSEOTags = true,
  className = '',
  metaDescription = `frequently asked questions and answers about government jobs and exams: latest ${new Date().getFullYear()} updates`
}) => {
  const { 
    faqs, 
    loading, 
    error, 
    searchFAQs
  } = useFAQ(customFAQs, orgId);

  const [searchTerm, setSearchTerm] = useState('');
  const filteredFAQs = searchTerm ? searchFAQs(searchTerm) : faqs;
  
  // Create FAQ Schema for SEO
  const generateFAQSchema = () => {
    if (!faqs || faqs.length === 0) return null;
    
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    
    return JSON.stringify(faqSchema);
  };

  if (loading) {
    return <div className="text-center py-8">Loading FAQs...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  const displayTitle = title || (orgId ? "frequently asked questions for This Organization" : "frequently asked questions");

  return (
    <>
      {showSEOTags && (
        <Helmet>
          {/* <title>{displayTitle} | gyapak</title> */}
          <meta name="description" content={metaDescription} />
          <script type="application/ld+json">
            {generateFAQSchema()}
          </script>
        </Helmet>
      )}
      
      <div className={`max-w-3xl mx-auto px-4 py-8 ${className}`}>
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {displayTitle}
        </h1>

        {showSearch && (
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search FAQs"
              />
            </div>
          </div>
        )}

        <FAQList 
          faqs={filteredFAQs} 
          filterOptions={{
            showFilters: showCategoryFilter || showStateFilter,
            showCategoryFilter,
            showStateFilter
          }}
        />

        {filteredFAQs.length === 0 && searchTerm && (
          <div className="text-center mt-8 text-gray-500">
            No FAQs found matching "{searchTerm}". Try a different search term.
          </div>
        )}
      </div>
    </>
  );
};

export default FAQ;