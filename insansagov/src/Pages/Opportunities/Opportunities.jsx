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
import { extractExamId } from "../../Utils/extractExamId.jsx";
import ErrorPage from "../Error/ErrorPage";

const ModernExamDetailsPage = () => {
  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();
  const location = useLocation();
  const { slug } = useParams();         // e.g. "ssc-cgl-2024--507f..."
const { search } = useLocation();     // e.g. "?id=507f..."

const examId = extractExamId({ slug, search });

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
    staleTime: Infinity, 
    cacheTime: 24 * 60 * 60 * 1000, 
    refetchOnMount: true, 
    refetchOnWindowFocus: false, 
  });

  useEffect(() => {
    if (completeData) {
      setData(completeData.exam);
      setOrganization(completeData.organization.name);
    }
  }, [completeData]);

  // Show 404 error page if the API returns 404
  if (error === 404) {
    return (
      <ErrorPage
        code={404}
        message="Exam Not Found"
        subMessage="The exam you're looking for doesn't exist or has been removed."
      />
    );
  }

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

  const examName = data?.name || "Government Exam";
  const orgName = organization || "gyapak";

  const seoTitle = `${examName} Recruitment ${new Date().getFullYear()} | ${orgName}`;
  const seoDescription =
    data?.meta_description ||
    `Apply for ${examName} by ${orgName}. Check vacancies, eligibility, age limit, fees, important dates, exam centres and how to apply online on gyapak.`;

  const seoKeywords = [
    "gyapak",
    examName,
    `${examName} notification`,
    `${examName} recruitment`,
    `${examName} vacancies`,
    "government jobs",
    "sarkari exam",
    "government exam notifications",
  ].join(", ");

  

  return (
    <>
      {/* <Helmet>
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
        <meta property="og:description" content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs." />
      </Helmet> */}

      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        {/* <link rel="canonical" href={canonicalUrl} /> */}

        <meta property="og:type" content="article" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        {/* <meta property="og:url" content={canonicalUrl} /> */}
        <meta property="og:site_name" content="gyapak" />
        <meta property="og:image" content="https://gyapak.in/logo3.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content="https://gyapak.in/logo3.png" />
      </Helmet>

      <div className="min-h-screen utility-site-color mt-40 px-0 md:px-4 ">
        {/* Floating Orbs Background */}
        {/* <FloatingOrbsBackground /> */}

        {/* <div className="hidden md:flex flex-col justify-center items-center">
          <img src={logo} className="w-26 h-10" alt="gyapak logo" />
          <p className="mt-2 utility-secondary-color-2 text-sm shadow-xl">
            Stay updated. Stay ahead. Your trusted partner for government exams
          </p>
        </div> */}
        {/* <div className="hidden md:block w-3xl mt-4 shadow-lg rounded-full border-2 bg-gray-700"></div> */}

        {/* Main Content */}
        <div className="relative mx-auto  sm:mt-16 md:mt-24 ">
          {/* Hero Section */}
          <HeroSection data={data} organization={organization} />

          <BriefSection data={data} />

          
          {/* Quick Apply Button */}
          <QuickApplyButton data={data} />

          {data.document_links[0] && data.document_links.length > 0 ? (
              <ImportantLinksSection data={data} />
            ) : null}
            
          {/* {data.details ? (
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
          ) : null} */}
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

            
            <RecentVacencies />
          </>
        </div>
      </div>
    </>
  );
};

export default ModernExamDetailsPage;
