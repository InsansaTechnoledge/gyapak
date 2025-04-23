// src/components/affairs/AffairsList.jsx
import { Calendar } from 'lucide-react';
import AffairCard from './AffairCard';
import NoResultsFound from '../ui/NoResultsFound';
import { formatDate } from '../../utils/dateUtils';

export default function AffairsList({ filteredAffairs, groupedAffairs, sortedDates }) {
  if (filteredAffairs.length === 0) {
    return <NoResultsFound />;
  }

  return (
    <div>
      {sortedDates.map(date => (
        <div key={date} className="mb-8">
          <div className="flex items-center mb-4">
            <Calendar className="text-purple-400 mr-2" size={18} />
            <h2 className="text-lg font-semibold text-purple-800">{formatDate(date)}</h2>
          </div>
          
          <div className="space-y-6">
            {groupedAffairs[date].map((affair, index) => (
              <AffairCard key={index} affair={affair} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}