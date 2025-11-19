import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdditionalDetailsSection = ({ name, data, existingSections }) => {
  const [isOpen, setIsOpen] = useState(true);

  // ✅ Check if there's any data not in existingSections (top-level only)
  const hasNonExistingSection = (data) => {
    if (typeof data === "object" && data !== null) {
      return Object.keys(data).some((key) => !existingSections.includes(key));
    }
    return false;
  };

  console.log("check", data);

  // ✅ Recursive content renderer with depth
  const renderContent = (data, level = 0) => {
    // primitives
    if (typeof data === "string" || typeof data === "number") {
      return (
        <div className="p-2 md:p-4 bg-purple-50 border border-purple-200 rounded-lg shadow-sm flex flex-grow flex-wrap">
          <p className="text-gray-700">{data}</p>
        </div>
      );
    }

    if (typeof data === "boolean") {
      return (
        <div className="p-2 md:p-4 bg-purple-50 border border-purple-200 rounded-lg shadow-sm flex flex-grow flex-wrap">
          <p className="text-gray-700">{data ? "Yes" : "No"}</p>
        </div>
      );
    }

    // arrays
    if (Array.isArray(data)) {
      return (
        <ul className="list-inside space-y-2 flex flex-col flex-grow flex-wrap">
          {data.map((item, index) => (
            <li key={index}>{renderContent(item, level + 1)}</li>
          ))}
        </ul>
      );
    }

    // objects
    if (typeof data === "object" && data !== null) {
      const entries = Object.entries(data);
      if (entries.length === 0) return null;

      return (
        <div className="gap-4 flex flex-wrap flex-grow">
          {entries.map(([key, value]) => {
            const isTopLevel = level === 0;
            const shouldSkip = isTopLevel && existingSections.includes(key);

            if (shouldSkip) return null; // only filter top-level keys

            return (
              <div
                key={`${level}-${key}`}
                className="p-3 bg-white border border-purple-300 rounded-lg shadow-md flex flex-col flex-wrap flex-grow"
              >
                <h3 className="font-medium text-purple-600 mb-2 capitalize">
                  {key.replace(/_/g, " ")}
                </h3>
                {typeof value === "boolean" || value ? (
                  <div className="space-y-2 flex flex-grow flex-wrap">
                    {renderContent(value, level + 1)}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      );
    }

    // fallback
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
        <p className="text-red-700">Unsupported Data Type</p>
      </div>
    );
  };

  if (!hasNonExistingSection(data)) return null;

  return (
    <div className="flex flex-col w-full lg:col-span-2 bg-white shadow-lg p-4 rounded-2xl mb-5">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-3 cursor-pointer select-none
                   p-3 rounded-xl transition-all duration-300"
      >
        <span
          className="absolute inset-0 rounded-xl bg-purple-50 scale-x-0 origin-left
                     group-hover:scale-x-100 transition-transform duration-300 ease-out"
        ></span>

        <motion.span
          className="relative z-10 flex items-center justify-center"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <Minus className="w-5 h-5 text-purple-600" />
          ) : (
            <Plus className="w-5 h-5 text-purple-600" />
          )}
        </motion.span>

        <span className="relative z-10 text-2xl font-semibold text-gray-800 
                         group-hover:text-purple-700 transition-colors duration-300">
          Additional Details for {name}
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
            <div className="space-y-6 flex mt-6">
              {renderContent(data)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdditionalDetailsSection;
