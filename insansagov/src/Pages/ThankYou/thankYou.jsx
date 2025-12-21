import { CheckCircle, Home, Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    setTimeout(() => {
      navigate("/");
    }, 5000);
  }, []);

  return (
    <div className="mt-28 min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Animation Container */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-lg animate-bounce-slow">
            <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Message Sent Successfully!
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you for reaching out to us. We've received your message and our team will get back to you soon.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* What's Next Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
                <Mail className="w-6 h-6 text-purple-800" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  What Happens Next?
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>You'll receive a confirmation email shortly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Our support team will review your message</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>We'll respond within 24 hours during business days</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Support Info Card */}
          <div className="bg-gradient-to-br from-purple-800 to-indigo-700 rounded-2xl p-8 shadow-lg text-white">
            <h3 className="text-xl font-semibold mb-4">
              Need Immediate Help?
            </h3>
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-sm text-purple-100 mb-1">Email Support</p>
                <p className="font-semibold">queries@insansa.com</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-sm text-purple-100 mb-1">Support Hours</p>
                <p className="font-semibold">Mon - Fri: 10am - 6pm IST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto bg-purple-800 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-purple-200"
          >
            <Home className="w-5 h-5" />
            <span className="text-lg font-semibold">Back to Home</span>
          </button>
          
          <button
            onClick={() => navigate("/contact-us")}
            className="w-full sm:w-auto bg-white text-purple-800 border-2 border-purple-800 px-8 py-4 rounded-lg hover:bg-purple-50 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg"
          >
            <span className="text-lg font-semibold">Send Another Message</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Additional Resources */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            While you wait, explore these helpful resources:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/government-calendar")}
              className="px-6 py-2 bg-white border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all text-gray-700 hover:text-purple-800"
            >
              Government Calendar
            </button>
            <button
              onClick={() => navigate("/daily-updates")}
              className="px-6 py-2 bg-white border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all text-gray-700 hover:text-purple-800"
            >
              Daily Updates
            </button>
            <button
              onClick={() => navigate("/blog")}
              className="px-6 py-2 bg-white border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all text-gray-700 hover:text-purple-800"
            >
              Blog
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ThankYou;