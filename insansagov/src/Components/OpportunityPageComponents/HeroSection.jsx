import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { formatDate, dateFormat } from '../../Utils/dateFormatter';

const HeroSection = ({ data, organization }) => {

console.log("fz", data);

 const formatDDMMYYYY = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(d)
    .replaceAll("/", "-"); 
};

  return (
    <div className="text-center mb-10">
      <h2 className="main-site-text-color text-lg mb-4 mt-5"><b>Top exams for government jobs in India</b> for {organization}</h2>
      <div className="inline-block relative mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold main-site-color bg-clip-text text-transparent py-8   mb-12">
          {data.name}
        </h1>

        {/* Floating Date Cards */}
        <div className="flex justify-center gap-8 flex-wrap">
          {
            data.date_of_notification
            ?
            <div className="transform -rotate-3 light-site-color-2 p-6 rounded-lg shadow-lg">
              <Calendar className="w-8 h-8 mb-2 main-site-text-color" />
              <p className="text-sm main-site-text-color">Notification Date</p>
              {/* <p className="font-bold main-site-text-color">{formatDDMMYYYY(data.updatedAt)}</p> */}
              <p className="font-bold main-site-text-color">{dateFormat(data.date_of_notification)}</p>
            </div>
            :
            null
          }
          {
            data.date_of_commencement
            ?
            <div className="transform rotate-3 light-site-color-4 p-6 rounded-lg shadow-lg">
              <Calendar className="w-8 h-8 mb-2 main-site-text-color" />
              <p className="text-sm main-site-text-color">Start Date</p>
              <p className="font-bold main-site-text-color">{dateFormat(data.date_of_commencement)}</p>
            </div>
            :
            null
          }
          {/* {console.log(typeof(data.end_date))} */}
          {
            data.end_date
            ?
            <div className="transform -rotate-3 light-site-color-5 p-6 rounded-lg shadow-lg">
              <Clock className="w-8 h-8 mb-2 main-site-text-color" />
              <p className="text-sm main-site-text-color">Last Date</p>
              <p className="font-bold main-site-text-color">{formatDate(data.end_date)}</p>
            </div>
            :
            null
          }
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
