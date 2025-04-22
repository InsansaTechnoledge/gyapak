// src/components/affairs/AffairFilters.jsx
import { monthNames } from '../../utils/dateUtils';

export default function AffairFilters({
  categories,
  years,
  selectedCategory,
  setSelectedCategory,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  resetFilters
}) {
  return (
    <div className="py-4 border-t border-purple-100 mt-4 flex flex-wrap gap-4">
      <div className="w-40">
        <label className="block text-sm text-purple-600 mb-1">Category</label>
        <select
          className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      <div className="w-40">
        <label className="block text-sm text-purple-600 mb-1">Year</label>
        <select
          className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">All Years</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      
      <div className="w-40">
        <label className="block text-sm text-purple-600 mb-1">Month</label>
        <select
          className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {monthNames.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
      
      <div className="flex items-end">
        <button 
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
          onClick={resetFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}