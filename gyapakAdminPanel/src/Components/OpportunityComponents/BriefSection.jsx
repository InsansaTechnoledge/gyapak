import React from 'react';

const BriefSection = ({ data = {}, onChange }) => {
  if (!data || typeof data !== 'object') return null;

  const handleInputChange = (key, value) => {
    onChange({ ...data, [key]: value });
  };

  const briefEntries = Object.entries(data).filter(
    ([, value]) =>
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
  );

  return (
    <div className="flex flex-col w-full bg-white shadow-lg p-4 md:p-8 rounded-2xl mb-5 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-purple-700">Brief Details</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {briefEntries.map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm text-purple-700 font-semibold mb-1 capitalize">
              {key.replace(/_/g, ' ')}
            </label>

            {typeof value === 'boolean' ? (
              <select
                value={value ? 'yes' : 'no'}
                onChange={(e) =>
                  handleInputChange(key, e.target.value === 'yes')
                }
                className="bg-white border border-purple-300 rounded px-3 py-2"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            ) : (
              <input
                type={typeof value === 'number' ? 'number' : 'text'}
                value={value}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="bg-white border border-purple-300 rounded px-3 py-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BriefSection;
