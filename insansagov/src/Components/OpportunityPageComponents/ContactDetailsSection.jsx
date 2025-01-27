import React from 'react'
import { Phone } from 'lucide-react'

const RenderDetails = ({ data, inner }) => {
  if (typeof data !== 'object' || data === null) {
    return <p className="font-medium">{data}</p>; // Base case: render single value
  }

  return (
    <div className="flex space-x-5">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className={`flex-grow p-4 bg-purple-50 rounded-lg ${inner ? 'border border-purple-500' : ''}`}>
          <p className="text-sm text-purple-500 mb-1">
            {key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
          </p>
          <RenderDetails data={value} inner={true}/> {/* Recursive call for nested objects */}
        </div>
      ))}
    </div>
  );
};

const ContactDetailsSection = ({ data, existingSections }) => {
  if (!data.details.contact_details) {
    return null
  }
  else {
    existingSections.push("contact_details");
  }

  return (
    <div className="flex-grow bg-white shadow-lg p-8 rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Phone className="w-6 h-6 text-purple-500" />
        Contact Details
      </h2>

      <RenderDetails data={data.details.contact_details} />


    </div>
  )
}

export default ContactDetailsSection