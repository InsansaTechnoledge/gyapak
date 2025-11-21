import React from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useApi } from '../../Context/ApiContext'
import { Link } from 'react-router-dom'

export default function RecentVacencies() {

  const { apiBaseUrl } = useApi();

  const { data, error, isFetching, isLoading } = useQuery({
    queryKey: ['recent-vacancies'],
    queryFn: async () => {
      const res = await axios.get(`${apiBaseUrl}/api/event/getTodaysEvents?page=1&limit=3`);
      return res.data;
    },
    staleTime: 3000,
    refetchOnWindowFocus: false,
  });

  if (isLoading || isFetching) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
 <div className="p-4">
  <h2 className="font-semibold text-xl mb-6 text-gray-800">
    Recent Vacancies
  </h2>

  {/* Grid wrapper */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {data?.map((e, idx) => {
      const gyapakLink = generateLink(e);

      return (
        <Link
          key={e._id}
          to={gyapakLink}
          className={`
            bg-gradient-to-br from-purple-100 to-purple-200
            rounded-2xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.1)]
            transition-all duration-300 ease-out
            border border-purple-300
            hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]
            hover:-translate-y-2 hover:scale-[1.02]

          `}
        >
          <h3 className="text-purple-700 font-semibold text-lg leading-snug">
            {e.name}
          </h3>

          <p className="text-sm text-gray-600 mt-2">
            Click to view details →
          </p>
        </Link>
      );
    })}
  </div>
</div>


  );
}

function generateLink(e) {
  const base = "https://gyapak.in/top-exams-for-government-jobs-in-india";

  const slug = e.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${base}/${slug}?id=${e._id}`;
}
