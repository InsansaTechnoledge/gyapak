import React, { useEffect, useState } from "react";
import MagazinePdf from "./MagazinePdf";
import VacanciesPdf from "./VacanciesPdf";

export default function PdfPage() {
  const [activeTab, setActiveTab] = useState("magazine");


  // useEffect(()=>{
  //   console.log(activeTab);
  // },[activeTab])

  return (
    <div className="min-h-screen w-full mt-16 md:mt-32  pt-10 flex flex-col items-center  ">

      <div className="flex bg-gray-100 rounded-2xl p-1 shadow-sm border border-gray-200">
        <button
          onClick={() => setActiveTab("magazine")}
          className={`px-6 py-2 text-sm font-semibold rounded-xl transition-all
            ${activeTab === "magazine" ? "bg-white shadow text-black" : "text-gray-500"}
          `}
        >
          MAGAZINE PDF
        </button>

        <button
          onClick={() => setActiveTab("vacancies")}
          className={`px-6 py-2 text-sm font-semibold rounded-xl transition-all
            ${activeTab === "vacancies" ? "bg-white shadow text-black" : "text-gray-500"}
          `}
        >
          VACANCIES PDF
        </button>
      </div>

      <div className="w-full mt-10 px-4">
        {activeTab === "magazine" ? <MagazinePdf /> : <VacanciesPdf />}
      </div>
    </div>
  );
}
