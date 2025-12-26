import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";

const ImportantLinksSection = ({ data }) => {
  const [isOpen, setIsOpen] = useState(true);

  const PrintLink = ({ idx, link }) => {
    const visibleLink = link.length>=40? link.slice(0, 77) +'...': link;
    return (
        <a
        href={link}
        rel="noopener noreferrer"
        className="w-full break-words text-center font-medium px-6 py-3 
                  light-site-color-3 rounded-xl
                  hover:light-site-color hover:-translate-y-0.5 transition-all duration-200
                  shadow-sm hover:shadow-md"
      >
        {visibleLink}
      </a>

    );
  };

  return (
    <footer className="flex-grow lg:col-span-2 shadow-lg p-4 mb-5 rounded-2xl">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-3 cursor-pointer select-none
                   p-3 rounded-xl transition-all duration-300"
      >
        <span
          className="absolute inset-0 rounded-xl light-site-color-3 scale-x-0 origin-left 
                     group-hover:scale-x-100 transition-transform duration-300 ease-out"
        ></span>

        <motion.span
          className="relative z-10 flex items-center justify-center"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <Minus className="w-5 h-5 main-site-text-color" />
          ) : (
            <Plus className="w-5 h-5 main-site-text-color" />
          )}
        </motion.span>

        <span className="relative z-10 text-2xl font-semibold utility-site-color group-hover:main-site-text-color transition-colors duration-300">
          Important Links
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="flex flex-wrap justify-center gap-4 mt-3">
              {data?.document_links ? (
                typeof data.document_links === "string" ? (
                  <div className="p-4 light-site-color-3 rounded-lg">
                    <p>{data.document_links}</p>
                  </div>
                ) : Array.isArray(data.document_links) ? (
                  data.document_links.map(
                    (link, idx) =>
                      link.startsWith("http") && (
                        <PrintLink key={idx} idx={idx} link={link} />
                      )
                  )
                ) : (
                  <p className="utility-secondary-color">No links available</p>
                )
              ) : (
                <p className="utility-secondary-color">No links available</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default ImportantLinksSection;
