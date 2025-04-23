import React, { useEffect, useState } from "react";
import FloatingOrbsBackground from "../../Components/OpportunityPageComponents/FloatingOrbsBackground";
import HeroSection from "../../Components/OpportunityPageComponents/HeroSection";
import QuickApplyButton from "../../Components/OpportunityPageComponents/QuickApplyButton";
import VacanciesSection from "../../Components/OpportunityPageComponents/VacanciesSection";
import NationalitySection from "../../Components/OpportunityPageComponents/NationalitySection";
import AgeLimitSection from "../../Components/OpportunityPageComponents/AgeLimitSection";
import EducationSection from "../../Components/OpportunityPageComponents/EducationSection";
import ImportantDatesSection from "../../Components/OpportunityPageComponents/ImportantDatesSection";
import ExamCentresSection from "../../Components/OpportunityPageComponents/ExamCentresSection";
import ContactDetailsSection from "../../Components/OpportunityPageComponents/ContactDetailsSection";
import ImportantLinksSection from "../../Components/OpportunityPageComponents/ImportantLinksSection";
import { useLocation } from "react-router-dom";
import LocationSection from "../../Components/OpportunityPageComponents/LocationSection";
import PositionSection from "../../Components/OpportunityPageComponents/PositionSection";
import SalarySection from "../../Components/OpportunityPageComponents/SalarySection";
import SelectionSection from "../../Components/OpportunityPageComponents/SelectionProcessSection";
import AdditionalDetailsSection from "../../Components/OpportunityPageComponents/AdditionalDetailsSection";

const ModernExamDetailsPage = ({eventData}) => {
  // Parse the query parameters
  const [data, setData] = useState(eventData);
  const existingSections = ['document_links', 'vacancies']



  if (!data) {
    return <div className='w-full h-screen flex justify-center'>
      Loading...
    </div>
  }


  return (
    <>

      <div className="min-h-screen bg-white text-gray-900 py-20 px-4">
        {/* Floating Orbs Background */}
        <FloatingOrbsBackground />

        {/* Main Content */}
        <div className="max-w-7xl relative mx-auto">
          {/* Hero Section */}
          <HeroSection data={data} />

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