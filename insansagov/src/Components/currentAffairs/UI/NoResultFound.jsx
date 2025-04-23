// src/components/ui/NoResultsFound.jsx
import { Info } from 'lucide-react';

export default function NoResultsFound() {
  return (
    <div className="text-center py-12">
      <Info size={48} className="mx-auto text-purple-300 mb-4" />
      <h3 className="text-xl font-medium text-purple-800 mb-2">No current affairs found</h3>
      <p className="text-purple-600">Try adjusting your search or filters</p>
    </div>
  );
}