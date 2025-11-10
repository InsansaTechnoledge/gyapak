import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";

const ImportantLinksSection = ({ data }) => {

  const [isOpen, setIsOpen] = useState(false);

  const PrintLink = ({idx,link}) => {
    return (<a
      href={link}
      rel="noopener noreferrer"
      className="w-full md:w-1/2 text-center font-medium px-6 py-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all shadow"
    >
      Link {idx+1} for {data.name}
    </a>
    )
  }

  return (
    <footer className="flex-grow lg:col-span-2 bg-white shadow-lg p-4 mb-5  rounded-2xl">
      <h2
  onClick={() => setIsOpen(!isOpen)}
  className="text-2xl font-semibold flex items-center gap-3 hover:cursor-pointer text-gray-800"
>
  <span className="flex-shrink-0 flex items-center justify-center">
    {isOpen ? (
      <Minus className="w-5 h-5 text-purple-500" />
    ) : (
      <Plus className="w-5 h-5 text-purple-500" />
    )}
  </span>

  <span className="flex-1">
    Important Links 
  </span>
</h2>

        <AnimatePresence>
          {isOpen && <motion.div
           initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
          >


      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {data?.document_links ? (
          typeof data.document_links === "string" ? (
            <div className="p-4 bg-purple-50 rounded-lg ">
              <p>{data.document_links}</p>
            </div>
          ) : Array.isArray(data.document_links) ? (
            data.document_links.map((link, idx) =>
              
              link.startsWith("http")
              ?
              <PrintLink key={idx} idx={idx} link={link} />
              
              :
              (null)
            )
            
          ) : (
            <p className="text-gray-500">No links available</p>
          )
        ) : (
          <p className="text-gray-500">No links available</p>
        )}
      </div>
        </motion.div> }
        </AnimatePresence>
    </footer>
  );
};

export default ImportantLinksSection;
