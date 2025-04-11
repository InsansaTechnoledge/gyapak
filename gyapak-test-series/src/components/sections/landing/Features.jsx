import { FileText, CheckCircle, Search, BookOpen, Clock, User } from 'lucide-react';

const features = [
  {
    icon: <FileText size={24} className="text-primary" />,
    title: 'Exam-Pattern Tests',
    description: 'Designed as per the latest exam patterns & syllabi'
  },
  {
    icon: <CheckCircle size={24} className="text-primary" />,
    title: 'Comprehensive Coverage',
    description: 'Every topic covered with varying difficulty levels'
  },
  {
    icon: <Search size={24} className="text-primary" />,
    title: 'Detailed Analysis',
    description: 'AI-powered performance insights and improvement suggestions'
  },
  {
    icon: <BookOpen size={24} className="text-primary" />,
    title: 'In-depth Solutions',
    description: 'Step-by-step explanations with conceptual clarity'
  },
  {
    icon: <Clock size={24} className="text-primary" />,
    title: 'Time Management',
    description: 'Section-wise timing to improve your speed & accuracy'
  },
  {
    icon: <User size={24} className="text-primary" />,
    title: 'Expert Support',
    description: 'Dedicated mentors to resolve your doubts 24/7'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose Our Test Series
          </h2>
          <p className="text-lg text-gray-700 mt-4">
            Designed to maximize your preparation and boost your confidence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
