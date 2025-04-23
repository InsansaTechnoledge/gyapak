// src/components/layout/Layout.jsx
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, headerProps }) {
  return (
    <div className="min-h-screen bg-purple-50">
      <Header {...headerProps} />
      <main className="container mx-auto px-4 pt-28 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}