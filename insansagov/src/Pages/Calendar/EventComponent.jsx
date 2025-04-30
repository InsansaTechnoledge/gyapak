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

  return (
    <div className='relative'>
      <div onClick={handleClick} className="cursor-pointer flex items-center space-x-3 w-fit h-fit" title={event.title}>
        <img src={`data:image/png;base64,${event.resource.organization.logo}`} className="w-6 h-6 rounded bg-slate-200" />
        <span className="font-semibold text-black">{event.title}</span>
      </div>
    </div>
  );
}
