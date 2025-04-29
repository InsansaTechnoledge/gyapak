import { useState, useEffect } from 'react';
import { getLandingFAQs, getOrganizationFAQs } from '../../../Service/FAQ';

// Optional: fallback if API fails
import { defaultFAQs } from '../data/Data';

export const useFAQ = (initialFAQs = [], orgId = null, filters = {}) => {
  const [faqs, setFAQs] = useState(initialFAQs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [seoTags, setSeoTags] = useState([]);

  // Auto fetch FAQs from backend
  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
      try {
        const response = orgId
          ? await getOrganizationFAQs(orgId, filters)
          : await getLandingFAQs(filters);

        setFAQs(response.data || []);
        setError(null);
      } catch (err) {
        console.error('❌ Failed to load FAQs:', err);
        setError('Failed to load FAQs');
        setFAQs(defaultFAQs); // Optional fallback
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, [orgId, JSON.stringify(filters)]);

  // Extract metadata when faqs change
  useEffect(() => {
    if (faqs.length > 0) {
      const allCategories = [...new Set(faqs.flatMap(faq => faq.categories || []))];
      setCategories(allCategories);

      const allStates = [...new Set(faqs.map(faq => faq.state || 'All'))];
      setStates(allStates);

      const allSeoTags = [...new Set(faqs.flatMap(faq => faq.seoTags || []))];
      setSeoTags(allSeoTags);
    }
  }, [faqs]);

  // Filter functions
  const filterByCategory = (category) => {
    if (!category || category === 'all') return faqs;
    return faqs.filter(faq => faq.categories?.includes(category));
  };

  const filterByState = (state) => {
    if (!state || state === 'all') return faqs;
    return faqs.filter(faq => faq.state === state);
  };

  const filterBySeoTag = (tag) => {
    if (!tag) return faqs;
    return faqs.filter(faq => faq.seoTags?.includes(tag));
  };

  const searchFAQs = (term) => {
    if (!term) return faqs;
    const lower = term.toLowerCase();
    return faqs.filter(faq =>
      faq.question?.toLowerCase().includes(lower) ||
      faq.answer?.toLowerCase().includes(lower) ||
      faq.categories?.some(c => c.toLowerCase().includes(lower)) ||
      faq.seoTags?.some(t => t.toLowerCase().includes(lower))
    );
  };

  return {
    faqs,
    setFAQs,
    loading,
    error,
    categories,
    states,
    seoTags,
    filterByCategory,
    filterByState,
    filterBySeoTag,
    searchFAQs
  };
};
