import Footer from "../common/Footer/Footer";
// import Navbar from "../common/navbar";
import Navbar from "../common/Navbar/Navbar";


export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
