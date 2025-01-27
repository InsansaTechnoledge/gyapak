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
import API_BASE_URL from "../config";
import LocationSection from "../../Components/OpportunityPageComponents/LocationSection";
import PositionSection from "../../Components/OpportunityPageComponents/PositionSection";
import SalarySection from "../../Components/OpportunityPageComponents/SalarySection";
import SelectionSection from "../../Components/OpportunityPageComponents/SelectionProcessSection";
import AdditionalDetailsSection from "../../Components/OpportunityPageComponents/AdditionalDetailsSection";
import { RingLoader } from "react-spinners";

const ModernExamDetailsPage = () => {
  // const data = {
  //   name: "Combined Defence Services Examination (I), 2025",
  //   date_of_notification: "11-12-2024",
  //   date_of_commencement: "13-04-2025",
  //   end_date: "31-12-2024",
  //   apply_link: "https://upsconline.gov.in",
  //   document_links: [
  //     "http://upsc.gov.in",
  //     "https://upsconline.gov.in/miscellaneous/QPRep",
  //     "http://www.joinindianarmy.nic.in",
  //     "http://www.joinindiannavy.gov.in",
  //   ],
  //   details: {
  //     vacancies: {
  //       total: 457,
  //       breakdown: {
  //         IMA: 100,
  //         INA: 32,
  //         Air_Force_Academy: 32,
  //         OTA_Men: 275,
  //         OTA_Women: 18,
  //       },
  //     },
  //     eligibility: {
  //       nationality: [
  //         "Indian citizen",
  //         "Subject of Nepal",
  //         "Person of Indian origin migrated from specified countries",
  //       ],
  //       age_limits: {
  //         IMA: "Born between 02-01-2002 and 01-01-2007",
  //         INA: "Born between 02-01-2002 and 01-01-2007",
  //         Air_Force_Academy: "Born between 02-01-2002 and 01-01-2006",
  //         OTA_Men: "Born between 02-01-2001 and 01-01-2007",
  //         OTA_Women: "Born between 02-01-2001 and 01-01-2007",
  //       },
  //       education: {
  //         IMA: "Degree of a recognized University or equivalent",
  //         INA: "Degree in Engineering from a recognized University/Institution",
  //         Air_Force_Academy: "Degree with Physics and Mathematics at 10+2 or Bachelor of Engineering",
  //         OTA: "Degree of a recognized University or equivalent",
  //       },
  //     },
  //     fee_details: {
  //       amount: "₹200",
  //       exempted_categories: ["Female", "SC/ST"],
  //     },
  //     important_dates: {
  //       modification_window: "01-01-2025 to 07-01-2025",
  //       results: "May 2025",
  //       SSB_interviews: "August–December 2025",
  //     },
  //     exam_centers: [
  //       "Agartala",
  //       "Ghaziabad",
  //       "Navi Mumbai",
  //       "Chennai",
  //       "Delhi",
  //       "Hyderabad",
  //       "Kolkata",
  //       "Mumbai",
  //       "Lucknow",
  //       "Bengaluru",
  //     ],
  //     contact_details: {
  //       facilitation_counter: "011-23381125, 011-23385271, 011-23098543",
  //       address: "UPSC Office, Gate C, New Delhi",
  //     },
  //     scheme_of_exam: {
  //       IMA_INA_AirForce: {
  //         subjects: {
  //           English: 100,
  //           General_Knowledge: 100,
  //           Elementary_Mathematics: 100,
  //         },
  //         total_marks: 300,
  //       },
  //       OTA: {
  //         subjects: {
  //           English: 100,
  //           General_Knowledge: 100,
  //         },
  //         total_marks: 200,
  //       },
  //     },
  //   },
  // };

  const location = useLocation();
  // Parse the query parameters
  const queryParams = new URLSearchParams(location.search);
  const examId = queryParams.get("id");
  const [data, setData] = useState();
  const [organization, setOrganization] = useState();
  const existingSections = ['document_links']

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await axios.get(`${API_BASE_URL}/api/event/${examId}`);

      if (response.status === 200) {
        console.log(response.data);
        setData(response.data.exam);
        setOrganization(response.data.organization.name);
      }
    }

    fetchEvent();
  }, [])

  if (!data && !organization) {
    return <div className='w-full h-screen flex justify-center'>
      <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
    </div>
  }


  return (
    <div className="min-h-screen bg-white text-gray-900 py-20 px-4">
      {/* Floating Orbs Background */}
      <FloatingOrbsBackground />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto relative">
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
          {<FeeDetailsSection data={data} existingSections={existingSections} />}


          {/* Important Dates and Exam Centers */}
          {/* Important Dates */}
          {
            <ImportantDatesSection data={data} existingSections={existingSections} />
          }


          {/* Exam Centers */}
          {<ExamCentresSection data={data} existingSections={existingSections} />}


          {/* Scheme of Examination */}
          {/* {
            data.details.scheme_of_exam
              ?
              <div className="flex flex-col flex-grow bg-white shadow-lg p-8 rounded-2xl mb-20">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-purple-500" />
                  Scheme of Examination
                </h2>
                <div className="flex flex-col gap-y-5 xl:space-x-5  xl:flex-row xl:space-y-0">
                  {<SchemeOfExamSection1 data={data} existingSections={existingSections} />}



                  {
                    <SchemeOfExamSection2 data={data} existingSections={existingSections} />
                  }
                </div>
              </div>
              :
              null
          } */}

          {/* Contact Details */}
          {
            <ContactDetailsSection data={data} existingSections={existingSections} />
          }
          {/* Important Links */}
          <AdditionalDetailsSection data={data.details} existingSections={existingSections} />
          {data.document_links.length > 0
          ?
          <ImportantLinksSection data={data} />
          
          :
          null
          }
        </div>
          </>
          :
          <>
          {data.document_links.length > 0
            ?
            <ImportantLinksSection data={data} />
            :
            null
          }
          </>
          }

      </div>
    </div>
  );




};

export default ModernExamDetailsPage;