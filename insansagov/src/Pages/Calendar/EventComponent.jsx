import moment from 'moment';

export default function EventComponent({ event, setSelectedDate, setShowEventModal, setCurrentOrganizationSlug }) {
  const handleClick = () => {
    if (event?.start) {
      const selectedMoment = moment(event.start);
      setSelectedDate(selectedMoment);
      setShowEventModal(true);
      setCurrentOrganizationSlug(event.resource.organization.orgId);
    }
  };

  // Check if title is too long
  const isTitleLong = event?.title?.length > 20;

  return (
    <div className='relative'>
      <div 
        onClick={handleClick} 
        className="cursor-pointer flex items-center space-x-2 sm:space-x-3 w-full max-w-full p-1.5 rounded-md hover:bg-purple-50 transition-colors duration-200" 
        title={event.title}
      >
       
        {event.resource?.organization?.logo ? (
          <img 
            src={`data:image/png;base64,${event.resource.organization.logo}`} 
            className="w-5 h-5 sm:w-6 sm:h-3 rounded flex-shrink-0 bg-slate-200" 
            alt={`${event.resource?.organization?.orgName || 'Organization'} logo`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNFMkU4RjAiLz48cGF0aCBkPSJNMTIgMTJDMTQuMjA5MSAxMiAxNiAxMC4yMDkxIDE2IDhDMTYgNS43OTA4NiAxNC4yMDkxIDQgMTIgNEM5Ljc5MDg2IDQgOCA1Ljc5MDg2IDggOEM4IDEwLjIwOTEgOS43OTA4NiAxMiAxMiAxMloiIGZpbGw9IiM5NEEzQjgiLz48cGF0aCBkPSJNMTIgMTRDOC4xMzQwMSAxNCA1IDE1LjQ2IDUgMThWMjBIMTlWMThDMTkgMTUuNDYgMTUuODY2IDE0IDEyIDE0WiIgZmlsbD0iIzk0QTNCOCIvPjwvc3ZnPg==';
            }}
          />
        ) : (
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded flex-shrink-0 bg-slate-200 flex items-center justify-center text-xs text-slate-500">
            {event.resource?.organization?.orgName?.[0] || '?'}
          </div>
        )}
        
       
        <span className={`font-semibold text-sm sm:text-base text-black ${isTitleLong ? 'truncate max-w-[180px] sm:max-w-none' : ''}`}>
          {event.title}
        </span>
      </div>

     
      <style jsx>{`
        @media (max-width: 640px) {
          .cursor-pointer:active {
            background-color: #ede9fe;
          }
        }
      `}</style>
    </div>
  );
}