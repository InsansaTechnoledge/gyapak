import React from 'react';
import moment from 'moment';
import { Calendar, ChevronRight, Tag } from 'lucide-react';

const LatestUpdateCard = (props) => {

  function formatDate(date) {
    if (!date) return ''; 

    if (typeof date === 'number') {
      return moment(date).format('MMMM D, YYYY');
    }

    if (typeof date === 'string') {
      const possibleFormats = ['YYYY-MM-DD', 'DD-MM-YYYY', 'MM-DD-YYYY'];
      for (let format of possibleFormats) {
        const parsedDate = moment(date, format, true);
        if (parsedDate.isValid()) {
          return parsedDate.format('MMMM D, YYYY');
        }
      }
    }

    console.error('Invalid date format or input:', date);
    return ''; 
  }




  const navigateToWebsite = (e) => {
    e.preventDefault(); // Prevents default link action
    if (props.apply_link) {
      window.open(props.apply_link, '_blank')// Redirects to the URL specified in props
    }
  }

  return (
    <>
      <div 
      onClick={navigateToWebsite}
      className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg hover:cursor-pointer">
        <div className="absolute inset-x-0 top-0 h-1 bg-purple-600" />

        {/* Card Content */}
          <div className="p-5" >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
                  {props.name}
                </h3>
                <div className="flex items-center space-x-4 mb-5">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{formatDate(props.date.toString())}</span>
                  </div>
                  <div className="flex items-center text-sm text-purple-600">
                    <Tag className="mr-2 h-4 w-4" />
                    <span>{props.organization}</span>
                  </div>
                </div>
              </div>
              <div className="transform transition-transform group-hover:translate-x-1">
                <ChevronRight className="h-5 w-5 text-purple-600" />
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                New
              </span>
              {/* <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                Important
              </span> */}
            </div>
          </div>
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-600 rounded-xl transition-colors" />
      </div>
    </>
  );
};

export default LatestUpdateCard;
