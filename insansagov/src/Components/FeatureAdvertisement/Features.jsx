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
    return (
        <div>
            
          

            {/* Main Features Section */}
            <div className="max-w-7xl mx-auto py-20 xl:grid xl:grid-cols-10 xl:gap-x-10">
                <div className="text-center flex flex-col justify-center col-span-3">
                    <h2 className="text-4xl font-bold text-gray-900  mb-10">
                        Features Designed for Your Success
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Simplify your exam preparation journey with these powerful tools.
                    </p>
                </div>

                <div className="grid gap-10 sm:grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 col-span-7">
                    {/* Feature 1 */}
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <Calendar className="w-12 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Accurate Dates</h3>
                            <p className="text-gray-600">
                                Get reliable and updated information on all government exam schedules.
                            </p>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <Shield className="w-12 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Secure Information</h3>
                            <p className="text-gray-600">
                                Access verified and trustworthy data with complete peace of mind.
                            </p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <Smartphone className="w-12 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Mobile Friendly</h3>
                            <p className="text-gray-600">
                                Check exam dates anytime, anywhere with our responsive design.
                            </p>
                        </div>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <Globe className="w-12 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">National Coverage</h3>
                            <p className="text-gray-600">
                                Stay updated with exam dates from all over the country.
                            </p>
                        </div>
                    </div>

                    {/* Feature 5 */}
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <Users className="w-12 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Personalized Reminders</h3>
                            <p className="text-gray-600">
                                Set custom notifications to never miss a deadline.
                            </p>
                        </div>
                    </div>

                    {/* Feature 6 */}
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <Star className="w-12 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">User-Friendly Interface</h3>
                            <p className="text-gray-600">
                                Navigate effortlessly through our intuitive and simple platform.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturePage;
