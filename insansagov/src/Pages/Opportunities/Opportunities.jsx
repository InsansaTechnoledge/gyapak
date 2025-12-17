import React, { useEffect, useState } from "react";
import FloatingOrbsBackground from "../../Components/OpportunityPageComponents/FloatingOrbsBackground";
import HeroSection from "../../Components/OpportunityPageComponents/HeroSection";
import QuickApplyButton from "../../Components/OpportunityPageComponents/QuickApplyButton";
import VacanciesSection from "../../Components/OpportunityPageComponents/VacanciesSection";
import NationalitySection from "../../Components/OpportunityPageComponents/NationalitySection";
import AgeLimitSection from "../../Components/OpportunityPageComponents/AgeLimitSection";
import EducationSection from "../../Components/OpportunityPageComponents/EducationSection";
import FeeDetailsSection from "../../Components/OpportunityPageComponents/FeeDetailsSection";
import ImportantDatesSection from "../../Components/OpportunityPageComponents/ImportantDatesSection";
import ExamCentresSection from "../../Components/OpportunityPageComponents/ExamCentresSection";
import ContactDetailsSection from "../../Components/OpportunityPageComponents/ContactDetailsSection";
import ImportantLinksSection from "../../Components/OpportunityPageComponents/ImportantLinksSection";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import LocationSection from "../../Components/OpportunityPageComponents/LocationSection";
import PositionSection from "../../Components/OpportunityPageComponents/PositionSection";
import SalarySection from "../../Components/OpportunityPageComponents/SalarySection";
import SelectionSection from "../../Components/OpportunityPageComponents/SelectionProcessSection";
import AdditionalDetailsSection from "../../Components/OpportunityPageComponents/AdditionalDetailsSection";
import RecentVacencies from "../../Components/OpportunityPageComponents/RecentVacencies.jsx";
import OnPageBlog from "../../Components/OpportunityPageComponents/OnPageBlog";
import BriefSection from "../../Components/OpportunityPageComponents/BriefSection";
import { RingLoader } from "react-spinners";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useApi, CheckServer } from "../../Context/ApiContext";
import { extractIdFromSlug } from "../../Utils/urlUtils.utils.js";
import logo from "/logo3.png";

const ModernExamDetailsPage = () => {
  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();
  const location = useLocation();
  const { slug } = useParams(); // Get slug from URL path

  // Extract ID from slug using utility function
  const examId = extractIdFromSlug(slug);

  const [data, setData] = useState();
  const [organization, setOrganization] = useState();
  const existingSections = ["document_links", "vacancies"];
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/event/${examId}`);

      if (response.status === 200) {
        setData(response.data.exam);
        setOrganization(response.data.organization.name);
        return response.data;
      }
 
    } catch (error) {
      if (error.response || error?.request) {
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
          setError(error.response.status);
          setLoading(false);
        }
      } else {
        console.error("Error fetching state count:", error);
        setError(error);
        setLoading(false);
      }
    }
  };

  const { data: completeData, isLoading } = useQuery({
    queryKey: ["opportunity/" + examId, apiBaseUrl],
    queryFn: fetchEvent,
    staleTime: Infinity, // ✅ Data never becomes stale, preventing automatic refetch
    cacheTime: 24 * 60 * 60 * 1000, // ✅ Keeps cache alive for 24 hours in memory
    refetchOnMount: true, // ✅ Prevents refetch when component mounts again
    refetchOnWindowFocus: false, // ✅ Prevents refetch when switching tabs
  });

  useEffect(() => {
    if (completeData) {
      setData(completeData.exam);
      setOrganization(completeData.organization.name);
    }
  }, [completeData]);

  if (isLoading || (!data && !organization)) {
    return (
      <div className="w-full h-screen flex justify-center">
        <RingLoader
          size={60}
          color={"#5B4BEA"}
          speedMultiplier={2}
          className="my-auto"
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`top-exams-for-government-jobs-in-india`}</title>
        <meta
          name="description"
          content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!"
        />
        <meta
          name="keywords"
          content="government competitive exams after 12th,government organisations, exam sarkari results, government calendar,current affairs,top exams for government jobs in india,Upcoming Government Exams"
        />
        <meta property="og:title" content="gyapak" />
        <meta
          property="og:description"
          content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs."
        />
      </Helmet>

      <div className="min-h-screen bg-white text-gray-900 py-20 px-0 md:px-4 ">
        {/* Floating Orbs Background */}
        {/* <FloatingOrbsBackground /> */}

        <div className="hidden md:flex flex-col justify-center items-center">
          <img src={logo} className="w-26 h-10" alt="gyapak logo" />
          <p className="mt-2 text-gray-500 text-sm shadow-xl">
            Stay updated. Stay ahead. Your trusted partner for government exams
          </p>
        </div>
        <div className="hidden md:block w-3xl mt-4 shadow-lg rounded-full border-2 bg-gray-700"></div>

        {/* Main Content */}
        <div className="relative max-w-screen  mx-auto mt-10 sm:mt-16 md:mt-24 ">
          {/* Hero Section */}
          <HeroSection data={data} organization={organization} />

          <BriefSection data={data} />
          {/* Quick Apply Button */}

          <QuickApplyButton data={data} />

          {data.details ? (
            <>
              {
                <VacanciesSection
                  data={data}
                  existingSections={existingSections}
                />
              }
              <div className="flex w-full flex-wrap gap-10">
                {
                  <NationalitySection
                    data={data}
                    existingSections={existingSections}
                  />
                }

                {
                  <AgeLimitSection
                    data={data}
                    existingSections={existingSections}
                  />
                }

                {
                  <EducationSection
                    data={data}
                    existingSections={existingSections}
                  />
                }
                <LocationSection
                  data={data}
                  existingSections={existingSections}
                />
                <PositionSection
                  data={data}
                  existingSections={existingSections}
                />
                <SalarySection
                  data={data}
                  existingSections={existingSections}
                />
                <SelectionSection
                  data={data}
                  existingSections={existingSections}
                />

                {
                  <ImportantDatesSection
                    data={data}
                    existingSections={existingSections}
                  />
                }
                {
                  <ExamCentresSection
                    data={data}
                    existingSections={existingSections}
                  />
                }

                {
                  <ContactDetailsSection
                    data={data}
                    existingSections={existingSections}
                  />
                }
              </div>
            </>
          ) : null}
          <>
            <div className="flex flex-grow mt-10 flex-col">
              {/* Important Links */}
              <AdditionalDetailsSection
                name={data.name}
                data={data.details}
                existingSections={existingSections}
              />

              {/* this component for internal backlinking */}
            </div>

            {data.document_links[0] && data.document_links.length > 0 ? (
              <ImportantLinksSection data={data} />
            ) : null}
            <RecentVacencies />
          </>
        </div>
      </div>
    </>
  );
};

export default ModernExamDetailsPage;
