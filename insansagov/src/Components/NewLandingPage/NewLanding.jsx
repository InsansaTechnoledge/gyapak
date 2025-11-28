import { Suspense } from "react";
import GovCalendar from "./components/GovCalendar";
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
    <div className="min-h-screen ">
     
      <Suspense fallback={<Loading />}>
        {/* <LandingRight /> */}


       {/* <QuizComponent /> */}
       <div className="mt-40">
        <GovCalendar />
       </div>
      </Suspense>
    </div>
  );
}
