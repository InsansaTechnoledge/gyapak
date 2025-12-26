import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  XCircle,
  Calendar,
  RotateCcw,
  TrendingUp,
  Clock,
  Target,
  AlertCircle,
} from "lucide-react";

// Types and Interfaces
const QUESTION_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  TRUE_FALSE: "true_false",
  CODE_REVIEW: "code_review",
};

const DIFFICULTY_LEVELS = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};

const CATEGORIES = {
  ALGORITHMS: "algorithms",
  SYSTEM_DESIGN: "system_design",
  DATA_STRUCTURES: "data_structures",
  WEB_DEVELOPMENT: "web_development",
  DATABASES: "databases",
};

// Custom Hooks
const useSwipeGesture = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const handleTouchMove = useCallback((e) => {
    touchEnd.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const handleTouchEnd = useCallback(() => {
    const deltaX = touchStart.current.x - touchEnd.current.x;
    const deltaY = touchStart.current.y - touchEnd.current.y;

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    }
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
};

const useKeyboardNavigation = (
  currentSlide,
  totalSlides,
  onNext,
  onPrevious
) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          event.preventDefault();
          onPrevious();
          break;
        case "ArrowRight":
        case "d":
        case "D":
          event.preventDefault();
          onNext();
          break;
        case "Home":
          event.preventDefault();
          // Could add navigation to first slide
          break;
        case "End":
          event.preventDefault();
          // Could add navigation to last slide
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentSlide, totalSlides, onNext, onPrevious]);
};

const useSessionStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      // Note: In Claude artifacts, we'll use memory storage instead
      return initialValue;
    } catch (error) {
      console.warn("SessionStorage not available:", error);
      return initialValue;
    }
  });

  const setStoredValue = useCallback((newValue) => {
    setValue(newValue);
    // In a real application, this would persist to sessionStorage
  }, []);

  return [value, setStoredValue];
};

// Question Data with realistic SDE-1 level content
const questionData = [
  {
    id: "q1",
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    category: CATEGORIES.ALGORITHMS,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    question:
      "What is the time complexity of finding the k-th largest element in an unsorted array using QuickSelect algorithm?",
    options: [
      "O(n log n) in all cases",
      "O(n) average case, O(n²) worst case",
      "O(n log k) in all cases",
      "O(k log n) in all cases",
    ],
    correctAnswer: 1,
    explanation:
      "QuickSelect has O(n) average-case time complexity due to partitioning around a pivot, but O(n²) worst-case when the pivot is consistently poor. This is why randomized QuickSelect is preferred.",
    tags: ["quickselect", "time-complexity", "algorithms"],
  },
  {
    id: "q2",
    type: QUESTION_TYPES.CODE_REVIEW,
    category: CATEGORIES.DATA_STRUCTURES,
    difficulty: DIFFICULTY_LEVELS.HARD,
    question:
      "What is the main issue with this HashMap implementation's collision resolution?",
    codeSnippet: `
class HashNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class HashMap {
  constructor(size = 16) {
    this.buckets = new Array(size).fill(null);
    this.size = size;
  }
  
  hash(key) {
    return key.length % this.size; // Issue here
  }
  
  put(key, value) {
    const index = this.hash(key);
    const newNode = new HashNode(key, value);
    
    if (!this.buckets[index]) {
      this.buckets[index] = newNode;
    } else {
      newNode.next = this.buckets[index];
      this.buckets[index] = newNode;
    }
  }
}`,
    options: [
      "Hash function causes poor distribution leading to clustering",
      "Missing load factor management and resizing",
      "Collision resolution doesn't handle key updates properly",
      "All of the above",
    ],
    correctAnswer: 3,
    explanation:
      "The hash function (key.length % size) creates poor distribution, there's no load factor management, and the put method doesn't check for existing keys before adding new nodes, causing duplicates.",
    tags: ["hashmap", "collision-resolution", "data-structures"],
  },
  {
    id: "q3",
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    category: CATEGORIES.SYSTEM_DESIGN,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    question:
      "For a distributed cache system serving 100M daily active users, which consistency model would you choose for user session data?",
    options: [
      "Strong consistency with distributed locks",
      "Eventual consistency with conflict resolution",
      "Session affinity with local caching",
      "Write-through caching with immediate invalidation",
    ],
    correctAnswer: 2,
    explanation:
      "Session affinity (sticky sessions) with local caching provides the best balance of performance and consistency for user sessions, avoiding distributed coordination overhead while ensuring session data availability.",
    tags: ["system-design", "caching", "consistency"],
  },
  {
    id: "q4",
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    category: CATEGORIES.WEB_DEVELOPMENT,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    question:
      "What's the most significant performance issue in this React component?",
    codeSnippet: `
const ExpensiveList = ({ items, filter }) => {
  const processedItems = items
    .filter(item => item.name.includes(filter))
    .map(item => ({ ...item, processed: true }))
    .sort((a, b) => a.priority - b.priority);

  return (
    <div>
      {processedItems.map(item => (
        <ExpensiveItem key={item.id} item={item} />
      ))}
    </div>
  );
};`,
    options: [
      "Missing React.memo wrapper",
      "Expensive operations run on every render",
      "Key prop should use index instead of id",
      "Missing useCallback for event handlers",
    ],
    correctAnswer: 1,
    explanation:
      "The filter, map, and sort operations run on every render. These should be wrapped in useMemo with proper dependencies to avoid unnecessary recalculations.",
    tags: ["react", "performance", "memoization"],
  },
  {
    id: "q5",
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    category: CATEGORIES.DATABASES,
    difficulty: DIFFICULTY_LEVELS.HARD,
    question:
      "Given a table with 10M records, which index strategy would be optimal for this query pattern: SELECT * FROM orders WHERE user_id = ? AND status IN ('pending', 'processing') ORDER BY created_at DESC?",
    options: [
      "Single index on (user_id)",
      "Composite index on (user_id, status, created_at)",
      "Separate indexes on user_id, status, and created_at",
      "Partial index on (user_id, created_at) WHERE status IN ('pending', 'processing')",
    ],
    correctAnswer: 3,
    explanation:
      "A partial index reduces index size by only including relevant rows, and ordering by (user_id, created_at) supports both the WHERE clause and ORDER BY efficiently for this specific query pattern.",
    tags: ["databases", "indexing", "query-optimization"],
  },
];

