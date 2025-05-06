// src/components/layout/Footer.jsx
export default function Footer() {
    return (
      <footer className="bg-white border-t border-purple-100 py-6">
        <div className="container mx-auto px-4 text-center text-purple-600">
          <p>{`© ${new Date().getFullYear()} Current Affairs Blog`}</p>
        </div>
      </footer>
    );
  }