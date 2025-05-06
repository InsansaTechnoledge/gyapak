import { useEffect, useState } from 'react';
import { fetchOrganizationByName } from '../../../Service/calendar';


const orgNames = ['UPSC', 'SSC', 'ISRO', 'NDA', 'IPS', 'DRDO'];

export default function ExamHighlightSection() {
  const [orgData, setOrgData] = useState([]);

  useEffect(() => {
    const loadOrganizations = async () => {
      const promises = orgNames.map(async (name) => {
        try {
          const org = await fetchOrganizationByName(name);
          console.log(`✅ ${name} org data:`, org);
          return { name, logo: org.logo }; 
        } catch (err) {
          console.warn(`Failed to fetch ${name}:`, err.message);
          return { name, logo: null };
        }
      });

      const results = await Promise.all(promises);
      setOrgData(results);
    };

    loadOrganizations();
  }, []);

  return (
    <section className="py-12 bg-white mt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-purple-800">{`Upcoming Government Exams ${new Date().getFullYear()}`}</h2>
          <div className="w-16 h-1 bg-purple-600 mx-auto mt-3 mb-4"></div>
        </div>

        <div className="max-w-3xl mx-auto mb-10">
          <p className="text-gray-700 text-center mb-6">
            Stay ahead with Gyapak's comprehensive exam calendar covering UPSC, SSC, Banking, Railways, 
            and more. Never miss an important notification or application deadline.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto mb-10">
          {orgData.map((org, idx) => (
            <div key={idx} className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
              {org.logo ? (
                <img
                  src={`data:image/png;base64,${org.logo}`}
                  alt={org.name}
                  className="w-10 h-10 mb-2 object-contain"
                />
              ) : (
                <div className="w-10 h-10 mb-2 bg-purple-200 rounded-full"></div>
              )}
              <span className="font-medium text-purple-800">{org.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