// Performance monitoring hook
const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    interactionLatency: 0,
  });

  const measureRender = useCallback((startTime) => {
    const renderTime = performance.now() - startTime.current;
    setMetrics((prev) => ({ ...prev, renderTime }));
  }, []);

  const measureInteraction = useCallback((startTime) => {
    const latency = performance.now() - startTime.current;
    setMetrics((prev) => ({ ...prev, interactionLatency: latency }));
  }, []);

  return { metrics, measureRender, measureInteraction };
};

// Analytics tracking (mock implementation)
const useAnalytics = () => {
  const trackEvent = useCallback((eventName, properties = {}) => {
    // In production, this would send to analytics service
    console.log("Analytics Event:", {
      eventName,
      properties,
      timestamp: Date.now(),
    });
  }, []);

  return { trackEvent };
};

// Error boundary hook
const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((error, errorInfo) => {
    console.error("Quiz Application Error:", error, errorInfo);
    setError({ error, errorInfo });
    // In production, send to error tracking service
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};

// Main Quiz Application Component
const ProductionQuizApp = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useSessionStorage("quiz_answers", {});
  const [startTime] = useState(Date.now());
  const [questionStartTimes, setQuestionStartTimes] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { metrics, measureRender, measureInteraction } =
    usePerformanceMonitoring();
  const { trackEvent } = useAnalytics();
  const { error, handleError, clearError } = useErrorHandler();

  // Memoized calculations for performance
  const currentQuestion = useMemo(
    () => questionData[currentQuestionIndex],
    [currentQuestionIndex]
  );

  const quizStats = useMemo(() => {
    const totalAnswered = Object.keys(userAnswers).length;
    const correctAnswers = questionData.reduce((count, question) => {
      return (
        count + (userAnswers[question.id] === question.correctAnswer ? 1 : 0)
      );
    }, 0);
    const averageTimePerQuestion =
      totalAnswered > 0
        ? Object.values(questionStartTimes).reduce(
            (sum, time) => sum + time,
            0
          ) / totalAnswered
        : 0;

    return {
      totalQuestions: questionData.length,
      totalAnswered,
      correctAnswers,
      accuracy:
        totalAnswered > 0
          ? ((correctAnswers / totalAnswered) * 100).toFixed(1)
          : 0,
      averageTimePerQuestion: Math.round(averageTimePerQuestion / 1000),
      isComplete: totalAnswered === questionData.length,
    };
  }, [userAnswers, questionStartTimes]);

  // Navigation functions with validation
  const navigateToQuestion = useCallback(
    (index, source = "direct") => {
      if (index < 0 || index >= questionData.length || isTransitioning) return;

      const startTime = performance.now();
      setIsTransitioning(true);
      setCurrentQuestionIndex(index);

      if (!questionStartTimes[questionData[index].id]) {
        setQuestionStartTimes((prev) => ({
          ...prev,
          [questionData[index].id]: Date.now(),
        }));
      }

      trackEvent("question_navigation", {
        from: currentQuestionIndex,
        to: index,
        source,
      });

      setTimeout(() => {
        setIsTransitioning(false);
        measureInteraction(startTime);
      }, 300);
    },
    [
      currentQuestionIndex,
      isTransitioning,
      questionStartTimes,
      trackEvent,
      measureInteraction,
    ]
  );

  const nextQuestion = useCallback(() => {
    navigateToQuestion(currentQuestionIndex + 1, "next_button");
  }, [navigateToQuestion, currentQuestionIndex]);

  const previousQuestion = useCallback(() => {
    navigateToQuestion(currentQuestionIndex - 1, "prev_button");
  }, [navigateToQuestion, currentQuestionIndex]);

  const goToQuestion = useCallback(
    (index) => {
      navigateToQuestion(index, "indicator");
    },
    [navigateToQuestion]
  );

  // Answer handling with validation
  const handleAnswerSelection = useCallback(
    (answerIndex) => {
      if (userAnswers[currentQuestion.id] !== undefined) return;

      const questionTime = Date.now() - questionStartTimes[currentQuestion.id];
      const isCorrect = answerIndex === currentQuestion.correctAnswer;

      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: answerIndex,
      }));

      trackEvent("answer_submitted", {
        questionId: currentQuestion.id,
        questionIndex: currentQuestionIndex,
        answerIndex,
        isCorrect,
        timeSpent: questionTime,
        difficulty: currentQuestion.difficulty,
        category: currentQuestion.category,
      });

      // Auto-advance after short delay for UX
      setTimeout(() => {
        if (currentQuestionIndex < questionData.length - 1) {
          nextQuestion();
        }
      }, 1500);
    },
    [
      currentQuestion,
      currentQuestionIndex,
      userAnswers,
      questionStartTimes,
      nextQuestion,
      trackEvent,
    ]
  );

  // Reset quiz functionality
  const resetQuiz = useCallback(() => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setQuestionStartTimes({});
    clearError();
    trackEvent("quiz_reset");
  }, [setUserAnswers, clearError, trackEvent]);

  // Keyboard and swipe navigation
  useKeyboardNavigation(
    currentQuestionIndex,
    questionData.length,
    nextQuestion,
    previousQuestion
  );
  const swipeHandlers = useSwipeGesture(nextQuestion, previousQuestion);

  // Performance monitoring
  useEffect(() => {
    const startTime = performance.now();
    return () => measureRender(startTime);
  }, [currentQuestionIndex, measureRender]);

  // Error handling
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-600 mb-4">
            We encountered an unexpected error. Please try again.
          </p>
          <button
            onClick={clearError}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Enhanced Header with Statistics */}
      <header className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-3">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                SDE Technical Assessment
              </h1>
              <div className="flex items-center text-slate-600 mt-1">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Daily Practice • {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xl font-bold text-blue-800">
                {quizStats.correctAnswers}/{quizStats.totalQuestions}
              </div>
              <div className="text-xs text-blue-600">Score</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xl font-bold text-green-800">
                {quizStats.accuracy}%
              </div>
              <div className="text-xs text-green-600">Accuracy</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-xl font-bold text-purple-800">
                {quizStats.averageTimePerQuestion}s
              </div>
              <div className="text-xs text-purple-600">Avg Time</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-xl font-bold text-orange-800">
                {currentQuestion.difficulty}
              </div>
              <div className="text-xs text-orange-600">Difficulty</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Quiz Interface */}
      <div className="relative bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Navigation Controls */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
          <button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`p-3 rounded-full bg-white shadow-lg border border-slate-200 transition-all ${
              currentQuestionIndex === 0
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-slate-50 hover:shadow-xl hover:border-slate-300"
            }`}
            aria-label="Previous question"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>

          <div className="bg-white shadow-lg border border-slate-200 rounded-full px-4 py-2">
            <span className="text-sm font-medium text-slate-600">
              {currentQuestionIndex + 1} of {questionData.length}
            </span>
          </div>

          <button
            onClick={nextQuestion}
            disabled={currentQuestionIndex === questionData.length - 1}
            className={`p-3 rounded-full bg-white shadow-lg border border-slate-200 transition-all ${
              currentQuestionIndex === questionData.length - 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-slate-50 hover:shadow-xl hover:border-slate-300"
            }`}
            aria-label="Next question"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Question Content */}
        <div className="p-8 pt-20 pb-8" {...swipeHandlers}>
          <div className="max-w-3xl mx-auto">
            {/* Question Header */}
            <div className="text-center mb-8">
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  {currentQuestion.category.replace("_", " ").toUpperCase()}
                </span>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    currentQuestion.difficulty === DIFFICULTY_LEVELS.EASY
                      ? "bg-green-100 text-green-800"
                      : currentQuestion.difficulty === DIFFICULTY_LEVELS.MEDIUM
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentQuestion.difficulty.toUpperCase()}
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                  {currentQuestion.type.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="mb-8">
              <h2 className="text-xl lg:text-2xl font-semibold text-slate-800 mb-6 leading-relaxed">
                {currentQuestion.question}
              </h2>

              {/* Code Snippet if present */}
              {currentQuestion.codeSnippet && (
                <div className="bg-slate-900 rounded-lg p-4 mb-6 overflow-x-auto">
                  <pre className="text-sm text-slate-300">
                    <code>{currentQuestion.codeSnippet.trim()}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, optionIndex) => {
                const isAnswered =
                  userAnswers[currentQuestion.id] !== undefined;
                const isSelected =
                  userAnswers[currentQuestion.id] === optionIndex;
                const isCorrect = optionIndex === currentQuestion.correctAnswer;

                let buttonClasses =
                  "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ";

                if (!isAnswered) {
                  buttonClasses +=
                    "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transform hover:scale-[1.02]";
                } else {
                  if (isCorrect) {
                    buttonClasses +=
                      "border-green-400 bg-green-50 text-green-800";
                  } else if (isSelected && !isCorrect) {
                    buttonClasses += "border-red-400 bg-red-50 text-red-800";
                  } else {
                    buttonClasses +=
                      "border-slate-200 bg-slate-50 text-slate-600";
                  }
                }

                return (
                  <button
                    key={optionIndex}
                    onClick={() => handleAnswerSelection(optionIndex)}
                    disabled={isAnswered}
                    className={buttonClasses}
                    aria-pressed={isSelected}
                    aria-describedby={
                      isAnswered
                        ? `explanation-${currentQuestion.id}`
                        : undefined
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {isAnswered && isCorrect && (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {userAnswers[currentQuestion.id] !== undefined && (
              <div
                id={`explanation-${currentQuestion.id}`}
                className={`p-6 rounded-lg border-l-4 ${
                  userAnswers[currentQuestion.id] ===
                  currentQuestion.correctAnswer
                    ? "bg-green-50 border-green-400"
                    : "bg-blue-50 border-blue-400"
                }`}
              >
                <div className="flex items-start mb-3">
                  {userAnswers[currentQuestion.id] ===
                  currentQuestion.correctAnswer ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-bold">i</span>
                    </div>
                  )}
                  <div>
                    <h3
                      className={`font-semibold mb-2 ${
                        userAnswers[currentQuestion.id] ===
                        currentQuestion.correctAnswer
                          ? "text-green-800"
                          : "text-blue-800"
                      }`}
                    >
                      {userAnswers[currentQuestion.id] ===
                      currentQuestion.correctAnswer
                        ? "Correct! Well done."
                        : "Incorrect, but let's learn!"}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        userAnswers[currentQuestion.id] ===
                        currentQuestion.correctAnswer
                          ? "text-green-700"
                          : "text-blue-700"
                      }`}
                    >
                      {currentQuestion.explanation}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {currentQuestion.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-white bg-opacity-60 text-xs font-medium px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="bg-slate-50 border-t border-slate-200 p-6">
          <div className="flex justify-center space-x-2 mb-4">
            {questionData.map((_, index) => {
              const isAnswered =
                userAnswers[questionData[index].id] !== undefined;
              const isCorrect =
                userAnswers[questionData[index].id] ===
                questionData[index].correctAnswer;

              return (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    index === currentQuestionIndex
                      ? "bg-blue-600 w-8 scale-110"
                      : isAnswered
                      ? isCorrect
                        ? "bg-green-500 hover:scale-110"
                        : "bg-red-400 hover:scale-110"
                      : "bg-slate-300 hover:bg-slate-400 hover:scale-110"
                  }`}
                  aria-label={`Go to question ${index + 1}`}
                />
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${
                  (quizStats.totalAnswered / quizStats.totalQuestions) * 100
                }%`,
              }}
            />
          </div>
          <div className="text-center text-sm text-slate-600">
            Progress: {quizStats.totalAnswered} of {quizStats.totalQuestions}{" "}
            questions completed
          </div>
        </div>
      </div>

      {/* Completion Summary */}
      {quizStats.isComplete && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-8 text-center shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <Target className="w-12 h-12 text-green-600 mr-3" />
            <TrendingUp className="w-12 h-12 text-blue-600" />
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Assessment Complete! 🎉
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {quizStats.correctAnswers}
              </div>
              <div className="text-sm text-slate-600">Correct Answers</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {quizStats.accuracy}%
              </div>
              <div className="text-sm text-slate-600">Accuracy Rate</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {quizStats.averageTimePerQuestion}s
              </div>
              <div className="text-sm text-slate-600">Avg. Response Time</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6 text-left">
            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Performance Analysis
            </h3>

            <div className="space-y-3">
              {questionData.map((question, index) => {
                const userAnswer = userAnswers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={question.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isCorrect
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-800">
                          {question.category.replace("_", " ").toUpperCase()}
                        </div>
                        <div className="text-xs text-slate-600 capitalize">
                          {question.difficulty} •{" "}
                          {question.type.replace("_", " ")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="text-sm text-slate-600">
                        {Math.round(
                          (questionStartTimes[question.id] || 0) / 1000
                        )}
                        s
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake Assessment
            </button>

            <button
              onClick={() =>
                trackEvent("share_results", {
                  score: quizStats.correctAnswers,
                  accuracy: quizStats.accuracy,
                })
              }
              className="flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 transform hover:scale-105"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              View Detailed Analytics
            </button>
          </div>

          <div className="mt-6 text-slate-600">
            <p className="text-sm">
              Great job completing the assessment! Review your incorrect answers
              and come back tomorrow for new challenges.
            </p>
            {metrics.renderTime > 0 && (
              <p className="text-xs mt-2 text-slate-500">
                Performance: {metrics.renderTime.toFixed(2)}ms render time
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons for Incomplete Quiz */}
      {!quizStats.isComplete && (
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetQuiz}
            className="flex items-center justify-center px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors duration-200"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset Quiz
          </button>

          <button
            onClick={() => {
              const nextUnanswered = questionData.findIndex(
                (q, index) =>
                  userAnswers[q.id] === undefined &&
                  index > currentQuestionIndex
              );
              if (nextUnanswered !== -1) {
                navigateToQuestion(nextUnanswered, "jump_to_next");
              }
            }}
            disabled={quizStats.totalAnswered === questionData.length}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5 mr-2" />
            Jump to Next Unanswered
          </button>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="mt-8 bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">
          Keyboard Shortcuts
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
          <div>
            <kbd className="bg-slate-100 px-2 py-1 rounded">←</kbd> Previous
          </div>
          <div>
            <kbd className="bg-slate-100 px-2 py-1 rounded">→</kbd> Next
          </div>
          <div>
            <kbd className="bg-slate-100 px-2 py-1 rounded">A</kbd> Previous
          </div>
          <div>
            <kbd className="bg-slate-100 px-2 py-1 rounded">D</kbd> Next
          </div>
        </div>
      </div>

      {/* Development Performance Metrics (only in dev mode) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-xs text-yellow-800">
          <h4 className="font-semibold mb-1">Development Metrics</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>Render Time: {metrics.renderTime.toFixed(2)}ms</div>
            <div>
              Interaction Latency: {metrics.interactionLatency.toFixed(2)}ms
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionQuizApp;
