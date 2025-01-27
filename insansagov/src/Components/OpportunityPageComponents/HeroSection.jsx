import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const HeroSection = ({ data, organization }) => {
  return (
    <div className="text-center mb-32">
      <h2 className="text-purple-700 text-lg mb-4">{organization}</h2>
      <div className="inline-block relative">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent mb-12">
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
              <p className="font-bold text-purple-800">{data.date_of_notification}</p>
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
              <p className="font-bold text-purple-900">{data.date_of_commencement}</p>
            </div>
            :
            null
          }
          {
            data.end_date
            ?
            <div className="transform -rotate-3 bg-purple-400 p-6 rounded-lg shadow-lg">
              <Clock className="w-8 h-8 mb-2 text-purple-900" />
              <p className="text-sm text-purple-900">Last Date</p>
              <p className="font-bold text-purple-900">{data.end_date}</p>
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
