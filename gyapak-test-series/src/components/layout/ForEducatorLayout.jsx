import Footer from "../common/Footer/Footer";
import Navbar from "../common/Navbar/Navbar";
import EducatorNavbar from "../common/Navbar/EducatorNavbar";
import AnnouncementBanner from "../common/AnnouncementBanner/AnnouncementBanner";


export default function ForEducatorLayout({ children }) {
  return (
    <>
      <AnnouncementBanner/>
      <EducatorNavbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
 