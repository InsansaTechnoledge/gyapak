import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">
          ExamPrep<span className="text-secondary">Pro</span>
        </div>

        <nav className="hidden md:flex space-x-8">
          <a href="#" className="font-medium text-gray-900 hover:text-primary">Home</a>
          <a href="#exams" className="font-medium text-gray-900 hover:text-primary">Exams</a>
          <a href="#features" className="font-medium text-gray-900 hover:text-primary">Features</a>
          <a href="#pricing" className="font-medium text-gray-900 hover:text-primary">Pricing</a>
        </nav>

        <div className="hidden md:flex space-x-4 items-center">
          <button className="px-4 py-2 text-gray-600 hover:text-primary font-medium">Login</button>
          <button className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all">Sign Up</button>
        </div>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-lg">
          <nav className="flex flex-col space-y-3">
            <a href="#" className="font-medium text-gray-900 hover:text-primary py-2">Home</a>
            <a href="#exams" className="font-medium text-gray-900 hover:text-primary py-2">Exams</a>
            <a href="#features" className="font-medium text-gray-900 hover:text-primary py-2">Features</a>
            <a href="#pricing" className="font-medium text-gray-900 hover:text-primary py-2">Pricing</a>
            <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
              <button className="w-full py-2 text-gray-600 hover:text-primary font-medium">Login</button>
              <button className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all">Sign Up</button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
