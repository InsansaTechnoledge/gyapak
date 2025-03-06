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
import { useLocation } from "react-router-dom";
import axios from "axios";
import LocationSection from "../../Components/OpportunityPageComponents/LocationSection";
import PositionSection from "../../Components/OpportunityPageComponents/PositionSection";
import SalarySection from "../../Components/OpportunityPageComponents/SalarySection";
import SelectionSection from "../../Components/OpportunityPageComponents/SelectionProcessSection";
import AdditionalDetailsSection from "../../Components/OpportunityPageComponents/AdditionalDetailsSection";
import { RingLoader } from "react-spinners";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useApi, CheckServer } from "../../Context/ApiContext";

const ModernExamDetailsPage = () => {
  const { apiBaseUrl, setApiBaseUrl } = useApi();
  const location = useLocation();
  // Parse the query parameters
  const queryParams = new URLSearchParams(location.search);
  const examId = queryParams.get("id");
  const [data, setData] = useState();
  const [organization, setOrganization] = useState();
  const existingSections = ['document_links', 'vacancies']

  const fetchEvent = async () => {
    try {

      const response = await axios.get(`${apiBaseUrl}/api/event/${examId}`);

      if (response.status === 200) {
        console.log(response.data);
        setData(response.data.exam);
        setOrganization(response.data.organization.name);
        return response.data;
      }
    }
    catch (error) {
      if (error.response || error.request) {
        if ((error.response && error.response.status >= 500 && error.response.status < 600) || (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND' || error.code === "ERR_NETWORK")) {
          const url = await CheckServer();
          setApiBaseUrl(url);
        }
        else {
          console.error('Error fetching state count:', error);
        }
      }
      else {
        console.error('Error fetching state count:', error);
      }
    }
  }
  // useEffect(() => {

  //   fetchEvent();
  // }, [])

  const { data: completeData, isLoading } = useQuery({
    queryKey: ["opportunity/" + examId, apiBaseUrl],
    queryFn: fetchEvent,
    staleTime: Infinity, // ✅ Data never becomes stale, preventing automatic refetch
    cacheTime: 24 * 60 * 60 * 1000, // ✅ Keeps cache alive for 24 hours in memory
    refetchOnMount: true, // ✅ Prevents refetch when component mounts again
    refetchOnWindowFocus: false, // ✅ Prevents refetch when switching tabs
  })

  useEffect(() => {
    if (completeData) {
      setData(completeData.exam);
      setOrganization(completeData.organization.name);
    }
  }, [completeData])

  if (isLoading || (!data && !organization)) {
    return <div className='w-full h-screen flex justify-center'>
      <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
    </div>
  }


  return (
    <>
      <Helmet>
        <title>gyapak</title>
        <meta name="description" content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!" />
        <meta name="keywords" content="government exams, exam dates, admit cards, results, central government jobs, state government jobs, competitive exams, government jobs" />
        <meta property="og:title" content="gyapak" />
        <meta property="og:description" content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs." />
      </Helmet>
      <div className="min-h-screen bg-white text-gray-900 py-20 px-4">
        {/* Floating Orbs Background */}
        <FloatingOrbsBackground />

        {/* Main Content */}
        <div className="max-w-7xl relative mx-auto">
          {/* Hero Section */}
          <HeroSection data={data} organization={organization} />

          {/* Quick Apply Button */}
          <QuickApplyButton data={data} />

          {
            data.details
              ?
              <>

                {<VacanciesSection data={data} existingSections={existingSections} />}
                <div className="flex w-full flex-wrap gap-10">

                  {/* Vacancies Section */}


                  {/* Eligibility Grid */}

                  {/* Nationality */}
                  {<NationalitySection data={data} existingSections={existingSections} />}


                  {/* Age Limits */}
                  {
                    <AgeLimitSection data={data} existingSections={existingSections} />
                  }

                  {/* Education & Fee Details */}
                  {/* Education */}
                  {
                    <EducationSection data={data} existingSections={existingSections} />
                  }
                  <LocationSection data={data} existingSections={existingSections} />
                  <PositionSection data={data} existingSections={existingSections} />
                  <SalarySection data={data} existingSections={existingSections} />
                  <SelectionSection data={data} existingSections={existingSections} />

                  {/* Fee Details */}
                  {/* {<FeeDetailsSection data={data} existingSections={existingSections} />} */}


                  {/* Important Dates and Exam Centers */}
                  {/* Important Dates */}
                  {
                    <ImportantDatesSection data={data} existingSections={existingSections} />
                  }


                  {/* Exam Centers */}
                  {<ExamCentresSection data={data} existingSections={existingSections} />}


                  {/* Contact Details */}
                  {
                    <ContactDetailsSection data={data} existingSections={existingSections} />
                  }


                </div>
              </>
              :
              null
          }
          <>
            <div className="flex flex-grow mt-10">
              {/* Important Links */}
              <AdditionalDetailsSection data={data.details} existingSections={existingSections} />
            </div>
            {data.document_links && data.document_links.length > 0
              ?
              <ImportantLinksSection data={data} />
              :
              null
            }
          </>

        </div>
      </div>
    </>
  );




};

export default ModernExamDetailsPage;