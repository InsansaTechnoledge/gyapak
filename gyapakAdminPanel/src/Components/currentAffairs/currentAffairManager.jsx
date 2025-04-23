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
  Globe
} from 'lucide-react';

const CurrentAffairManager = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandId, setExpandId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [error, setError] = useState(null);

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
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Current Affairs Management</h1>
            <p className="text-gray-500 mt-1">View, edit and delete uploaded current affairs</p>
          </div>
          
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 transition px-4 py-2 rounded-lg"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="ml-3 text-gray-600">Loading current affairs...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Current Affairs Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">There are no current affairs records available. Add some new records to see them displayed here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {records.map(rec => (
              <div key={rec._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="border-b border-gray-100 bg-gray-50 p-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <h2 className="font-semibold text-lg text-gray-800">{formatDate(rec.date)}</h2>
                        <p className="text-sm text-gray-500">{rec.affairs.length} {rec.affairs.length === 1 ? 'affair' : 'affairs'}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setExpandId(expandId === rec._id ? null : rec._id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                      >
                        {expandId === rec._id ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            <span>Collapse</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            <span>View All</span>
                          </>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => { setSelectedRecord(rec); setEditModalOpen(true); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(rec._id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>

                {expandId === rec._id && (
                  <div className="p-4 space-y-4">
                    {rec.affairs.map((affair, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition">
                        <h3 className="font-medium text-lg text-gray-800 mb-2">{affair.title}</h3>
                        
                        <div className="text-gray-600 mb-3">
                          {affair.content}
                        </div>
                        
                        <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
                          <div className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            {affair.category || 'Uncategorized'}
                          </div>
                          
                          <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded flex items-center">
                            <Globe className="h-3 w-3 mr-1" />
                            {affair.language === 'en' ? 'English' : affair.language === 'hi' ? 'Hindi' : affair.language}
                          </div>
                          
                          {affair.tags && affair.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(affair.tags) ? 
                                affair.tags.map((tag, idx) => (
                                  <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                    {tag}
                                  </span>
                                )) : 
                                typeof affair.tags === 'string' && affair.tags.split(',').map((tag, idx) => (
                                  <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                    {tag.trim()}
                                  </span>
                                ))
                              }
                            </div>
                          )}
                        </div>
                        
                        {affair.source && (
                          <div className="mt-3 text-xs">
                            <a 
                              href={affair.source} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Source Link
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
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