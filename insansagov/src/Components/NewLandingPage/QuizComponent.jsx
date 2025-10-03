import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, RotateCcw, Trophy, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApi } from '../../Context/ApiContext';
import axios from 'axios';

const QuizComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { apiBaseUrl } = useApi();
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

  const fetchTodaysQuestionsService = async()=>{
    try {
      const response = await axios.get(`${apiBaseUrl}/api/v1i2/question/today`);
      return response.data;
    } catch (error) {
      console.error("Error fetching today's questions:", error);
      throw error;
    }
  }

  // Fetch today's questions
  const fetchTodaysQuestions = async () => {
    try {
      setLoading(true);
      
      // Simulate API delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetchTodaysQuestionsService();
      console.log("API Response:", response);
      const questionsData = response.data?.questions || response.questions || response;
      setQuestions(Array.isArray(questionsData) ? questionsData : []);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysQuestions();
  }, []);

  const handleAnswerSelect = (questionId, selectedIndex) => {
    if (quizSubmitted) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: selectedIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Check if all questions are answered
  useEffect(() => {
    setAllQuestionsAnswered(questions.length > 0 && questions.every(q => selectedAnswers[q._id] !== undefined));
  },[questions, selectedAnswers]);

  const handleSubmitQuiz = () => {
    if (!allQuestionsAnswered) return;
    
    let correct = 0;
    questions.forEach(question => {
      if (selectedAnswers[question._id] === question.correctAnswer) {
        correct++;
      }
    });
    
    setScore({
      correct,
      total: questions.length
    });
    
    setQuizSubmitted(true);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setQuizSubmitted(false);
    setCurrentQuestionIndex(0);
    setScore({ correct: 0, total: 0 });
  };

  const getOptionLabel = (index) => String.fromCharCode(65 + index);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hard': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 w-full max-w-sm">
          <div className="animate-pulse text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3"></div>
            <div className="h-4 bg-slate-200 rounded-lg w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-slate-200 rounded-lg w-1/2 mx-auto"></div>
          </div>
          <div className="text-center mt-4">
            <div className="text-purple-600 font-medium text-sm">Loading questions...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6 w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={fetchTodaysQuestions}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No Questions State
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6 text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">No Questions</h2>
          <p className="text-slate-600 text-sm">Check back later!</p>
        </div>
      </div>
    );
  }

  const scorePercentage = score.total > 0 ? ((score.correct / score.total) * 100) : 0;
  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4">
      <div className="max-w-lg mx-auto px-3">
        
        {/* Ultra Compact Header */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="text-white" size={14} />
              </div>
              <div>
                <h1 className="text-base font-semibold text-slate-800">Daily Quiz</h1>
                <p className="text-xs text-slate-500">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-purple-600">
                {currentQuestionIndex + 1}/{questions.length}
              </div>
              <div className="text-xs text-slate-400">
                {answeredCount} answered
              </div>
            </div>
          </div>

          {/* Mini Progress Bar */}
          <div className="bg-slate-100 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Minimal Question Dots */}
        <div className="flex justify-center mb-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 border border-white/50">
            <div className="flex items-center gap-1">
              {questions.map((question, index) => (
                <button
                  key={question._id}
                  onClick={() => goToQuestion(index)}
                  className={`w-6 h-6 rounded-full text-xs font-medium transition-all duration-200 ${
                    index === currentQuestionIndex
                      ? 'bg-purple-600 text-white ring-2 ring-purple-200 scale-110'
                      : selectedAnswers[question._id] !== undefined
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Card */}
        {showResults && (
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/60 rounded-2xl p-4 mb-3 text-center">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-emerald-800 mb-1">Completed!</h2>
            <div className="text-xl font-bold text-emerald-600 mb-3">
              {scorePercentage.toFixed(0)}%
            </div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="bg-white/70 p-2 rounded-lg">
                <div className="text-sm font-semibold text-slate-700">{questions.length}</div>
                <div className="text-xs text-slate-600">Total</div>
              </div>
              <div className="bg-white/70 p-2 rounded-lg">
                <div className="text-sm font-semibold text-emerald-600">{score.correct}</div>
                <div className="text-xs text-emerald-700">Right</div>
              </div>
              <div className="bg-white/70 p-2 rounded-lg">
                <div className="text-sm font-semibold text-red-600">{score.total - score.correct}</div>
                <div className="text-xs text-red-700">Wrong</div>
              </div>
              <div className="bg-white/70 p-2 rounded-lg">
                <div className="text-sm font-semibold text-purple-600">{scorePercentage.toFixed(0)}%</div>
                <div className="text-xs text-purple-700">Score</div>
              </div>
            </div>
            <button
              onClick={resetQuiz}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-medium text-sm transition-all hover:scale-105"
            >
              Retake
            </button>
          </div>
        )}

        {/* Compact Question Card */}
        {!showResults && currentQuestion && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 p-4 mb-3">
            
            {/* Micro Question Header */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className="bg-purple-600 text-white px-2 py-0.5 rounded-md text-xs font-medium">
                Q{currentQuestionIndex + 1}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-xs border ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty}
              </span>
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs border border-blue-200">
                {currentQuestion.category}
              </span>
            </div>

            {/* Question Text */}
            <h3 className="text-base font-medium text-slate-800 mb-4 leading-relaxed">
              {currentQuestion.question}
            </h3>

            {/* Mini Options */}
            <div className="space-y-2 mb-4">
              {currentQuestion.options.map((option, optionIndex) => {
                const selectedIndex = selectedAnswers[currentQuestion._id];
                const isSelected = selectedIndex === optionIndex;
                const isCorrect = optionIndex === currentQuestion.correctAnswer;
                
                let className = "flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all duration-200";
                
                if (!quizSubmitted) {
                  className += isSelected 
                    ? " bg-purple-50 border-purple-200 ring-1 ring-purple-200" 
                    : " bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300";
                } else {
                  if (isCorrect) {
                    className += " bg-emerald-50 border-emerald-200 ring-1 ring-emerald-200";
                  } else if (isSelected) {
                    className += " bg-red-50 border-red-200 ring-1 ring-red-200";
                  } else {
                    className += " bg-slate-50 border-slate-200";
                  }
                  className += " cursor-default";
                }

                return (
                  <div 
                    key={optionIndex}
                    className={className}
                    onClick={() => handleAnswerSelect(currentQuestion._id, optionIndex)}
                  >
                    <span className="w-6 h-6 flex items-center justify-center bg-white border border-slate-300 rounded-full font-medium text-xs">
                      {getOptionLabel(optionIndex)}
                    </span>
                    <span className="flex-1 text-sm text-slate-700">{option}</span>
                    {quizSubmitted && (
                      <span>
                        {isCorrect ? (
                          <CheckCircle className="text-emerald-600" size={16} />
                        ) : isSelected ? (
                          <XCircle className="text-red-600" size={16} />
                        ) : null}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Compact Explanation */}
            {quizSubmitted && currentQuestion.explanation && (
              <div className="bg-blue-50/80 border border-blue-200/60 rounded-xl p-3 mb-4">
                <p className="text-blue-800 font-medium text-xs mb-1">💡 Explanation</p>
                <p className="text-blue-700 text-xs leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Mini Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs transition-colors"
              >
                <ChevronLeft size={14} />
                Prev
              </button>

              <div className="flex items-center gap-2">
                {!quizSubmitted && allQuestionsAnswered && (
                  <button
                    onClick={handleSubmitQuiz}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-3 py-1.5 rounded-lg hover:from-emerald-700 hover:to-green-700 font-medium text-xs transition-all transform hover:scale-105"
                  >
                    Submit
                  </button>
                )}

                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs transition-colors"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mini Status */}
        {!showResults && (
          <div className="text-center">
            <div className="inline-block bg-white/70 backdrop-blur-sm rounded-full px-3 py-1 border border-white/50">
              {allQuestionsAnswered ? (
                <p className="text-emerald-600 font-medium text-xs">✓ Ready to submit</p>
              ) : (
                <p className="text-slate-600 text-xs">
                  {answeredCount}/{questions.length} answered
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;