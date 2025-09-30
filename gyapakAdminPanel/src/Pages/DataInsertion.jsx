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
import { LogOut } from 'lucide-react';
import axios from 'axios';

const DataInsertion = () => {
  const [organizationType, setOrganizationType] = useState(null);
  const [subOrgType, setSubOrgType] = useState(null);
  const [eventActionType, setEventActionType] = useState(null);
  const [faqActionType, setFaqActionType] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  // Fetch organizations from the backend
  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await axios.get('<backend_url>/organizations');
      setOrganizations(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

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

  // Render Add Organization page with internal tabs
  const renderAddOrgPage = () => {
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
    if (loading) return <p>Loading organizations...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
      <div>
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Manage Organizations</h2>
        <ul>
          {organizations.map((org) => (
            <li key={org._id} className="mb-4">
              <h3 className="text-lg font-semibold">{org.name}</h3>
              <p>{org.description}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Render component based on selection
  const renderComponent = () => {
    switch (organizationType) {
      case "add-events":
        return renderAddOrgPage();
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
                // Reset subOrgType when switching main options, but set default for add-org
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