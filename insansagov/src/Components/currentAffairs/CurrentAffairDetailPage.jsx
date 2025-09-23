import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAffairDetail } from '../../Service/currentAffairService';
import noData from '../../assets/Landing/no_data.jpg';
import { Helmet } from 'react-helmet';

export default function AffairDetailPage() {
  const { date, slug } = useParams();
  const [affair, setAffair] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [singleLineQuestions, setSingleLineQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetchAffairDetail(date, slug);
        setAffair(res.data);
        setQuestions(res.data.questions || []);
        setSingleLineQuestions(res.data.singleLineQuestion || []);
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

  const hasQuestions = questions.length > 0 || singleLineQuestions.length > 0;

  return (
    <>
      <Helmet>
        <title>Current Affairs</title>
        <meta name="description" content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!" />
        <meta name="keywords" content="government competitive exams after 12th,government organisations, exam sarkari results, government calendar,current affairs,top exams for government jobs in india,Upcoming Government Exams" />
        <meta property="og:title" content="gyapak" />
        <meta property="og:description" content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs." />
      </Helmet>
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

          {/* Details section */}
          {affair.details && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 md:p-6 mb-6 md:mb-8 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-blue-800">More Details</h3>
              <div className="whitespace-pre-line text-gray-700">{affair.details}</div>
            </div>
          )}

          {/* Questions section */}
          {hasQuestions ? (
            <div className="mb-6 md:mb-8 rounded-xl p-4 md:p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-4 md:mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                  {`Key Questions: ${affair.title}`}
                </h2>

                <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {questions.length + singleLineQuestions.length} Question{(questions.length + singleLineQuestions.length) !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Single line questions */}
              {singleLineQuestions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Conceptual Questions</h3>
                  <div className="space-y-3">
                    {singleLineQuestions.map((q, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex">
                          <div className="flex-shrink-0 mr-3">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                              Q{index + 1}
                            </span>
                          </div>
                          <p className="text-gray-800">{q.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MCQ questions converted to discussion format */}
{questions.length > 0 && (
  <div>
    <h3 className="text-lg font-medium text-gray-800 mb-3">Discussion Points</h3>
    <div className="space-y-4">
      {questions.map((q, index) => (
        <div key={index} className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <div className="mb-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                  {index + 1}
                </span>
              </div>
              <p className="text-base md:text-lg font-medium text-gray-800">{q.text}</p>
            </div>
          </div>

          {/* Options */}
          {q.options && (
            <div className="ml-9 mb-4">
              {q.options.map((option, optIdx) => {
                const isSelected = selectedOptions[index] === option;
                const isCorrect = option === q.answer;
                let optionClass = "px-4 py-2 rounded-md border cursor-pointer mb-2 block text-left";
                if (isSelected) {
                  optionClass += isCorrect
                    ? " bg-green-100 border-green-400 text-green-800"
                    : " bg-red-100 border-red-400 text-red-800";
                } else {
                  optionClass += " bg-white border-gray-200 hover:bg-blue-50";
                }
                return (
                  <button
                    key={optIdx}
                    className={optionClass}
                    onClick={() => handleOptionClick(index, option)}
                    disabled={selectedOptions[index] !== undefined}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          <div className="ml-9 bg-blue-50 p-4 rounded-md">
            <div className="font-medium text-blue-700 mb-2">Key Point</div>
            <p className="text-gray-700">{q.answer}</p>

            {q.explanation && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="font-medium text-blue-700 mb-1">Further Analysis</div>
                <p className="text-gray-700 text-sm">{q.explanation}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
            </div>
          ) : (
            <>
              <div className="bg-white p-4 md:p-8 rounded-lg text-center mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">No Questions Available</h3>
                <p className="text-gray-600 mb-4 md:mb-6">This article doesn't have any questions yet.</p>
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
    </>

  );
}