import ExamHighlightSection from "./HighlightSection";

export default function LandingRight() {
  return (
    <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
      <div className="relative h-full w-full mt-12 flex items-center justify-center bg-black">
  {/* Translucent background image */}
  <div className="absolute inset-0 bg-[url('/collage.jpg')] bg-cover bg-center opacity-40 z-0" />

  {/* Content (like input box) */}
  <div className="relative z-10 w-full max-w-md px-6">
    <div className="relative">
      <input
        type="text"
        placeholder="Search jobs, exams, sectors..."
        className="w-full pl-12 pr-4 py-3 rounded-xl border border-transparent bg-white text-gray-700 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200"
      />
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16.65 10.65A6 6 0 1110.65 4a6 6 0 016 6.65z" />
        </svg>
      </div>
    </div>
  </div>
</div>


      {/* <ExamHighlightSection/> */}


    </div>
  );
}
