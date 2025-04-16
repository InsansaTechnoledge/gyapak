import React from 'react';
import { BarChart3, Rocket, Clock, Users, Settings, PiggyBank } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Rocket className="w-10 h-10 text-purple-600" />,
      title: "Efficient Assessment",
      description: "Create and administer exams seamlessly with our intuitive platform."
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-purple-600" />,
      title: "Comprehensive Analytics",
      description: "Gain valuable insights into student performance with detailed analytics."
    },
    {
      icon: <Clock className="w-10 h-10 text-purple-600" />,
      title: "Real-Time Testing",
      description: "Host live tests with instant feedback and monitoring capabilities."
    },
    {
      icon: <Users className="w-10 h-10 text-purple-600" />,
      title: "Simplified Student Management",
      description: "Easily add, organize, and track student data in one central location."
    },
    {
      icon: <Settings className="w-10 h-10 text-purple-600" />,
      title: "Customizable Features",
      description: "Tailor your tools to meet your specific institutional needs."
    },
    {
      icon: <PiggyBank className="w-10 h-10 text-purple-600" />,
      title: "Cost-Effective Solutions",
      description: "Start with our free trial and scale as your requirements grow."
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-purple-800 relative inline-block">
            Why Your Institute Should Register
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-purple-500 rounded-full"></div>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mt-6">
            Partnering with us provides your institution with cutting-edge tools designed to enhance 
            educational outcomes and streamline administrative processes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-purple-600 group"
            >
              <div className="mb-6 p-4 bg-purple-100 rounded-lg inline-block group-hover:bg-purple-200 transition-colors duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-purple-900 group-hover:text-purple-700 transition-colors duration-300">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;