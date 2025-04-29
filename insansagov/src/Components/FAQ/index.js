import FAQ from './FAQ';
import FAQItem from './Components/FAQItems';
import FAQList from './Components/FAQLists';
import { useFAQ } from './hooks/useFAQs';
// import defaultFAQs from './data/faqData';

// Main component export
export default FAQ;

// Named exports for more flexibility
export {
  FAQItem,
  FAQList,
  useFAQ,
  
};

// src/FAQ/utils/faqHelpers.js
/**
 * Helper functions for the FAQ component
 */

/**
 * Groups FAQs by their categories
 * @param {Array} faqs - Array of FAQ objects
 * @returns {Object} - Object with categories as keys and arrays of FAQs as values
 */
export const groupFAQsByCategory = (faqs) => {
  return faqs.reduce((grouped, faq) => {
    if (!faq.categories || faq.categories.length === 0) {
      // Handle FAQs with no categories
      if (!grouped['Uncategorized']) {
        grouped['Uncategorized'] = [];
      }
      grouped['Uncategorized'].push(faq);
      return grouped;
    }
    
    faq.categories.forEach(category => {
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(faq);
    });
    
    return grouped;
  }, {});
};

/**
 * Generates SEO-friendly structured data for FAQs (JSON-LD)
 * @param {Array} faqs - Array of FAQ objects
 * @returns {Object} - JSON-LD structured data object for FAQs
 */
export const generateFAQSchemaMarkup = (faqs) => {
  return {
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
};

/**
 * Generates SEO meta tags from FAQ content
 * @param {Array} faqs - Array of FAQ objects
 * @returns {Object} - Object with meta title and description
 */
export const generateSEOMeta = (faqs) => {
  // Collect all SEO tags
  const allSeoTags = faqs.flatMap(faq => faq.seoTags || []);
  
  // Get the top 5 most common tags
  const topTags = [...allSeoTags]
    .sort((a, b) => 
      allSeoTags.filter(tag => tag === b).length - 
      allSeoTags.filter(tag => tag === a).length
    )
    .filter((tag, index, self) => self.indexOf(tag) === index)
    .slice(0, 5);
  
  return {
    title: `FAQ - ${topTags.join(', ')}`,
    description: `Find answers to frequently asked questions about ${topTags.join(', ')} and more.`
  };
};