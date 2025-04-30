import { X, SquareArrowOutUpRight, Calendar } from 'lucide-react';
import slugGenerator from '../../Utils/SlugGenerator';

export default function EventModal({ selectedDate, onClose, events, currentOrganizationSlug, navigate }) {
  // Filter events for the selected date and organization
  const filteredEvents = events
    .filter(ev => ev.start.toDateString() === selectedDate.toDate().toDateString() && 
            ev.resource.organization.orgId === currentOrganizationSlug);
  
  // Check if we have events to display
  const hasEvents = filteredEvents.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md mx-4 overflow-hidden animate-fadeIn">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Calendar size={18} className="mr-2" />
              <h2 className="text-lg font-semibold">
                {selectedDate.format("MMMM D, YYYY")}
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:text-purple-200 bg-white bg-opacity-20 rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Event content */}
        <div className="px-6 py-4">
          {hasEvents ? (
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {filteredEvents.map((ev, index) => (
                <div key={`${ev.title}-${index}`} className="border-b border-purple-100 pb-3 last:border-0">
                  <div className="font-medium text-sm text-purple-700 mb-2 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-purple-600 mr-2"></span>
                    {ev.resource.organization.orgName}
                  </div>
                  <div className="space-y-2">
                    {ev.resource.events.map((event) => (
                      <button
                        key={event.slug}
                        onClick={() => navigate(`/top-exams-for-government-jobs-in-india/${slugGenerator(event.eventName)}?id=${encodeURIComponent(event.slug)}`)}
                        className="flex justify-between w-full hover:bg-purple-50 p-3 cursor-pointer rounded-lg transition-colors group"
                      >
                        <div className="text-left flex-grow font-medium text-gray-700 group-hover:text-purple-800">{event.eventName}</div>
                        <div className="bg-purple-100 group-hover:bg-purple-200 rounded-full p-1 transition-colors">
                          <SquareArrowOutUpRight className="w-4 h-4 text-purple-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-purple-600 mb-2 flex justify-center">
                <Calendar size={40} />
              </div>
              <h3 className="text-lg font-medium text-gray-700">No events found</h3>
              <p className="text-gray-500 mt-1">There are no events scheduled for this date.</p>
            </div>
          )}
        </div>

        {/* Footer with action button */}
        <div className="bg-gray-50 px-6 py-3 flex justify-end border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>

      {/* Add some animation and styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .max-h-80::-webkit-scrollbar {
          width: 5px;
        }
        .max-h-80::-webkit-scrollbar-thumb {
          background-color: #ddd6fe;
          border-radius: 10px;
        }
        .max-h-80::-webkit-scrollbar-thumb:hover {
          background-color: #a78bfa;
        }
      `}} />
    </div>
  );
}