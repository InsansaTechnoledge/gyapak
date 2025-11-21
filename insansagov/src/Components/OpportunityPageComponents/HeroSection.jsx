import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { formatDate, dateFormat } from '../../Utils/dateFormatter';

const HeroSection = ({ data, organization }) => {


  return (
    <div className="text-center mb-10">
      <h2 className="text-purple-700 text-lg mb-4 mt-5"><b>Top exams for government jobs in India</b> for {organization}</h2>
      <div className="inline-block relative mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent py-8   mb-12">
          {data.name}
        </h1>

        {/* Floating Date Cards */}
        <div className="flex justify-center gap-8 flex-wrap">
          {
            data.date_of_notification
            ?
            <div className="transform -rotate-3 bg-purple-200 p-6 rounded-lg shadow-lg">
              <Calendar className="w-8 h-8 mb-2 text-purple-700" />
              <p className="text-sm text-purple-900">Notification Date</p>
              <p className="font-bold text-purple-800">{dateFormat(data.date_of_commencement)}</p>
            </div>
            :
            null
          }
          {
            data.date_of_commencement
            ?
            <div className="transform rotate-3 bg-purple-300 p-6 rounded-lg shadow-lg">
              <Calendar className="w-8 h-8 mb-2 text-purple-800" />
              <p className="text-sm text-purple-900">Start Date</p>
              <p className="font-bold text-purple-900">{dateFormat(data.date_of_commencement)}</p>
            </div>
            :
            null
          }
          {/* {console.log(typeof(data.end_date))} */}
          {
            data.end_date
            ?
            <div className="transform -rotate-3 bg-purple-400 p-6 rounded-lg shadow-lg">
              <Clock className="w-8 h-8 mb-2 text-purple-900" />
              <p className="text-sm text-purple-900">Last Date</p>
              <p className="font-bold text-purple-900">{formatDate(data.end_date)}</p>
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
