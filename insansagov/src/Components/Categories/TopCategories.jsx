import React, { useState, useEffect, lazy, Suspense } from "react";
const TopCategoriesCard = lazy(() => import("./TopCategoriesCard"));
import axios from "axios";
import { RingLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import { useApi, CheckServer } from "../../Context/ApiContext";

const TopCategories = (props) => {
  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/category/getCategories`
      );
      if (response.status === 201) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (error.response || error.request) {
        if (
          (error.response &&
            error.response.status >= 500 &&
            error.response.status < 600) ||
          error.code === "ECONNREFUSED" ||
          error.code === "ETIMEDOUT" ||
          error.code === "ENOTFOUND" ||
          error.code === "ERR_NETWORK"
        ) {
          const url = await CheckServer();
          setApiBaseUrl(url), setServerError(error.response.status);
        } else {
          console.error("Error fetching state count:", error);
        }
      } else {
        console.error("Error fetching state count:", error);
      }
    }
  };

  const { data: categories, isLoading } = useQuery({
    queryKey: ["fetchCategories", apiBaseUrl],
    queryFn: fetchCategories,
    staleTime: Infinity, // ✅ Data never becomes stale, preventing automatic refetch
    cacheTime: 24 * 60 * 60 * 1000, // ✅ Keeps cache alive for 24 hours in memory
    refetchOnMount: true, // ✅ Prevents refetch when component mounts again
    refetchOnWindowFocus: false, // ✅ Prevents refetch when switching tabs
  });

  if (isLoading || !categories) {
    return (
      <div className="w-full flex flex-col justify-center mb-10">
        <h1 className="flex text-center text-2xl justify-center mb-5 font-bold">
          Top Categories in government jobs after 12th
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

  return (
    <>
      {!props.titleHidden && (
        <h1 className="text-center text-xl md:text-2xl justify-center mb-10 font-bold">
          <span className="block md:inline">Top Categories in</span>{" "}
          <span className="block md:inline">government jobs after 12th</span>
        </h1>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 mb-20 gap-4">
        <Suspense
          fallback={
            <div>
              <div className="w-full h-screen flex justify-center">
                <RingLoader
                  size={60}
                  color={"#5B4BEA"}
                  speedMultiplier={2}
                  className="my-auto"
                />
              </div>
            </div>
          }
        >
          {categories.map((category, key) => (
            <TopCategoriesCard
              key={key}
              name={category.category}
              logo={category.logo}
              id={category._id}
            />
          ))}
        </Suspense>
      </div>
    </>
  );
};

export default TopCategories;
