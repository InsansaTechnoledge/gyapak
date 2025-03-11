import { MailWarning, X } from 'lucide-react';
import React from 'react'

const ErrorAlert = ({title, message, setIsErrorVisible}) => {

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-96 p-8 transform transition-all duration-300 scale-100 animate-fade-in">
                    <div className="relative">
                        <button
                            onClick={() => setIsErrorVisible(false)}
                            className="absolute -right-4 -top-4 p-2 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
                        >
                            <X className="w-4 h-4 text-purple-800" />
                        </button>
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                                <MailWarning className="w-8 h-8 text-purple-800" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                            <p className="text-gray-600">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default ErrorAlert;