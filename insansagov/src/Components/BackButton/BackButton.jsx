import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <button
            onClick={handleBack}
            className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 
                hover:text-purple-700 transition-colors duration-200 rounded-lg
                hover:bg-purple-50 active:bg-purple-100"
        >
            <ArrowLeft
                className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-200"
            />
            <span>Back</span>
        </button>
    );
};

export default BackButton;