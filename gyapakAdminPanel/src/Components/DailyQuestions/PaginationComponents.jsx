import {
  createQuestionService,
  updateQuestionService,
  deleteQuestionService,
  reuseQuestionService,
  fetchQuestionsService,
} from "../../Services/QuestionService";

const apiService = {
  async fetchQuestions(params) {
    try {
      const response = await fetchQuestionsService(params);
      return response;
    } catch (error) {
      console.error("Error fetching questions:", error);
      // Fallback to mock data or throw error based on your preference
      throw error;
    }
  },

  async fetchStats() {
    try {
      // You'll need to create a stats service endpoint
      // For now, using mock data until backend endpoint is ready
      const mockStats = {
        totalQuestions: 53,
        usedQuestions: 28,
        recentQuestions: 8,
        categoryStats: [
          { name: "Geography", count: 15 },
          { name: "Science & Technology", count: 12 },
          { name: "Current Affairs", count: 13 },
          { name: "History", count: 8 },
          { name: "Politics", count: 5 },
        ],
        difficultyStats: [
          { name: "Easy", count: 18 },
          { name: "Medium", count: 20 },
          { name: "Hard", count: 15 },
        ],
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockStats;

      // When you have the stats endpoint ready, replace with:
      // const response = await fetchStatsService();
      // return response;
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
  },

  async createQuestion(questionData, totalTime) {
    try {
      console.log("Creating question:", questionData);
      const response = await createQuestionService(questionData, totalTime);
      console.log("Question created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating question:", error);
      throw error;
    }
  },

  async updateQuestion(id, questionData, totalTime) {
    try {
      const response = await updateQuestionService(id, questionData, totalTime);
      return response;
    } catch (error) {
      console.error("Error updating question:", error);
      throw error;
    }
  },

  async deleteQuestion(id, totalTime) {
    try {
      const response = await deleteQuestionService(id, totalTime);
      return response;
    } catch (error) {
      console.error("Error deleting question:", error);
      throw error;
    }
  },

  async reuseQuestion(id, totalTime) {
    try {
      const response = await reuseQuestionService(id, totalTime);
      return response;
    } catch (error) {
      console.error("Error reusing question:", error);
      throw error;
    }
  },
};

// Loading Components
const LoadingSkeleton = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
          <div className="h-5 bg-gray-200 rounded-full w-20"></div>
          <div className="h-5 bg-gray-200 rounded-full w-12"></div>
        </div>
        <div className="mb-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="space-y-3 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
            >
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center border-t pt-4">
          <div className="flex gap-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded w-12"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-14"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const StatsSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
    <div className="flex items-center gap-2 mb-6">
      <div className="h-6 w-6 bg-gray-200 rounded"></div>
      <div className="h-6 bg-gray-200 rounded w-32"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-4 bg-gray-50 rounded-lg">
          <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
        </div>
      ))}
    </div>
  </div>
);

// Error Boundary Component for better error handling
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <div className="text-red-600 mb-4">
      <svg
        className="w-12 h-12 mx-auto mb-2"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      <h3 className="text-lg font-semibold">Something went wrong</h3>
    </div>
    <p className="text-red-700 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

// Enhanced Pagination Component with better error handling
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  isLoading,
}) => {
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-t border-gray-200">
      <div className="text-sm text-gray-600">
        Showing{" "}
        <span className="font-medium">
          {startItem}-{endItem}
        </span>{" "}
        of <span className="font-medium">{totalItems}</span> questions
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isLoading}
          className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Go to first page"
        >
          First
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Go to previous page"
        >
          Previous
        </button>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <button
              key={index}
              onClick={() =>
                typeof page === "number" ? onPageChange(page) : null
              }
              disabled={isLoading || typeof page !== "number"}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                page === currentPage
                  ? "bg-purple-600 text-white shadow-sm"
                  : typeof page === "number"
                  ? "border border-gray-300 hover:bg-gray-50 text-gray-700"
                  : "cursor-default text-gray-400"
              }`}
              title={
                typeof page === "number" ? `Go to page ${page}` : undefined
              }
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Go to next page"
        >
          Next
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Go to last page"
        >
          Last
        </button>
      </div>
    </div>
  );
};

// Toast notification component for better user feedback
const Toast = ({ message, type = "success", onClose }) => (
  <div
    className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`}
  >
    <div className="flex items-center justify-between">
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        ×
      </button>
    </div>
  </div>
);

export {
  LoadingSkeleton,
  Pagination,
  StatsSkeleton,
  apiService,
  ErrorMessage,
  Toast,
};
