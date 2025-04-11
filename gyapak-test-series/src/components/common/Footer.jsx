export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-6">
                ExamPrep<span className="text-blue-400">Pro</span>
              </div>
              <p className="text-gray-400 mb-6">
                India's leading platform for government exam preparation with comprehensive test series and analytics.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform, i) => (
                  <a key={i} href="#" className="text-gray-400 hover:text-white">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
  
            <div>
              <h3 className="font-bold text-lg mb-4">Popular Exams</h3>
              <ul className="space-y-2">
                {['UPSC Civil Services', 'SBI PO & Clerk', 'SSC CGL', 'IBPS PO', 'RRB NTPC', 'State PSC Exams'].map((exam, i) => (
                  <li key={i}><a href="#" className="text-gray-400 hover:text-white">{exam}</a></li>
                ))}
              </ul>
            </div>
  
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['About Us', 'Contact Us', 'Privacy Policy', 'Terms & Conditions', 'Refund Policy', 'FAQs'].map((link, i) => (
                  <li key={i}><a href="#" className="text-gray-400 hover:text-white">{link}</a></li>
                ))}
              </ul>
            </div>
  
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start">
                  <span className="mr-2">📧</span> support@exampreppro.com
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📞</span> +91 9876543210
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📍</span> 123 Education Street, New Delhi, India - 110001
                </li>
              </ul>
            </div>
          </div>
  
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ExamPrepPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }
  