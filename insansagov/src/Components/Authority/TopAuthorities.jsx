import React, { lazy, Suspense, useState } from "react";
const TopAuthoritiesCard = lazy(() => import("./TopAuthoritiesCard"));
const ViewMoreButton = lazy(() => import("../Buttons/ViewMoreButton"));
import axios from "axios";
import { RingLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import { useApi, CheckServer } from "../../Context/ApiContext";
import { CentralAuthoriyComponentTitle } from "../../constants/Constants";

const PAGE_LIMIT = 8;

const TopAuthorities = (props) => {
  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();
  const [page, setPage] = useState(1);

  const fetchLogos = async ({ queryKey }) => {
    const [_key, apiBaseUrl, page] = queryKey;

    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/organization/logo`,
        {
          params: {
            page,
            limit: PAGE_LIMIT,
          },
        }
      );

      if (response.status === 200) {
        // expected: { data, total, page, limit }
        return response.data;
      }
      return { data: [], total: 0, page, limit: PAGE_LIMIT };
    } catch (error) {
      console.error("Error fetching organizations:", error);

      if (error.response || error.request) {
        if (
          (error.response &&
            error.response.status >= 500 &&
            error.response.status < 600) ||
          [
            "ECONNREFUSED",
            "ETIMEDOUT",
            "ENOTFOUND",
            "ERR_NETWORK",
          ].includes(error.code)
        ) {
          const url = await CheckServer();
          setApiBaseUrl(url);
          if (error.response) setServerError(error.response.status);
        } else {
          console.error("Error fetching state count:", error);
        }
      } else {
        console.error("Error fetching state count:", error);
      }

      return { data: [], total: 0, page, limit: PAGE_LIMIT };
    }
  };

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ["fetchLogos", apiBaseUrl, page],
    queryFn: fetchLogos,
    keepPreviousData: true,
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const organizations = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / PAGE_LIMIT);

  const handleViewMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handleCloseAll = () => {
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col justify-center mb-10">
        <h1 className="flex secondary-site-text-color py-4 main-site-color rounded-full text-center text-2xl justify-center mb-5 font-bold">
          {`${CentralAuthoriyComponentTitle} ${new Date().getFullYear()}`}
        </h1>
        <div className="flex justify-center">
          <RingLoader
            size={60}
            color={"#5B4BEA"}
            speedMultiplier={2}
            className="my-auto"
          />
        </div>
      </div>
    );
  }

  console.log("organizations in component:", organizations);

  return (
    <>
      {props.titleHidden ? null : (
        <h1 className="flex secondary-site-text-color py-4 main-site-color rounded-full text-center text-2xl justify-center mb-5 font-bold">
          {`${CentralAuthoriyComponentTitle} ${new Date().getFullYear()}`}
        </h1>
      )}

      <div className="grid grid-cols-2  lg:grid-cols-4 mb-5 gap-4">
        <Suspense
          fallback={
            <div className="w-full h-screen flex justify-center">
              <RingLoader
                size={60}
                color={"#5B4BEA"}
                speedMultiplier={2}
                className="my-auto"
              />
            </div>
          }
        >
          {organizations.length > 0 &&
            organizations.map((org) => (
              <TopAuthoritiesCard
                key={org._id}
                name={org.abbreviation}
                logo={org.logo}
                id={org._id}
              />
            ))}
        </Suspense>
      </div>

      <div className="flex justify-center gap-4 mb-20">
        <Suspense
          fallback={
            <div className="w-full h-screen flex justify-center">
              <RingLoader
                size={60}
                color={"#5B4BEA"}
                speedMultiplier={2}
                className="my-auto"
              />
            </div>
          }
        >
          {page < totalPages && (
            <ViewMoreButton content="View More ▼" onClick={handleViewMore} />
          )}
          {page > 1 && (
            <ViewMoreButton content="Close All ▲" onClick={handleCloseAll} />
          )}
        </Suspense>
      </div>
    </>
  );
};

export default TopAuthorities;
