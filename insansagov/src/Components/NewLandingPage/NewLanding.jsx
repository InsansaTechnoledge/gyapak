import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";

import GovCalendar from "./components/GovCalendar";
import QuizComponent from "./QuizComponent";
import { useApi, CheckServer } from "../../Context/ApiContext";
import { Link } from "react-router-dom";

export default function GyapakLanding() {
  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();
  const [stateCount, setStateCount] = useState(null);

  const Loading = () => (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 via-white to-sky-50">
      <RingLoader
        size={60}
        color={"#5B4BEA"}
        speedMultiplier={2}
        className="my-auto"
      />
    </div>
  );

  useEffect(() => {
    const fetchStateCount = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/state/count`);
        setStateCount(response.data);
      } catch (error) {
        if (error.response) {
          if (error.response.status >= 500 && error.response.status < 600) {
            console.error(
              "🚨 Server Error:",
              error.response.status,
              error.response.statusText
            );
            const url = await CheckServer();
            if (url) setApiBaseUrl?.(url);
            setServerError?.(error.response.status);
          } else {
            console.error("Error fetching state count:", error);
          }
        } else {
          console.error("Error fetching state count:", error);
        }
      }
    };

    if (apiBaseUrl) {
      fetchStateCount();
    }
  }, [apiBaseUrl, setApiBaseUrl, setServerError]);

  return (
    <div className="min-h-screen">
      <Suspense fallback={<Loading />}>
        <main className="mx-auto  px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 items-start">
                <section className="md:pl-10 md:mt-10 md:mb-3 ">
                  <h1 className="text-[11vw] sm:text-[4.2vw] lg:text-[3.6vw] font-black tracking-tight lowercase text-purple-600 leading-[1.05] mb-4">
                    Gyapak
                  </h1>

                  <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-xl mb-4">
                    Your ultimate guide for{" "}
                    <span className="font-semibold text-purple-600">
                      government jobs &amp; exams after 12th
                    </span>
                    — curated notifications, current affairs, and smart tools in
                    one place.
                  </p>

                  <p className="text-sm sm:text-base text-slate-500 max-w-lg">
                    Stay ahead with daily updates
                  </p>

                  {stateCount !== null && (
                    <p className="mt-2 text-xs sm:text-sm text-slate-400">
                      Active states covered:{" "}
                      <span className="font-semibold">
                        {String(stateCount?.states)}
                      </span>
                    </p>
                  )}
                </section>

                <div className="flex flex-col gap-4 ">
                  {/* Exam count card */}
                  <section className="flex justify-center md:justify-end">
                    {stateCount?.exams !== undefined && (
                      <div className="w-full max-w-xs sm:max-w-sm">
                        <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-white/90 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 mb-3">
                            <span className="h-2 w-2 rounded-full bg-purple-500" />
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-purple-700">
                              Ammount of Information we hold
                            </span>
                          </div>

                          <div className="flex items-baseline gap-2">
                            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                              {stateCount.exams}
                            </p>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                              gov info tracked
                            </span>
                          </div>

                          <p className="mt-2 text-xs sm:text-sm text-slate-600">
                            Active & upcoming government exams/jobs across
                            multiple{" "}
                            <span className="font-semibold text-purple-600">
                              states and categories
                            </span>
                            .
                          </p>

                          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Auto-updated from Gyapak data</span>
                            <span className="font-semibold text-purple-600">
                              Live count
                            </span>
                          </div>

                          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-400/0 via-purple-400/0 to-blue-400/0 opacity-0 hover:opacity-30 blur-xl transition-opacity" />
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Today’s current affairs card */}
                  <section className="flex justify-center md:justify-end">
                    <a
                      href="/daily-updates"
                      className="block w-full max-w-xs sm:max-w-sm"
                    >
                      <div className="group relative flex flex-col gap-3 rounded-2xl border border-purple-100 bg-white/80 backdrop-blur-sm p-5 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold uppercase tracking-wide animate-pulse w-fit">
                          New • Daily
                        </span>

                        <div className="h-1 w-20 rounded-full bg-gradient-to-r from-green-500 via-emerald-400 to-lime-300" />

                        <div>
                          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                            आज की करेंट अफेयर्स
                          </p>
                          <p className="mt-1 text-lg font-bold text-slate-900">
                            Today&apos;s Current Affairs in Hindi
                          </p>
                          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Crisp exam-oriented notes &amp; MCQ coverage for all
                            major government exams — updated every morning.
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                          <span>Perfect for SSC • Bank • State PSC</span>
                          <span className="font-semibold text-emerald-600">
                            Free to access
                          </span>
                        </div>

                        <div className="mt-3 flex items-center text-xs font-semibold text-purple-600">
                          View now
                          <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </div>

                        <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-emerald-400/0 opacity-0 group-hover:opacity-30 blur-xl transition-opacity" />
                      </div>
                    </a>
                  </section>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/3">
              <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm p-5 shadow-sm hover:shadow-lg transition-shadow duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[11px] mb-3 font-semibold uppercase tracking-wide text-purple-600">
                      Gyapak Monthly
                    </p>
                    <h2 className="text-lg font-bold text-slate-900">
                      Magazine & Critical Alerts Booklet Store
                    </h2>
                  </div>
                </div>

                {/* Monthly Magazine block */}
                <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50/70 p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">
                      Monthly Exam Magazine
                    </p>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                      Latest issue
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    All important{" "}
                    <span className="font-semibold text-slate-800">
                      jobs, exams & current affairs
                    </span>{" "}
                    for this month in one PDF booklet.
                  </p>

                  <Link
                    // onClick={() =>
                    //   (window.location.href = "/monthly-magazine")
                    // }
                    to={"/monthly-magazine"}
                    className="mt-2 inline-flex items-center justify-center rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700 transition-colors"
                  >
                    Download Monthly Magazine
                  </Link>
                </div>

                {/* Divider */}
                <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                {/* Critical posts block */}
                {/* <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">
                      Critical Jobs & Exams
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
                      Expiring soon
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-slate-50 py-2">
                      <p className="text-xl font-bold text-slate-900">7</p>
                      <p className="text-[11px] text-slate-500">Active posts</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 py-2">
                      <p className="text-xl font-bold text-orange-600">3</p>
                      <p className="text-[11px] text-slate-500">
                        Ends in 2 days
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 py-2">
                      <p className="text-sm font-semibold text-emerald-700">
                        Nov 30
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Next last date
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-1">
                    Focus on{" "}
                    <span className="font-semibold text-slate-800">
                      deadlines closing in the next 2–5 days
                    </span>{" "}
                    so you never miss a form.
                  </p>

                  <button
                    onClick={() =>
                      (window.location.href = "/jobs/expiring-soon")
                    }
                    className="mt-2 inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-50 transition-colors"
                  >
                    View expiring jobs & exams →
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </main>

        <section className="">
          <div className="">
            <GovCalendar />
          </div>
        </section>

        {/* Optional Quiz */}
        {/* 
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <QuizComponent />
        </section> 
        */}
      </Suspense>
    </div>
  );
}
