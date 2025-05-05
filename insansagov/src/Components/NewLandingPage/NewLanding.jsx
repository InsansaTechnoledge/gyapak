import GovCalendar from "./components/GovCalendar";
// import LandingLeft from "./components/LandingLeft";
import LandingRight from "./components/LandingRight";

export default function GyapakLanding() {
  return (
    <div className="min-h-screen">
      {/* <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <LandingLeft />
        </div>
      </div> */}
      <LandingRight />

      <GovCalendar />
    </div>
  );
}
