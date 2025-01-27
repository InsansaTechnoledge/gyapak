import React, { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../Pages/config';

// Lazy load the components
const LatestUpdateCard = lazy(() => import('./LatestUpdateCard'));
const ViewMoreButton = lazy(() => import('../Buttons/ViewMoreButton'));

const LatestUpdates = ({ titleHidden }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [filteredLatestUpdates, setFilteredLatestUpdates] = useState([]);

  // Toggle View More/View Less
  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
    setFilteredLatestUpdates((prevIsExpanded) =>
      !prevIsExpanded ? latestUpdates : latestUpdates.slice(0, 2)
    );
  }, [latestUpdates]);

  // Fetch latest updates from API
  useEffect(() => {
    const fetchLatestUpdates = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/event/latest`);
        if (response.status === 201) {
          const sortedUpdates = response.data.sort((a, b) => {
            const dateA = new Date(a.date_of_notification);
            const dateB = new Date(b.date_of_notification);
            return isNaN(dateA) || isNaN(dateB) ? 0 : dateB - dateA; // Sort by date descending
          });

          setLatestUpdates(sortedUpdates.slice(0, 5));
          setFilteredLatestUpdates(sortedUpdates.slice(0, 2));
        }
      } catch (error) {
        console.error('Error fetching latest updates:', error);
      }
    };

    fetchLatestUpdates();
  }, []);

  return (
    <>
      <div className="flex justify-between mb-5">
        <div className="font-bold text-2xl flex items-center">Latest Updates</div>
        <Suspense fallback={<div>Loading...</div>}>
          <ViewMoreButton
            content={isExpanded ? 'View Less ▲' : 'View More ▼'}
            onClick={handleToggle}
          />
        </Suspense>
      </div>

      {!titleHidden && (
        <div className="space-y-5 mb-10">
          <Suspense fallback={<div>Loading updates...</div>}>
            {filteredLatestUpdates.map((update, index) => (
              <LatestUpdateCard
                key={update.id || index}
                name={update.name}
                date={update.date_of_notification}
                organization={update.organizationName}
                apply_link={update.apply_link}
              />
            ))}
          </Suspense>
        </div>
      )}
    </>
  );
};

export default LatestUpdates;
