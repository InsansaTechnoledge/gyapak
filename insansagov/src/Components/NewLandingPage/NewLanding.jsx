import { Suspense } from "react";
import GovCalendar from "./components/GovCalendar";
// import LandingLeft from "./components/LandingLeft";
import LandingRight from "./components/LandingRight";
import { RingLoader } from "react-spinners";
import QuizComponent from "./QuizComponent";

export default function GyapakLanding() {

  const Loading = () => (
    <div className='w-full h-screen flex justify-center'>
      <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <LandingLeft />
        </div>
      </div> */}
      <Suspense fallback={<Loading />}>
        <LandingRight />


{/* <QuizComponent /> */}
        <GovCalendar />
      </Suspense>
    </div>
  );
}
