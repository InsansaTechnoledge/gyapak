import React, { useState, useEffect } from 'react';
import { AlertTriangle, FileText, Calendar, HelpCircle, Building, Users, Tag, X, Loader, Trash2, Eye } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const OrganizationDeleteDialog = ({ 
  organization, 
  isOpen, 
  onClose, 
  onDeleteSuccess 
}) => {
  const [dependencies, setDependencies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmText, setConfirmText] = useState('');
  const [showDetails, setShowDetails] = useState({
    events: false,
    faqs: false,
    authorities: false,
    categories: false
  });

  // Fetch dependencies when dialog opens
  useEffect(() => {
    if (isOpen && organization) {
      fetchDependencies();
    }
  }, [isOpen, organization]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setDependencies(null);
      setError(null);
      setConfirmText('');
      setShowDetails({
        events: false,
        faqs: false,
        authorities: false,
        categories: false
      });
    }
  }, [isOpen]);

  const fetchDependencies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/organizations/${organization._id}/dependencies`
      );
      setDependencies(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch dependencies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirmText !== organization.name) {
      setError('Please type the organization name exactly to confirm deletion');
      return;
    }

    setDeleting(true);
    setError(null);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/organizations/${organization._id}/cascade`
      );
      
      onDeleteSuccess(response.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete organization');
    } finally {
      setDeleting(false);
    }
  };

  const toggleDetails = (section) => {
    setShowDetails(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-red-50 border-b border-red-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-900">Delete Organization</h2>
                <p className="text-red-700 mt-1">
                  This action cannot be undone. All related data will be permanently deleted.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-purple-600 mr-3" />
              <span className="text-gray-600">Loading dependencies...</span>
            </div>
          ) : error && !dependencies ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800 font-medium">Error</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={fetchDependencies}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : dependencies ? (
            <>
              {/* Organization Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-3">
                  <Building className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Organization to Delete</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <p className="text-gray-900 font-medium">{dependencies.organization.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Abbreviation:</span>
                    <p className="text-gray-900 font-medium">{dependencies.organization.abbreviation}</p>
                  </div>
                  {dependencies.organization.description && (
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium text-gray-500">Description:</span>
                      <p className="text-gray-700">{dependencies.organization.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Dependencies Summary */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Impact Analysis</h3>
                <p className="text-yellow-800 mb-3">
                  Deleting this organization will affect <strong>{dependencies.totalDependencies}</strong> related items:
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {/* Events */}
                  <div className="bg-white rounded-lg p-3 border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="text-2xl font-bold text-blue-600">
                        {dependencies.dependencies.events.count}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Events</p>
                    {dependencies.dependencies.events.count > 0 && (
                      <button
                        onClick={() => toggleDetails('events')}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        {showDetails.events ? 'Hide' : 'View'} Details
                      </button>
                    )}
                  </div>

                  {/* FAQs */}
                  <div className="bg-white rounded-lg p-3 border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <HelpCircle className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-bold text-green-600">
                        {dependencies.dependencies.faqs.count}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">FAQs</p>
                    {dependencies.dependencies.faqs.count > 0 && (
                      <button
                        onClick={() => toggleDetails('faqs')}
                        className="text-xs text-green-600 hover:text-green-800 mt-1 flex items-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        {showDetails.faqs ? 'Hide' : 'View'} Details
                      </button>
                    )}
                  </div>

                  {/* Authorities */}
                  <div className="bg-white rounded-lg p-3 border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="text-2xl font-bold text-purple-600">
                        {dependencies.dependencies.authorities.count}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Authorities</p>
                    {dependencies.dependencies.authorities.count > 0 && (
                      <button
                        onClick={() => toggleDetails('authorities')}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-1 flex items-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        {showDetails.authorities ? 'Hide' : 'View'} Details
                      </button>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="bg-white rounded-lg p-3 border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <Tag className="w-5 h-5 text-orange-600" />
                      <span className="text-2xl font-bold text-orange-600">
                        {dependencies.dependencies.categories.count}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Categories</p>
                    {dependencies.dependencies.categories.count > 0 && (
                      <button
                        onClick={() => toggleDetails('categories')}
                        className="text-xs text-orange-600 hover:text-orange-800 mt-1 flex items-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        {showDetails.categories ? 'Hide' : 'View'} Details
                      </button>
                    )}
                  </div>
                </div>

                {/* Warnings */}
                {dependencies.warnings.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-medium text-red-900 mb-2">⚠️ Deletion Warnings:</h4>
                    <ul className="list-disc list-inside text-red-800 text-sm space-y-1">
                      {dependencies.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Detailed Views */}
              {showDetails.events && dependencies.dependencies.events.count > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Events to be deleted ({dependencies.dependencies.events.count})
                  </h4>
                  <div className="max-h-32 overflow-y-auto">
                    {dependencies.dependencies.events.items.map((event, index) => (
                      <div key={event._id} className="bg-white rounded p-2 mb-2 border border-blue-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{event.name}</p>
                            <p className="text-sm text-gray-600">Type: {event.event_type}</p>
                          </div>
                          <span className="text-xs text-gray-500">{event.date_of_notification}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showDetails.faqs && dependencies.dependencies.faqs.count > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    FAQs to be deleted ({dependencies.dependencies.faqs.count})
                  </h4>
                  <div className="max-h-32 overflow-y-auto">
                    {dependencies.dependencies.faqs.items.map((faq, index) => (
                      <div key={faq._id} className="bg-white rounded p-2 mb-2 border border-green-200">
                        <p className="font-medium text-gray-900 truncate">{faq.question}</p>
                        <p className="text-sm text-gray-600">State: {faq.state}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showDetails.authorities && dependencies.dependencies.authorities.count > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Authorities to be updated ({dependencies.dependencies.authorities.count})
                  </h4>
                  <div className="max-h-32 overflow-y-auto">
                    {dependencies.dependencies.authorities.items.map((authority, index) => (
                      <div key={authority._id} className="bg-white rounded p-2 mb-2 border border-purple-200">
                        <p className="font-medium text-gray-900">{authority.name}</p>
                        <p className="text-sm text-gray-600">Type: {authority.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showDetails.categories && dependencies.dependencies.categories.count > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-orange-900 mb-3 flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Categories to be updated ({dependencies.dependencies.categories.count})
                  </h4>
                  <div className="max-h-32 overflow-y-auto">
                    {dependencies.dependencies.categories.items.map((category, index) => (
                      <div key={category._id} className="bg-white rounded p-2 mb-2 border border-orange-200">
                        <p className="font-medium text-gray-900">{category.category}</p>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirmation */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">Confirm Deletion</h3>
                <p className="text-red-800 mb-4">
                  To confirm deletion, please type the organization name exactly as shown: 
                  <span className="font-mono font-bold bg-white px-2 py-1 rounded ml-1">
                    {organization.name}
                  </span>
                </p>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type organization name to confirm"
                  className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-800 font-medium">Error</span>
                  </div>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-6">
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={onClose}
              disabled={deleting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting || !dependencies || confirmText !== organization?.name}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {deleting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Organization
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDeleteDialog;