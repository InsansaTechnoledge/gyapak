import React, { useEffect, useState } from 'react';
import {
  fetchCurrentAffairs,
  deleteCurrentAffairById,
  updateCurrentAffairById
} from '../../Services/service';
import EditAffairModal from './editAffairModal';
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw, 
  AlertCircle,
  Tag,
  Globe,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';

const CurrentAffairManager = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of records per page
  const [totalPages, setTotalPages] = useState(0);
  const [paginatedRecords, setPaginatedRecords] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCurrentAffairs();
      setRecords(res.data || []);
    } catch (e) {
      console.error('Fetch error', e);
      setError('Failed to load current affairs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteCurrentAffairById(id);
        fetchData();
      } catch (error) {
        console.error('Delete error', error);
        setError('Failed to delete the record. Please try again.');
      }
    }
  };

  const handleUpdate = async (updated) => {
    try {
        console.log("🕵️ Original date from updated object:", updated.date);

      const formattedDate = new Date(updated.date);
      console.log("📆 Parsed date object:", formattedDate);

      const payload = {
        ...updated,
        date: formattedDate,
        month: formattedDate.getMonth() + 1,
        year: formattedDate.getFullYear()
      };
      
      if (isNaN(formattedDate)) {
        console.error("❌ Still Invalid Date");
        return;
      }
      
      await updateCurrentAffairById(updated._id, payload);
      
      setEditModalOpen(false);
      setSelectedRecord(null);
      fetchData();
    } catch (error) {
      console.error('Update error', error);
      setError('Failed to update the record. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleRowExpansion = (recordId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(recordId)) {
      newExpanded.delete(recordId);
    } else {
      newExpanded.add(recordId);
    }
    setExpandedRows(newExpanded);
  };

  // Pagination logic
  const updatePagination = (recordsToPage, page = currentPage) => {
    const total = Math.ceil(recordsToPage.length / itemsPerPage);
    setTotalPages(total);
    
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = recordsToPage.slice(startIndex, endIndex);
    
    setPaginatedRecords(paginated);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Clear expanded rows when changing pages
    setExpandedRows(new Set());
    // Scroll to top of table
    document.querySelector('.current-affairs-table')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredAndSortedRecords = records
    .filter(record => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        formatDate(record.date).toLowerCase().includes(searchLower) ||
        record.affairs.some(affair => 
          affair.title?.toLowerCase().includes(searchLower) ||
          affair.content?.toLowerCase().includes(searchLower) ||
          affair.category?.toLowerCase().includes(searchLower)
        )
      );
    })
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'date') {
        return multiplier * (new Date(a.date) - new Date(b.date));
      } else if (sortBy === 'affairs') {
        return multiplier * (a.affairs.length - b.affairs.length);
      }
      return 0;
    });

  // Effect to update pagination when records change
  useEffect(() => {
    // Reset to first page and update pagination when records or filters change
    setCurrentPage(1);
    updatePagination(filteredAndSortedRecords, 1);
  }, [records, searchTerm, sortBy, sortOrder]);

  // Effect to update pagination when page changes
  useEffect(() => {
    updatePagination(filteredAndSortedRecords, currentPage);
  }, [currentPage, filteredAndSortedRecords, itemsPerPage]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Current Affairs Management</h1>
              <p className="text-gray-500 mt-1">Manage and organize daily current affairs records</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={fetchData}
                className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition px-4 py-2 rounded-lg font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by date, title, content, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="affairs">Sort by Affairs Count</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex justify-center items-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="ml-3 text-gray-600">Loading current affairs...</span>
            </div>
          </div>
        ) : filteredAndSortedRecords.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {searchTerm ? 'No matching records found' : 'No Current Affairs Found'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                : 'There are no current affairs records available. Add some new records to see them displayed here.'
              }
            </p>
          </div>
        ) : (
          <div className="current-affairs-table bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 p-4 font-medium text-gray-700">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-3">Date</div>
                <div className="col-span-2 text-center">Affairs Count</div>
                <div className="col-span-2 text-center">Categories</div>
                <div className="col-span-2 text-center">Languages</div>
                <div className="col-span-2 text-center">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {paginatedRecords.map((rec, index) => (
                <React.Fragment key={rec._id}>
                  {/* Main Row */}
                  <div className="hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 p-4 items-center">
                      {/* Row Number */}
                      <div className="col-span-1 text-center text-sm font-medium text-gray-500">
                        {((currentPage - 1) * itemsPerPage) + index + 1}
                      </div>

                      {/* Date */}
                      <div className="col-span-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                          <div>
                            <div className="font-medium text-gray-800">{formatDate(rec.date)}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(rec.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Affairs Count */}
                      <div className="col-span-2 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {rec.affairs.length} {rec.affairs.length === 1 ? 'affair' : 'affairs'}
                        </span>
                      </div>

                      {/* Categories */}
                      <div className="col-span-2 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {[...new Set(rec.affairs.map(a => a.category).filter(Boolean))].slice(0, 2).map((cat, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              {cat}
                            </span>
                          ))}
                          {[...new Set(rec.affairs.map(a => a.category).filter(Boolean))].length > 2 && (
                            <span className="text-xs text-gray-500">+{[...new Set(rec.affairs.map(a => a.category).filter(Boolean))].length - 2} more</span>
                          )}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="col-span-2 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {[...new Set(rec.affairs.map(a => a.language))].map((lang, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              <Globe className="h-3 w-3 mr-1" />
                              {lang === 'en' ? 'EN' : lang === 'hi' ? 'HI' : lang?.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2">
                        <div className="flex justify-center gap-1">
                          <button 
                            onClick={() => toggleRowExpansion(rec._id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                            title={expandedRows.has(rec._id) ? "Collapse" : "Expand"}
                          >
                            {expandedRows.has(rec._id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                          
                          <button 
                            onClick={() => { setSelectedRecord(rec); setEditModalOpen(true); }}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          <button 
                            onClick={() => handleDelete(rec._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedRows.has(rec._id) && (
                    <div className="bg-gray-50 border-t border-gray-200">
                      <div className="p-6">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          Affairs Details ({rec.affairs.length} items)
                        </h4>
                        
                        <div className="grid gap-4">
                          {rec.affairs.map((affair, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-3">
                                <h5 className="font-medium text-lg text-gray-800">{affair.title}</h5>
                                <div className="flex gap-2">
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {affair.category || 'Uncategorized'}
                                  </span>
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                    <Globe className="h-3 w-3 mr-1" />
                                    {affair.language === 'en' ? 'English' : affair.language === 'hi' ? 'Hindi' : affair.language}
                                  </span>
                                </div>
                              </div>
                              
                              <p className="text-gray-600 mb-3 leading-relaxed">{affair.content}</p>
                              
                              {affair.tags && affair.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {(Array.isArray(affair.tags) ? affair.tags : affair.tags.split(',')).map((tag, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                      #{typeof tag === 'string' ? tag.trim() : tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              {affair.source && (
                                <div className="pt-3 border-t border-gray-100">
                                  <a 
                                    href={affair.source} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm transition"
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View Source
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Table Footer with Pagination */}
            <div className="bg-gray-50 border-t border-gray-200">
              {/* Current page stats */}
              <div className="flex justify-between items-center text-sm text-gray-600 p-4 border-b border-gray-200">
                <span>
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedRecords.length)} of {filteredAndSortedRecords.length} records
                  {searchTerm && ` (filtered by "${searchTerm}")`}
                </span>
                <span>
                  Total Affairs: {filteredAndSortedRecords.reduce((acc, rec) => acc + rec.affairs.length, 0)}
                </span>
              </div>

              {/* Pagination Component */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <span>Page {currentPage} of {totalPages}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                      }`}
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;
                        const isCurrentPage = page === currentPage;
                        
                        // Show first page, last page, current page, and pages around current page
                        if (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                isCurrentPage
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                        
                        // Show ellipsis for gaps
                        if (page === 2 && currentPage > 4) {
                          return (
                            <span key={page} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        
                        if (page === totalPages - 1 && currentPage < totalPages - 3) {
                          return (
                            <span key={page} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        
                        return null;
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <EditAffairModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        record={selectedRecord}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default CurrentAffairManager;