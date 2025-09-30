import React, { useState, useEffect } from 'react';
import CentralEvent from '../Components/CentralEvent';
import StateEvent from '../Components/StateEvent';
import AdminBlogPage from '../Components/BlogPage/AdminBlogPage';
import FloatingOrbsBackground from '../Components/FloatingOrbsBackground';
import EditEvent from '../Components/EditEvent/EditEvent';
import UploadCurrentAffairsPage from './CurrentAffairUpload';
import CurrentAffairManager from '../Components/currentAffairs/currentAffairManager';
import FAQCreate from '../Components/FAQ/FAQCreate';
import DeleteFAQ from '../Components/FAQ/DeleteFAQ';
import DailyQuestions from '../Components/DailyQuestions/DailyQuestion';
import { useAuth } from '../Components/Auth/AuthContext';
import { LogOut, Search, Building, Users, Filter } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const DataInsertion = () => {
  const [organizationType, setOrganizationType] = useState(null);
  const [subOrgType, setSubOrgType] = useState(null);
  const [eventActionType, setEventActionType] = useState(null);
  const [faqActionType, setFaqActionType] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    abbreviation: '',
    description: '',
    category: '',
    parent_organization: '',
    logo: null
  });
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const options = [
    {id: "add-org", label: "Add Organization" },
    {id: "add-events", label: "Add Events"},
    { id: "manage-events", label: "Manage Events"},
    {id: "affair" , label: "Create today's current affair"},
    {id: "manage-affair" , label: "Manage all current affair"},
    {id: "manage-faq", label: "Manage FAQ"},
    {id:"Today's Question", label: "Today's Question"},
    { id: "manage-organizations", label: "Manage Organizations" }
  ];

  const orgSubOptions = [
    { id: "Central", label: "Central Organization" },
    { id: "State", label: "State Organization" }
  ];

  const eventActionOptions = [
    { id: "edit", label: "Edit Event" },
    { id: "delete", label: "Delete Event" }
  ];

  const faqActionOptions = [
    { id: "create", label: "Create FAQ" },
    { id: "delete", label: "Delete FAQ" }
  ];

  // API Functions for Organizations
  const getAllOrganizations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/organizations`);
      if (response.data.organizations) {
        setOrganizations(response.data.organizations);
        setFilteredOrganizations(response.data.organizations);
        // Extract unique categories
        const uniqueCategories = [...new Set(response.data.organizations.map(org => org.category?.category).filter(Boolean))];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getOrganizationById = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/organizations/${id}`);
      return response.data.organization;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return null;
    }
  };

  const getOrganizationByAbbreviation = async (abbreviation) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/organizations/abbreviation/${abbreviation}`);
      return response.data.organization;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return null;
    }
  };

  const getOrganizationsByCategory = async (categoryName) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/organizations/category/${categoryName}`);
      if (response.data.organizations) {
        setFilteredOrganizations(response.data.organizations);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories for form dropdown
  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/organizations/categories`);
      if (response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.error || err.message);
    }
  };

  // Fetch all authorities for form dropdown
  const getAllAuthorities = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/organizations/authorities`);
      if (response.data.authorities) {
        setAuthorities(response.data.authorities);
      }
    } catch (err) {
      console.error('Error fetching authorities:', err);
      setError(err.response?.data?.error || err.message);
    }
  };

  // Create new organization
  const createOrganization = async (organizationData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/organizations`, [organizationData]);
      if (response.data.savedOrganizations) {
        setError(null);
        return response.data.savedOrganizations[0];
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Filter organizations based on search term and category
  const filterOrganizations = () => {
    let filtered = organizations;

    if (searchTerm) {
      filtered = filtered.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(org => org.category?.category === selectedCategory);
    }

    setFilteredOrganizations(filtered);
  };

  // Effect to filter organizations when search term or category changes
  useEffect(() => {
    filterOrganizations();
  }, [searchTerm, selectedCategory, organizations]);

  // Effect to fetch categories and authorities when add-org is selected
  useEffect(() => {
    if (organizationType === 'add-org') {
      getAllCategories();
      getAllAuthorities();
    }
  }, [organizationType]);

  // Fetch organizations from the backend
  const fetchOrganizations = async () => {
    await getAllOrganizations();
  };

  // Render Manage FAQ page with internal tabs
  const renderManageFAQPage = () => {
    return (
      <div>
        {/* Internal tabs for Create/Delete FAQ */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Manage FAQ</h2>
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {faqActionOptions.map((actionOption) => (
              <button
                key={actionOption.id}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                  faqActionType === actionOption.id
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-purple-600 hover:bg-white"
                }`}
                onClick={() => setFaqActionType(actionOption.id)}
              >
                {actionOption.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Render selected component */}
        <div>
          {faqActionType === "create" && <FAQCreate />}
          {faqActionType === "delete" && <DeleteFAQ />}
          {!faqActionType && (
            <div className="text-center py-10 text-gray-500">
              <p className="text-lg">Please select Create or Delete to continue</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render Manage Events page with internal tabs
  const renderManageEventsPage = () => {
    return (
      <div>
        {/* Internal tabs for Edit/Delete */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Manage Events</h2>
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {eventActionOptions.map((actionOption) => (
              <button
                key={actionOption.id}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                  eventActionType === actionOption.id
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-purple-600 hover:bg-white"
                }`}
                onClick={() => setEventActionType(actionOption.id)}
              >
                {actionOption.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Render selected component */}
        <div>
          {eventActionType === "edit" && <EditEvent title={"Edit Event"}/>}
          {eventActionType === "delete" && <EditEvent title={"Delete Event"}/>}
          {!eventActionType && (
            <div className="text-center py-10 text-gray-500">
              <p className="text-lg">Please select Edit or Delete to continue</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.abbreviation || !formData.category || !formData.parent_organization) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Prepare organization data according to backend format
      const organizationData = {
        name: formData.name,
        abbreviation: formData.abbreviation,
        description: formData.description,
        category: formData.category,
        parent_organization: formData.parent_organization
      };

      const result = await createOrganization(organizationData);
      
      if (result) {
        alert('Organization created successfully!');
        // Reset form
        setFormData({
          name: '',
          abbreviation: '',
          description: '',
          category: '',
          parent_organization: '',
          logo: null
        });
      }
    } catch (err) {
      console.error('Error creating organization:', err);
    }
  };

  // Render Add Organization page
  const renderAddOrgPage = () => {
    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-purple-800 mb-3">Add Organization</h2>
          <p className="text-gray-600 text-lg">
            Create new government organizations for the system
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Organization Form */}
        <form onSubmit={handleFormSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter organization name"
                  required
                />
              </div>

              {/* Abbreviation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abbreviation *
                </label>
                <input
                  type="text"
                  name="abbreviation"
                  value={formData.abbreviation}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter abbreviation"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter organization description"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Parent Authority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Authority *
              </label>
              <select 
                name="parent_organization"
                value={formData.parent_organization}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select parent authority</option>
                {authorities.map((authority) => (
                  <option key={authority._id} value={authority.name}>
                    {authority.name} ({authority.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Logo
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-400 transition">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="logo-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500">
                      <span>Upload a file</span>
                      <input id="logo-upload" name="logo-upload" type="file" className="sr-only" accept="image/*" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: '',
                    abbreviation: '',
                    description: '',
                    category: '',
                    parent_organization: '',
                    logo: null
                  });
                  setError(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Organization'}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  // Render Add Events page with internal tabs
  const renderAddEventsPage = () => {
    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-purple-800 mb-3">Add Events</h2>
          <p className="text-gray-600 text-lg">
            Create and manage government events for Central and State authorities
          </p>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Organization Type</h3>
            <div className="grid grid-cols-2 gap-4">
              {orgSubOptions.map((subOption) => (
                <button
                  key={subOption.id}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    subOrgType === subOption.id
                      ? "border-purple-600 bg-purple-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25 hover:shadow-md"
                  }`}
                  onClick={() => setSubOrgType(subOption.id)}
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      subOrgType === subOption.id
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600"
                    }`}>
                      {subOption.id === "Central" ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h4 className={`font-semibold text-lg mb-2 ${
                      subOrgType === subOption.id ? "text-purple-800" : "text-gray-800"
                    }`}>
                      {subOption.label}
                    </h4>
                    <p className={`text-sm ${
                      subOrgType === subOption.id ? "text-purple-600" : "text-gray-500"
                    }`}>
                      {subOption.id === "Central" 
                        ? "Add central government organizations, ministries, and federal agencies"
                        : "Add state government organizations, departments, and regional authorities"
                      }
                    </p>
                  </div>

                  {/* Active indicator */}
                  {subOrgType === subOption.id && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Form Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {subOrgType === "Central" && (
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Central Government Organization</h3>
              </div>
              <CentralEvent />
            </div>
          )}
          
          {subOrgType === "State" && (
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">State Government Organization</h3>
              </div>
              <StateEvent />
            </div>
          )}
          
          {!subOrgType && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">Select Organization Type</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Choose between Central or State government organization to begin adding organization details.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render Organization Management UI
  const renderOrganizationManagement = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="ml-4 text-gray-600">Loading organizations...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-800">Error Loading Organizations</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setError(null);
              fetchOrganizations();
            }}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Try Again
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-purple-800 mb-2">Organization Management</h2>
            <p className="text-gray-600">View and manage all government organizations</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Building className="w-4 h-4" />
            <span>{filteredOrganizations.length} organizations</span>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search organizations by name, abbreviation, or description..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchOrganizations}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Organizations Grid */}
        {filteredOrganizations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Organizations Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || selectedCategory 
                ? "Try adjusting your search criteria or filters." 
                : "No organizations are available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrganizations.map((org) => (
              <div
                key={org._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedOrganization(org)}
              >
                <div className="p-6">
                  {/* Logo and Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {org.logo ? (
                        <img
                          src={`data:image/png;base64,${org.logo}`}
                          alt={`${org.name} logo`}
                          className="w-12 h-12 rounded-lg object-cover mr-3"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <Building className="w-6 h-6 text-purple-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                          {org.name}
                        </h3>
                        <p className="text-sm text-purple-600 font-medium">
                          {org.abbreviation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {org.description || "No description available."}
                  </p>

                  {/* Category Badge */}
                  {org.category && (
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {org.category.category}
                      </span>
                      <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                        View Details →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Organization Detail Modal */}
        {selectedOrganization && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    {selectedOrganization.logo ? (
                      <img
                        src={`data:image/png;base64,${selectedOrganization.logo}`}
                        alt={`${selectedOrganization.name} logo`}
                        className="w-16 h-16 rounded-lg object-cover mr-4"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <Building className="w-8 h-8 text-purple-600" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedOrganization.name}
                      </h2>
                      <p className="text-lg text-purple-600 font-medium">
                        {selectedOrganization.abbreviation}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedOrganization(null)}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="space-y-6">
                  {/* Category */}
                  {selectedOrganization.category && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        {selectedOrganization.category.category}
                      </span>
                      {selectedOrganization.category.description && (
                        <p className="text-sm text-gray-600 mt-2">
                          {selectedOrganization.category.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600">
                      {selectedOrganization.description || "No description available."}
                    </p>
                  </div>

                  {/* Organization ID */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Organization ID</h3>
                    <p className="text-gray-600 font-mono text-sm">
                      {selectedOrganization._id}
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setSelectedOrganization(null)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render component based on selection
  const renderComponent = () => {
    switch (organizationType) {
      case "add-org":
        return renderAddOrgPage();
      case "add-events":
        return renderAddEventsPage();
      case "manage-events":
        return renderManageEventsPage();
      case "affair":
        return <UploadCurrentAffairsPage />;
      case "manage-affair":
        return <CurrentAffairManager />;
      case "manage-faq":
        return renderManageFAQPage();
      case "Today's Question":
        return <DailyQuestions />;
      case "manage-organizations":
        return renderOrganizationManagement();
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg">
              Please select an option from the sidebar.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen flex">
      <FloatingOrbsBackground />
      
      {/* Left Sidebar */}
      <div className="w-80 bg-white shadow-lg p-6 relative z-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-purple-800">
            Dashboard
          </h1>
        </div>
        
        <nav className="space-y-3">
          {options.map((option) => (
            <button
              key={option.id}
              className={`w-full text-left p-3 rounded-lg font-medium transition-all duration-300 ${
                organizationType === option.id
                  ? "bg-purple-800 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-800"
              }`}
              onClick={() => {
                setOrganizationType(option.id);
                // Reset subOrgType when switching main options, but set default for add-events
                if (option.id === "add-events") {
                  setSubOrgType("Central"); // Default to Central
                  setEventActionType(null);
                  setFaqActionType(null);
                } else if (option.id === "manage-events") {
                  setEventActionType("edit"); // Default to Edit Event
                  setSubOrgType(null);
                  setFaqActionType(null);
                } else if (option.id === "manage-faq") {
                  setFaqActionType("create"); // Default to Create FAQ
                  setSubOrgType(null);
                  setEventActionType(null);
                } else if (option.id === "manage-organizations") {
                  // Fetch organizations when the tab is selected
                  fetchOrganizations();
                  setSubOrgType(null);
                  setEventActionType(null);
                  setFaqActionType(null);
                } else {
                  setSubOrgType(null);
                  setEventActionType(null);
                  setFaqActionType(null);
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </nav>
        
        {/* Logout Button at Bottom */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition text-sm"
            title="Logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default DataInsertion;