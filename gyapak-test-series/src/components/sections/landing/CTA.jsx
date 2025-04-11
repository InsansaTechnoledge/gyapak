
import { CheckCircle } from 'lucide-react';

export default function CTA() {
  return (
    <section id="pricing" className="py-16 bg-gradient-to-br from-primary to-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Ace Your Exams?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of successful candidates who have transformed their preparation with our test series.
          </p>

          <div className="bg-white rounded-xl p-6 md:p-8 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">All Access Pass</h3>
                <p className="text-gray-600 mt-1">Unlimited access to all test series</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-gray-500 line-through text-sm">₹14,999</div>
                <div className="text-3xl font-bold text-gray-900">
                  ₹8,999
                  <span className="text-sm font-normal text-gray-500">/year</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                'Access to 45+ exam categories',
                '10,000+ practice tests',
                'Live doubt clearing sessions',
                'Performance analytics dashboard',
                'Personalized study plan',
                '24/7 expert support'
              ].map((feature, i) => (
                <div className="flex items-start" key={i}>
                  <CheckCircle size={18} className="text-green-500 mt-1 mr-2" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <button className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all text-center">
                Get Started Now
              </button>
              <button className="flex-1 py-3 border border-primary text-primary hover:bg-blue-50 rounded-lg font-medium transition-all text-center">
                View All Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
