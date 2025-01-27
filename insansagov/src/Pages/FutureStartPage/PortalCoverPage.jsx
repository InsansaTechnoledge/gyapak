import React, { useState } from 'react';
import { ChevronRight, GraduationCap, Briefcase } from 'lucide-react';

const PortalCoverPage = () => {
    const [activeSection, setActiveSection] = useState(null);

    return (
        <div className="min-h-screen w-full flex overflow-hidden">
            <div
                className={`w-1/2 h-screen flex flex-col justify-center items-center 
        transition-all duration-500 ease-in-out
        ${activeSection === 'corp' ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
        bg-blue-50`}
                onMouseEnter={() => setActiveSection('govt')}
                onMouseLeave={() => setActiveSection(null)}
            >
                <GraduationCap
                    className="text-blue-600 mb-6"
                    size={80}
                    strokeWidth={1.5}
                />
                <h2 className="text-4xl font-bold text-blue-800 mb-6 text-center">
                    Government Exam Portal
                </h2>
                <p className="text-gray-700 text-center max-w-md mb-8 px-4">
                    Comprehensive platform for government exam notifications, preparation resources, and application tracking.
                </p>
                <button
                    className="bg-blue-600 text-white py-4 px-8 rounded-full 
          flex items-center hover:bg-blue-700 transition-colors"
                    onClick={() => window.location.href = '/government-exams'}
                >
                    Enter Exam Portal <ChevronRight className="ml-2" />
                </button>
            </div>

            <div
                className={`w-1/2 h-screen flex flex-col justify-center items-center 
        transition-all duration-500 ease-in-out
        ${activeSection === 'govt' ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
        bg-green-50`}
                onMouseEnter={() => setActiveSection('corp')}
                onMouseLeave={() => setActiveSection(null)}
            >
                <Briefcase
                    className="text-green-600 mb-6"
                    size={80}
                    strokeWidth={1.5}
                />
                <h2 className="text-4xl font-bold text-green-800 mb-6 text-center">
                    Corporate Job Portal
                </h2>
                <p className="text-gray-700 text-center max-w-md mb-8 px-4">
                    Dynamic job marketplace connecting talented professionals with leading corporate opportunities.
                </p>
                <button
                    className="bg-green-600 text-white py-4 px-8 rounded-full 
          flex items-center hover:bg-green-700 transition-colors"
                    onClick={() => window.location.href = '/corporate-jobs'}
                >
                    Enter Job Portal <ChevronRight className="ml-2" />
                </button>
            </div>
        </div>
    );
};

export default PortalCoverPage;