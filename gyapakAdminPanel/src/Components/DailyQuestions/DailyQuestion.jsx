import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Plus,
  BookOpen,
  RefreshCw,
  AlertCircle,
  FileQuestionIcon,
  CheckCircle,
  X,
} from "lucide-react";
import QuestionCard from "./QuestionCard";
import {
  LoadingSkeleton,
  apiService,
  Pagination,
  StatsSkeleton,
  ErrorMessage,
  Toast,
} from "./PaginationComponents";
import SearchFilter from "./SearchFilter";
import Statistics from "./StatisticsComponent";
import QuestionForm from "./QuestionForm";

const DailyQuestions = () => {
  // State management
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage] = useState(10);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Modal and editing state
  const [showCreateQuestionModal, setShowCreateQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Action loading states for individual items
  const [actionLoading, setActionLoading] = useState({});

  // Toast notification state
  const [toast, setToast] = useState(null);
  const startTime = useRef(null);
  // Categories
  const categories = [
    "Defence",
    "Engineering",
    "Banking Finance",
    "Civil Services",
    "Medical",
    "Statistical Economics Services",
    "Academics Research",
    "Railways",
    "Public Services",
    "Technical",
    "Higher Education Specialized Exams",
    "Agriculture",
  ];

  // Difficulties
  const difficulties = ["Easy", "Medium", "Hard"];

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Set individual action loading
  const setItemLoading = (itemId, isLoading) => {
    setActionLoading((prev) => ({
      ...prev,
      [itemId]: isLoading,
    }));
  };

  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory, selectedDifficulty]);

  // Fetch questions with pagination and filters
  const fetchQuestions = useCallback(
    async (showLoadingState = true) => {
      if (showLoadingState) {
        setLoading(true);
      }
      setError(null);

      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
          ...(selectedCategory && { category: selectedCategory }),
          ...(selectedDifficulty && { difficulty: selectedDifficulty }),
        };

        const response = await apiService.fetchQuestions(params);

        // Handle different possible response structures
        const questionsData =
          response.questions || response.data?.questions || response;
        const totalPagesData =
          response.totalPages ||
          response.data?.totalPages ||
          Math.ceil(
            (response.totalCount ||
              response.data?.totalCount ||
              questionsData.length) / itemsPerPage
          );
        const totalCountData =
          response.totalCount ||
          response.data?.totalCount ||
          questionsData.length;

        setQuestions(Array.isArray(questionsData) ? questionsData : []);
        setTotalPages(totalPagesData);
        setTotalCount(totalCountData);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch questions. Please try again.";
        setError(errorMessage);
        console.error("Error fetching questions:", err);

        // Set empty state on error
        setQuestions([]);
        setTotalPages(1);
        setTotalCount(0);
      } finally {
        if (showLoadingState) {
          setLoading(false);
        }
      }
    },
    [
      currentPage,
      itemsPerPage,
      debouncedSearchTerm,
      selectedCategory,
      selectedDifficulty,
    ]
  );

  // Fetch statistics
  const fetchStats = useCallback(async (showLoadingState = true) => {
    if (showLoadingState) {
      setStatsLoading(true);
    }
    try {
      const statsData = await apiService.fetchStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching stats:", err);
      // Don't show error for stats - it's not critical
    } finally {
      if (showLoadingState) {
        setStatsLoading(false);
      }
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Handler functions
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setShowCreateQuestionModal(true);
  };

  const handleDelete = async (questionId) => {
    // Confirm deletion
    if (
      !window.confirm(
        "Are you sure you want to delete this question? This action cannot be undone."
      )
    ) {
      return;
    }

    setItemLoading(questionId, true);
    try {
      const totalTime = Math.floor((Date.now() - startTime.current) / 1000);
      await apiService.deleteQuestion(questionId, totalTime);

      showToast("Question deleted successfully!", "success");

      // Check if we need to go to previous page
      if (questions.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        // Refresh questions without showing loading state
        await fetchQuestions(false);
      }

      // Refresh stats
      await fetchStats(false);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete question. Please try again.";
      showToast(errorMessage, "error");
      console.error("Error deleting question:", err);
    } finally {
      setItemLoading(questionId, false);
    }
  };

  const handleReuse = async (questionId) => {
    setItemLoading(questionId, true);
    try {
      const totalTime = Math.floor((Date.now() - startTime.current) / 1000);
      await apiService.reuseQuestion(questionId, totalTime);

      // Update the specific question in state
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, lastUsed: new Date().toISOString() } : q
        )
      );

      showToast("Question marked as reused!", "success");

      // Refresh stats
      await fetchStats(false);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to reuse question. Please try again.";
      showToast(errorMessage, "error");
      console.error("Error reusing question:", err);
    } finally {
      setItemLoading(questionId, false);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([fetchQuestions(), fetchStats()]);
  };

  const handleCreateQuestionSubmit = async (questionData) => {
    try {
      const totalTime = Math.floor((Date.now() - startTime.current) / 1000);
      if (editingQuestion) {
        console.log("updating question");
        await apiService.updateQuestion(
          editingQuestion._id,
          questionData,
          totalTime
        );
      } else {
        await apiService.createQuestion(questionData, totalTime);
      }

      showToast(
        editingQuestion
          ? "Question updated successfully!"
          : "Question created successfully!",
        "success"
      );

      setShowCreateQuestionModal(false);
      setEditingQuestion(null);

      // Refresh data
      await Promise.all([fetchQuestions(false), fetchStats(false)]);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `Failed to ${
          editingQuestion ? "update" : "create"
        } question. Please try again.`;
      showToast(errorMessage, "error");
      console.error("Error with question:", err);
    }
  };

  const handleUpdateQuestion = async (questionId, questionData) => {
    setItemLoading(questionId, true);
    try {
      const totalTime = Math.floor((Date.now() - startTime.current) / 1000);
      await apiService.updateQuestion(questionId, questionData, totalTime);

      showToast("Question updated successfully!", "success");

      // Refresh questions
      await fetchQuestions(false);
      await fetchStats(false);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update question. Please try again.";
      showToast(errorMessage, "error");
      console.error("Error updating question:", err);
    } finally {
      setItemLoading(questionId, false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateQuestionModal(false);
    setEditingQuestion(null);
  };

  const handleRetryFetch = () => {
    setError(null);
    fetchQuestions();
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedDifficulty("");
  };

  // Memoized computed values
  const hasActiveFilters = useMemo(
    () => debouncedSearchTerm || selectedCategory || selectedDifficulty,
    [debouncedSearchTerm, selectedCategory, selectedDifficulty]
  );

  const isAnyActionLoading = useMemo(
    () => Object.values(actionLoading).some(Boolean),
    [actionLoading]
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <BookOpen className="text-purple-600" size={32} />
            <h2 className="text-3xl font-bold text-purple-800">
              Daily MCQ Questions Manager
            </h2>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading || statsLoading}
            className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              size={16}
              className={loading || statsLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
        <p className="text-gray-600">
          Create, manage, and organize your multiple choice questions with
          efficient pagination
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onRetry={handleRetryFetch} />
        </div>
      )}

      {/* Action Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateQuestionModal(true)}
          disabled={isAnyActionLoading}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          Create New MCQ Question
        </button>
      </div>

      {/* Question Form Modal */}
      {showCreateQuestionModal && (
        <QuestionForm
          onClose={handleCloseModal}
          isOpen={showCreateQuestionModal}
          onSubmit={handleCreateQuestionSubmit}
          editingQuestion={editingQuestion}
          categories={categories}
          difficulties={difficulties}
        />
      )}

      {/* Search and Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        categories={categories}
        difficulties={difficulties}
        onClearFilters={clearAllFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Questions List */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Questions {totalCount > 0 && `(${totalCount.toLocaleString()})`}
            {hasActiveFilters && (
              <span className="text-sm text-gray-500 font-normal ml-2">
                • Filtered results
              </span>
            )}
          </h3>
          {loading && (
            <div className="flex items-center gap-2 text-purple-600">
              <RefreshCw size={16} className="animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && !loading && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {debouncedSearchTerm && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                Search: "{debouncedSearchTerm}"
              </span>
            )}
            {selectedCategory && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                Category: {selectedCategory}
              </span>
            )}
            {selectedDifficulty && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Difficulty: {selectedDifficulty}
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Questions or Loading */}
        {loading ? (
          <LoadingSkeleton count={itemsPerPage} />
        ) : questions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileQuestionIcon
              size={48}
              className="mx-auto mb-4 text-gray-300"
            />
            <p className="text-lg mb-2">
              {hasActiveFilters
                ? "No questions match your filters"
                : "No questions found"}
            </p>
            <p className="text-sm mb-4">
              {hasActiveFilters
                ? "Try adjusting your search terms or filters"
                : "Create your first MCQ question to get started"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReuse={handleReuse}
                onUpdate={handleUpdateQuestion}
                isLoading={actionLoading[question.id] || false}
                isActionDisabled={isAnyActionLoading}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && questions.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalCount}
            itemsPerPage={itemsPerPage}
            isLoading={loading}
          />
        )}
      </div>

      {/* Statistics */}
      {/* <div className="mb-8">
        {statsLoading ? (
          <StatsSkeleton />
        ) : stats ? (
          <Statistics 
            stats={stats}
            questions={questions} 
            categories={categories}
            difficulties={difficulties}
          /> 
        ) : null}
      </div> */}
    </div>
  );
};

export default DailyQuestions;
