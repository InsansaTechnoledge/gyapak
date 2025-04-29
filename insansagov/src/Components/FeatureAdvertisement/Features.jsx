import React from 'react';
import {
    Calendar,
    Shield,
    Smartphone,
    Globe,
    Users,
    Star
} from 'lucide-react';

const FeaturePage = () => {
    const features = [
        {
            icon: Calendar,
            title: "Accurate Dates",
            description: "Get reliable and updated information on all government exam schedules.",
            color: "bg-blue-100",
            iconColor: "text-blue-600"
        },
        {
            icon: Shield,
            title: "Secure Information",
            description: "Access verified and trustworthy data with complete peace of mind.",
            color: "bg-purple-100",
            iconColor: "text-purple-600"
        },
        {
            icon: Smartphone,
            title: "Mobile Friendly",
            description: "Check exam dates anytime, anywhere with our responsive design.",
            color: "bg-green-100",
            iconColor: "text-green-600"
        },
        {
            icon: Globe,
            title: "National Coverage",
            description: "Stay updated with exam dates from all over the country.",
            color: "bg-orange-100",
            iconColor: "text-orange-600"
        },
        {
            icon: Star,
            title: "User-Friendly Interface",
            description: "Navigate effortlessly through our intuitive and simple platform.",
            color: "bg-teal-100",
            iconColor: "text-teal-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <h1 className="text-5xl font-bold text-gray-900 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Features Designed for Your Success
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {`Simplify your exam preparation journey with these powerful tools designed to maximize your potential.`}
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-blue-500 transition-all duration-300 rounded-b-2xl"></div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default FeaturePage;