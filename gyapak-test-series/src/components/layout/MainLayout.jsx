import Footer from "../common/Footer";
import Navbar from "../common/navbar";


export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
