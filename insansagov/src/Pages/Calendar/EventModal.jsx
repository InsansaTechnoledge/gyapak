import { X, SquareArrowOutUpRight, Calendar } from "lucide-react";
import { generateSlugUrl } from "../../Utils/urlUtils.utils";

export default function EventModal({
  selectedDate,
  onClose,
  events,
  currentOrganizationSlug,
  navigate,
}) {
  // Utility to convert a date string/object to 'YYYY-MM-DD'
  const getDateKey = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const selectedDateKey = getDateKey(selectedDate?.start || selectedDate);

  const filteredEvents = events.filter((ev) => {
    const eventDateKey = getDateKey(ev?.start);
    return eventDateKey === selectedDateKey;
  });

  const hasEvents = filteredEvents.length > 0;

  // Format date with responsive considerations
  const formatDate = (date) => {
    const dateObj = new Date(date?.start || date);

    // Full format for larger screens
    const fullFormat = dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Shorter format for smaller screens
    const shortFormat = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return { fullFormat, shortFormat };
  };

  const dateFormats = formatDate(selectedDate);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 p-4 md:p-0">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md mx-auto overflow-hidden animate-fadeIn">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-4 py-3 sm:px-6 sm:py-4 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Calendar size={18} className="mr-2 flex-shrink-0" />
              <h2 className="text-base sm:text-lg font-semibold truncate">
                <span className="hidden sm:inline">
                  {dateFormats.fullFormat}
                </span>
                <span className="inline sm:hidden">
                  {dateFormats.shortFormat}
                </span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 bg-white bg-opacity-20 rounded-full p-1 transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Event content */}
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          {hasEvents ? (
            <div className="space-y-3 max-h-60 sm:max-h-80 overflow-y-auto pr-2">
              {filteredEvents.map((ev, index) => (
                <div
                  key={`${ev.title}-${index}`}
                  className="border-b border-purple-100 pb-3 last:border-0"
                >
                  <div className="font-medium text-xs sm:text-sm text-purple-700 mb-2 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-purple-600 mr-2 flex-shrink-0"></span>
                    <span className="truncate">
                      {ev.resource.organization.orgName}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {ev.resource.events.map((event) => (
                      <button
                        key={event.slug}
                        onClick={() =>
                          navigate(generateSlugUrl(event.eventName, event.slug))
                        }
                        className="flex justify-between w-full hover:bg-purple-50 p-2 sm:p-3 cursor-pointer rounded-lg transition-colors group"
                      >
                        <div className="text-left flex-grow font-medium text-sm sm:text-base text-gray-700 group-hover:text-purple-800 truncate mr-2">
                          {event.eventName}
                        </div>
                        <div className="bg-purple-100 group-hover:bg-purple-200 rounded-full p-1 transition-colors flex-shrink-0">
                          <SquareArrowOutUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <div className="text-purple-600 mb-2 flex justify-center">
                <Calendar size={32} className="sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-700">
                No events found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                There are no events scheduled for this date.
              </p>
            </div>
          )}
        </div>

        {/* Footer with action button */}
        <div className="bg-gray-50 px-4 py-2 sm:px-6 sm:py-3 flex justify-end border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>

      {/* Add some animation and styling */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .max-h-60::-webkit-scrollbar,
        .max-h-80::-webkit-scrollbar {
          width: 4px;
        }
        .max-h-60::-webkit-scrollbar-thumb,
        .max-h-80::-webkit-scrollbar-thumb {
          background-color: #ddd6fe;
          border-radius: 10px;
        }
        .max-h-60::-webkit-scrollbar-thumb:hover,
        .max-h-80::-webkit-scrollbar-thumb:hover {
          background-color: #a78bfa;
        }
        @media (max-width: 640px) {
          .max-h-60::-webkit-scrollbar {
            width: 3px;
          }
        }
      `,
        }}
      />
    </div>
  );
}
