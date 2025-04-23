import React, { useState } from 'react';
import CentralEvent from '../Components/CentralEvent';
import StateEvent from '../Components/StateEvent';
import AdminBlogPage from '../Components/BlogPage/AdminBlogPage';
import FloatingOrbsBackground from '../Components/FloatingOrbsBackground';
import EditEvent from '../Components/EditEvent/EditEvent';
import UploadCurrentAffairsPage from './CurrentAffairUpload';
import CurrentAffairManager from '../Components/currentAffairs/currentAffairManager';

const DataInsertion = () => {
  const [organizationType, setOrganizationType] = useState(null);

  const options = [
    { id: "Central", label: "Central Organization" },
    { id: "State", label: "State Organization" },
    { id: "blog", label: "Create Blog" },
    { id: "edit", label: "Edit Event"},
    { id: "delete", label: "Delete Event"},
    {id: "affair" , label: "create today's current affair"},
    {id: "manage-affair" , label: "manage all current affair"}

  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <FloatingOrbsBackground />
      
      <div className="container mx-auto px-4 py-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-800">
          gyapak Admin Panel 
        </h1>
        
        <div className="max-w-3xl w-full mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {options.map((option) => (
              <button
                key={option.id}
                className={`p-4 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg ${
                  organizationType === option.id
                    ? "bg-purple-800 scale-105"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
                onClick={() => setOrganizationType(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-8xl w-full bg-white rounded-lg shadow-lg p-6">
          {!organizationType && (
            <div className="text-center py-10 text-gray-600">
              <p className="text-lg">Please select an option above to get started</p>
            </div>
          )}
          
          {organizationType === "Central" && <CentralEvent />}
          {organizationType === "State" && <StateEvent />}
          {organizationType === "blog" && <AdminBlogPage />}
          {organizationType === "edit" && <EditEvent title={"Edit Event"}/>}
          {organizationType === "delete" && <EditEvent title={"Delete Event"}/>}
          {organizationType === "affair" && <UploadCurrentAffairsPage />}
          {organizationType === "manage-affair" && <CurrentAffairManager />}


        </div>
      </div>
    </div>
  );
};

export default DataInsertion;