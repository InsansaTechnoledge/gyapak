import { useEffect, useState } from 'react';
// import { fetchAllOrganizations } from '../../services/organization'; 
import { fetchAllOrganizations } from '../../../Service/calendar';

export default function MarqueeOrgsWithLogos() {
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    const loadOrgs = async () => {
      try {
        const data = await fetchAllOrganizations();
        setOrgs(data);
      } catch (err) {
        console.error('❌ Error loading orgs:', err.message);
      }
    };

    loadOrgs();
  }, []);

  return (
    <div className="overflow-hidden  border-y border-purple-100 py-3">
      <div className="flex animate-marquee space-x-10 min-w-full">
        {[...orgs, ...orgs].map((org, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            {org.logo ? (
              <img
                src={`data:image/png;base64,${org.logo}`}
                alt={org.abbreviation || org.name}
                className="w-6 h-6 object-contain rounded"
              />
            ) : (
              <div className="w-6 h-6 bg-purple-200 rounded" />
            )}
            <span className="text-sm text-purple-800 font-medium whitespace-nowrap">
              {org.abbreviation || org.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
