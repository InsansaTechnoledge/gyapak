import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const SearchableDropdown = ({ 
  options, 
  placeholder, 
  onSelect, 
  value, 
  name,
  displayKey = 'name',
  valueKey = '_id',
  searchKeys = ['name'],
  className = '',
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option => {
    if (!searchTerm) return true;
    return searchKeys.some(key => 
      option[key]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle option selection
  const handleOptionSelect = (option) => {
    onSelect({
      target: {
        name: name,
        value: option[valueKey]
      }
    });
    setIsOpen(false);
    setSearchTerm('');
  };

  // Find selected option for display
  const selectedOption = options.find(option => option[valueKey] === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const getDisplayText = (option) => {
    if (typeof displayKey === 'function') {
      return displayKey(option);
    }
    return option[displayKey];
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-3 border-2 rounded-lg bg-white text-left flex items-center justify-between transition-colors ${
          disabled 
            ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
            : isOpen 
              ? 'border-purple-500 ring-2 ring-purple-200' 
              : 'border-purple-300 hover:border-purple-400'
        }`}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? getDisplayText(selectedOption) : placeholder}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option[valueKey]}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors ${
                    option[valueKey] === value 
                      ? 'bg-purple-100 text-purple-800 font-medium' 
                      : 'text-gray-700'
                  }`}
                >
                  {getDisplayText(option)}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;