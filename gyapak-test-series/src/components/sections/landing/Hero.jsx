import { ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <span className="bg-blue-100 text-primary px-4 py-1 rounded-full text-sm font-medium">
              #1 Test Series Platform
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 leading-tight">
              Master Government Exams with Our <span className="text-primary">Premium Test Series</span>
            </h1>
            <p className="text-lg text-gray-700 mt-6">
              Practice with exam-pattern tests designed by experts. Get detailed analysis and improve your score. Join 1M+ successful aspirants.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all text-lg flex items-center justify-center">
                Start Free Trial <ChevronRight size={20} className="ml-1" />
              </button>
              <button className="px-8 py-3 border-2 border-primary text-primary hover:bg-blue-50 rounded-lg font-medium transition-all text-lg flex items-center justify-center">
                Explore Exams
              </button>
            </div>
            <div className="mt-6 flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white">
                    <img src={`/api/placeholder/32/32`} alt="User" className="rounded-full" />
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-bold text-primary">100,000+</span> active students
              </div>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-8">
            {/* You can inject CountdownCard here */}
          </div>
        </div>
      </div>
    </section>
  );
}
