import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAffairDetail } from '../../Service/currentAffairService';
import noData from '../../assets/Landing/no_data.jpg';

export default function AffairDetailPage() {
  const { date, slug } = useParams();
  const [affair, setAffair] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetchAffairDetail(date, slug);
        setAffair(res.data);
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error("Error loading affair", err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, [date, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center p-6 md:p-8 bg-white rounded-lg shadow-md border border-gray-200 max-w-md w-full">
          <div className="text-red-500 text-4xl md:text-5xl mb-4">⚠️</div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!affair) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center p-6 md:p-8 bg-white rounded-lg shadow-md border border-gray-200 max-w-md w-full">
          <div className="text-gray-400 text-4xl md:text-5xl mb-4">🔍</div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Content Not Found</h2>
          <p className="text-gray-600">The article you're looking for doesn't exist or may have been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16 md:pt-24 lg:pt-32 py-6 md:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b-4 border-blue-500 p-4 md:p-8 rounded-lg shadow-sm mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-gray-800">{affair.title}</h1>
          <p className="text-gray-500 text-sm">Published: {date}</p>
        </div>

        {/* Content area */}
        <div className="bg-white p-4 md:p-8 rounded-lg mb-6 md:mb-8">
          {affair.imageUrl && (
            <div className="mb-6 md:mb-8">
              <img 
                src={affair.imageUrl} 
                className="w-full h-auto rounded-lg object-cover" 
                alt={affair.title} 
              />
              <div className="mt-2 text-sm text-gray-500 italic">
                Image: {affair.title}
              </div>
            </div>
          )}
          
          <div className="prose max-w-none text-gray-700 leading-relaxed text-base md:text-lg">
            <p>{affair.content}</p>
          </div>
        </div>

        {/* Questions section with answers */}
        {questions && questions.length > 0 ? (
          <div className="mb-6 md:mb-8 rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6   pb-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
               {` Probable Questions for : ${affair.title}`}
              </h2>
              
              <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {questions.length} Question{questions.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              {questions.map((q, index) => (
                <div key={index} className="bg-white rounded-lg p-4 md:p-5 shadow-sm border border-gray-100">
                  {/* Question header */}
                  <div className="flex items-start mb-3 md:mb-4">
                    <div className="flex-shrink-0 mr-3">
                      <span className="inline-flex items-center justify-center h-6 w-6 md:h-7 md:w-7 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-base md:text-lg font-medium text-gray-800">{q.text}</p>
                  </div>
                  
                  {/* Options */}
                  <div className="space-y-2 ml-6 md:ml-10 mb-3 md:mb-4">
                    {q.options.map((opt, optIndex) => (
                      <div 
                        key={optIndex} 
                        className={`flex items-center p-2 md:p-3 rounded-md ${
                          opt === q.answer 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors'
                        }`}
                      >
                        <div className={`w-5 h-5 flex-shrink-0 rounded-full border ${
                          opt === q.answer 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300'
                        } flex items-center justify-center`}>
                          {opt === q.answer && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`ml-3 text-sm md:text-base ${
                          opt === q.answer 
                            ? 'text-gray-800 font-medium' 
                            : 'text-gray-600'
                        }`}>{opt}</span>
                        
                        {opt === q.answer && (
                          <span className="ml-auto text-green-600 text-xs md:text-sm font-medium">
                            Correct
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Answer explanation box */}
                  {q.explanation && (
                    <div className="ml-6 md:ml-10 mt-3 p-3 md:p-4 bg-blue-50 rounded-md border-l-4 border-blue-400">
                      <div className="flex items-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="font-medium text-blue-700 text-sm md:text-base">Explanation</div>
                      </div>
                      <div className="text-gray-700 text-xs md:text-sm">{q.explanation}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white p-4 md:p-8 rounded-lg text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">No Questions Available</h3>
              <p className="text-gray-600 mb-4 md:mb-6">This article doesn't have any Probable questions yet.</p>
              <p className="text-gray-500 text-sm">Check back later or explore other articles for knowledge assessments.</p>
              <img className="mx-auto mt-4 max-w-full h-auto" src={noData} alt="no-data" />
            </div>

            <div className="rounded-lg">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-4">Continue Learning</h3>
              <p className="text-gray-600">Explore more articles on this topic to expand your knowledge.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}