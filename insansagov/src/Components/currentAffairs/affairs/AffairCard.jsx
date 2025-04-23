// src/components/affairs/AffairCard.jsx
import { Tag, Clock, ExternalLink } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

export default function AffairCard({ affair }) {
  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center text-sm text-purple-500 mb-3">
          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
            {affair.category}
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <Clock size={14} className="mr-1" />
            {formatDate(affair.date)}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-purple-900 mb-3">{affair.title}</h3>
        <p className="text-purple-800 mb-4">{affair.content}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {affair.tags.map((tag, idx) => (
            <span key={idx} className="inline-flex items-center text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              <Tag size={12} className="mr-1" />
              {tag}
            </span>
          ))}
        </div>
        
        {affair.source && (
          <div className="flex items-center text-sm text-purple-600">
            <ExternalLink size={14} className="mr-1" />
            <a href={affair.source} target="_blank" rel="noopener noreferrer" className="hover:underline">
              Source: {affair.source.replace(/(^\w+:|^)\/\//, '').split('/')[0]}
            </a>
          </div>
        )}
      </div>
    </article>
  );
}