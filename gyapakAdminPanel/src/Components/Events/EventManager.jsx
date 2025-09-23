import React, { useEffect, useState } from 'react';
import {
  fetchAllEvents,
  deleteEventById,
  updateEventById
} from '../../Services/service';
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
  ExternalLink,
  MapPin,
  Building,
  Clock,
  Users
} from 'lucide-react';

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching events from API...');
      const res = await fetchAllEvents();
      console.log('API Response:', res);
      setEvents(res.events || []);
    } catch (e) {
      console.error('Fetch error', e);
      console.error('Error details:', e.response?.data || e.message);
      setError(`Failed to load events: ${e.response?.data?.message || e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.event_name}"?`)) {
      try {
        await deleteEventById(event.organization_id._id, event._id);
        fetchData();
      } catch (error) {
        console.error('Delete error', error);
        setError('Failed to delete the event. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleRowExpansion = (eventId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedRows(newExpanded);
  };

  // Filter and sort events
  const filteredAndSortedEvents = events
    .filter(event => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        event.event_name?.toLowerCase().includes(searchLower) ||
        event.event_type?.toLowerCase().includes(searchLower) ||
        event.organization_id?.name?.toLowerCase().includes(searchLower) ||
        event.brief?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.event_name || '';
          bValue = b.event_name || '';
          break;
        case 'organization':
          aValue = a.organization_id?.name || '';
          bValue = b.organization_id?.name || '';
          break;
        case 'type':
          aValue = a.event_type || '';
          bValue = b.event_type || '';
          break;
        case 'date':
        default:
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
      }
      
      if (typeof aValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="flex justify-center items-center">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          <span className="ml-3 text-gray-600">Loading events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Event Management</h1>
            <p className="text-gray-600">
              Manage all events across organizations. Total: {events.length} events
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex flex-wrap gap-2">
            <button
              onClick={fetchData}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors gap-2"
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
              placeholder="Search by event name, type, organization, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="organization">Sort by Organization</option>
              <option value="type">Sort by Type</option>
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
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {filteredAndSortedEvents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {searchTerm ? 'No matching events found' : 'No Events Found'}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchTerm 
              ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
              : 'There are no events available. Add some new events to see them displayed here.'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 p-4 font-medium text-gray-700">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-3">Event Name</div>
              <div className="col-span-2">Organization</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Created Date</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredAndSortedEvents.map((event, index) => (
              <React.Fragment key={event._id}>
                {/* Main Row */}
                <div className="hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 p-4 items-center">
                    {/* Row Number */}
                    <div className="col-span-1 text-center text-sm font-medium text-gray-500">
                      {index + 1}
                    </div>

                    {/* Event Name */}
                    <div className="col-span-3">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 text-purple-600 mr-2" />
                        <div>
                          <div className="font-medium text-gray-800">{event.event_name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-48">
                            {event.brief || 'No description'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Organization */}
                    <div className="col-span-2">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-blue-600 mr-2" />
                        <div>
                          <div className="font-medium text-gray-800 text-sm">
                            {event.organization_id?.name || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {event.organization_id?.authority_type || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Type */}
                    <div className="col-span-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {event.event_type || 'Unknown'}
                      </span>
                    </div>

                    {/* Created Date */}
                    <div className="col-span-2">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-green-600 mr-2" />
                        <div className="text-sm text-gray-600">
                          {formatDate(event.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => toggleRowExpansion(event._id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            setEditModalOpen(true);
                          }}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                          title="Edit Event"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(event)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRows.has(event._id) && (
                  <div className="bg-gray-50 border-t border-gray-200">
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Basic Details */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-800 border-b pb-2">Basic Information</h4>
                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Event ID:</span> {event._id}</div>
                            <div><span className="font-medium">Brief:</span> {event.brief || 'Not provided'}</div>
                            <div><span className="font-medium">Event Type:</span> {event.event_type || 'Not specified'}</div>
                          </div>
                        </div>

                        {/* Dates Information */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-800 border-b pb-2">Important Dates</h4>
                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Application Start:</span> {formatDate(event.application_start_date)}</div>
                            <div><span className="font-medium">Application End:</span> {formatDate(event.application_end_date)}</div>
                            <div><span className="font-medium">Exam Date:</span> {formatDate(event.exam_date)}</div>
                            <div><span className="font-medium">Result Date:</span> {formatDate(event.result_date)}</div>
                          </div>
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-800 border-b pb-2">Additional Details</h4>
                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Total Vacancies:</span> {event.total_vacancies || 'Not specified'}</div>
                            <div><span className="font-medium">Age Limit:</span> {event.age_limit || 'Not specified'}</div>
                            <div><span className="font-medium">Created:</span> {formatDate(event.createdAt)}</div>
                            <div><span className="font-medium">Updated:</span> {formatDate(event.updatedAt)}</div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {event.details && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="font-medium text-gray-800 mb-2">Event Details</h4>
                          <div className="text-sm text-gray-600 bg-white p-3 rounded border">
                            {event.details}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManager;