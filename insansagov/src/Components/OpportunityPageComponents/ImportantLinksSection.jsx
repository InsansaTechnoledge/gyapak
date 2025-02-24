import React from "react";

const ImportantLinksSection = ({ data }) => {
  
  return (
    <footer className="flex-grow lg:col-span-2 bg-white shadow-lg p-8 rounded-2xl">
      <h2 className="text-2xl font-bold mb-6">Important Links</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {data?.document_links ? (
          typeof data.document_links === "string" ? (
            <div className="p-4 bg-purple-50 rounded-lg">
              <p>{data.document_links}</p>
            </div>
          ) : Array.isArray(data.document_links) ? (
            data.document_links.map((link, idx) => (
              <a
                key={idx}
                href={link}
                rel="noopener noreferrer"
                className="w-full text-center font-medium px-6 py-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all shadow"
              >
                Link {idx + 1}
              </a>
            ))
          ) : (
            <p className="text-gray-500">No links available</p>
          )
        ) : (
          <p className="text-gray-500">No links available</p>
        )}
      </div>
    </footer>
  );
};

export default ImportantLinksSection;
