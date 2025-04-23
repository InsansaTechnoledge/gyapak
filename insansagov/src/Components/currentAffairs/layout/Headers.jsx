// src/components/layout/Header.jsx
import { ChevronDown, ChevronRight } from 'lucide-react';
import SearchBar from '../../ui/SearchBar';
import AffairFilters from '../affairs/AffairFilters';

export default function Header({ 
  searchTerm, 
  setSearchTerm, 
  showFilters, 
  setShowFilters,
  filterProps
}) {
  return (
    <header className="bg-white border-b border-purple-100 fixed w-full z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-purple-800">Current Affairs Blog</h1>
          
          <div className="w-1/3">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          
          <button 
            className="flex items-center text-purple-600 hover:text-purple-900"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="mr-1">Filter</span>
            {showFilters ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
        
        {showFilters && <AffairFilters {...filterProps} />}
      </div>
    </header>
  );
}