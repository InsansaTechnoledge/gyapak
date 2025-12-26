import React, { useState } from "react";
import { Minus, Plus, ChevronRight, ChevronDown, Table, List, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdditionalDetailsSection = ({ name, data, existingSections }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [copiedPath, setCopiedPath] = useState(null);

  // Toggle row expansion for nested objects
  const toggleRow = (path) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedRows(newExpanded);
  };

  // Copy value to clipboard
  const copyToClipboard = (value, path) => {
    const textValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
    navigator.clipboard.writeText(textValue);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  // Check if there's any data not in existingSections
  const hasNonExistingSection = (data) => {
    if (typeof data === "object" && data !== null) {
      return Object.keys(data).some((key) => !existingSections.includes(key));
    }
    return false;
  };

  // Get data type badge
  const getTypeBadge = (value) => {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  };

  // Get type color
  const getTypeColor = (type) => {
    const colors = {
      string: "bg-blue-100 text-blue-700",
      number: "bg-green-100 text-green-700",
      boolean: "bg-purple-100 text-purple-700",
      object: "bg-orange-100 text-orange-700",
      array: "bg-pink-100 text-pink-700",
      null: "bg-gray-100 text-gray-700"
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  // Format key display
  const formatKey = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
      .trim();
  };

  // Render value based on type
  const renderValue = (value, path = "", level = 0) => {
    const isExpanded = expandedRows.has(path);

    // Null or undefined
    if (value === null || value === undefined) {
      return (
        <span className="text-gray-400 italic text-sm">—</span>
      );
    }

    // Boolean
    if (typeof value === "boolean") {
      return (
        <span className={`font-medium ${value ? "text-green-600" : "text-red-600"}`}>
          {value ? "✓ Yes" : "✗ No"}
        </span>
      );
    }

    // Number
    if (typeof value === "number") {
      return (
        <span className="font-mono text-sm font-medium">{value.toLocaleString()}</span>
      );
    }

    // String
    if (typeof value === "string") {
      const isLongText = value.length > 100;
      const isUrl = /^https?:\/\//i.test(value);
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      if (isUrl) {
        return (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-all text-sm"
          >
            {value}
          </a>
        );
      }
      
      if (isEmail) {
        return (
          <a 
            href={`mailto:${value}`}
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            {value}
          </a>
        );
      }
      
      return (
        <span className={`text-sm break-words ${isLongText ? "whitespace-pre-wrap" : ""}`}>
          {value}
        </span>
      );
    }

    // Array
    if (Array.isArray(value)) {
      const isPrimitiveArray = value.every(item => 
        typeof item !== 'object' || item === null
      );
      const itemCount = value.length;

      if (itemCount === 0) {
        return (
          <span className="text-gray-400 italic text-sm">No items</span>
        );
      }

      if (isPrimitiveArray) {
        return (
          <div className="space-y-2 w-full">
            <button
              onClick={() => toggleRow(path)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-pink-50 to-purple-50 
                         border border-pink-200 rounded-lg text-sm font-medium text-pink-700 
                         hover:from-pink-100 hover:to-purple-100 transition-all"
            >
              {isExpanded ? (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Hide {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4" />
                  View {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </>
              )}
            </button>
            {isExpanded && (
              <div className="ml-4 pl-4 border-l-2 border-pink-200 space-y-1.5 mt-2">
                {value.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-pink-400 font-semibold text-xs mt-0.5 min-w-[20px]">
                      {idx + 1}.
                    </span>
                    <span className="break-words">{String(item)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      // Array of objects - render nested table
      return (
        <div className="space-y-2 w-full">
          <button
            onClick={() => toggleRow(path)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-pink-50 to-purple-50 
                       border border-pink-200 rounded-lg text-sm font-medium text-pink-700 
                       hover:from-pink-100 hover:to-purple-100 transition-all"
          >
            {isExpanded ? (
              <>
                <ChevronDown className="w-4 h-4" />
                Hide {itemCount} {itemCount === 1 ? 'entry' : 'entries'}
              </>
            ) : (
              <>
                <ChevronRight className="w-4 h-4" />
                View {itemCount} {itemCount === 1 ? 'entry' : 'entries'}
              </>
            )}
          </button>
          {isExpanded && (
            <div className="ml-2 space-y-4 mt-3">
              {value.map((item, idx) => (
                <div key={idx} className="border-l-4 border-pink-300 pl-4">
                  <div className="text-sm font-bold text-pink-600 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    {/* Entry {idx + 1} */}
                  </div>
                  {renderNestedTable(item, `${path}.${idx}`, level + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Object
    if (typeof value === "object") {
      const keys = Object.keys(value);
      if (keys.length === 0) {
        return (
          <span className="text-gray-400 italic text-sm">No properties</span>
        );
      }

      return (
        <div className="space-y-2 w-full">
          <button
            onClick={() => toggleRow(path)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 
                       border border-orange-200 rounded-lg text-sm font-medium text-orange-700 
                       hover:from-orange-100 hover:to-amber-100 transition-all"
          >
            {isExpanded ? (
              <>
                <ChevronDown className="w-4 h-4" />
                Hide {keys.length} {keys.length === 1 ? 'property' : 'properties'}
              </>
            ) : (
              <>
                <ChevronRight className="w-4 h-4" />
                View {keys.length} {keys.length === 1 ? 'property' : 'properties'}
              </>
            )}
          </button>
          {isExpanded && (
            <div className="ml-2 mt-3 border-l-4 border-orange-300 pl-4">
              {renderNestedTable(value, path, level + 1)}
            </div>
          )}
        </div>
      );
    }

    return <span className="text-sm text-gray-500">Unknown type</span>;
  };

  // Render nested table
  const renderNestedTable = (data, pathPrefix = "", level = 0) => {
    const entries = Object.entries(data);
    
    // Filter top-level existing sections
    const filteredEntries = entries.filter(([key]) => {
      const isTopLevel = level === 0;
      const shouldSkip = isTopLevel && existingSections.includes(key);
      return !shouldSkip;
    });

    if (filteredEntries.length === 0) return null;

    return (
      <>
        {/* Desktop Table View - Hidden on mobile */}
        <div className="hidden md:block overflow-x-auto rounded-lg border main-site-border-color-3 shadow-sm">
          <table className="w-full border-collapse">
            <thead className="light-site-color-3 sticky top-0">
              <tr>
                <th className="border-b-2 main-site-border-color-3 px-3 sm:px-4 py-2.5 text-left font-semibold main-site-text-color text-xs sm:text-sm uppercase tracking-wide w-2/5">
                  <div className="flex items-center gap-2">
                    {/* <Table className="w-4 h-4" /> */}
                    Field
                  </div>
                </th>
                <th className="border-b-2 main-site-border-color-3 px-3 sm:px-4 py-2.5 text-left font-semibold main-site-text-color text-xs sm:text-sm uppercase tracking-wide">
                  <div className="flex items-center gap-2">
                    {/* <List className="w-4 h-4" /> */}
                    Value
                  </div>
                </th>
                <th className="border-b-2 main-site-border-color-3 px-2 py-2.5 w-12">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(([key, value], index) => {
                const currentPath = pathPrefix ? `${pathPrefix}.${key}` : key;
                const isEvenRow = index % 2 === 0;
                
                return (
                  <tr 
                    key={currentPath}
                    className={`transition-colors hover:bg-blue-50 ${
                      isEvenRow ? 'bg-white' : 'light-site-color-3 bg-opacity-30'
                    }`}
                  >
                    <td className="border-b main-site-border-color-3 px-3 sm:px-4 py-3 align-top">
                      <div className="font-medium main-site-text-color text-sm sm:text-base">
                        {formatKey(key)}
                      </div>
                    </td>
                    <td className="border-b main-site-border-color-3 px-3 sm:px-4 py-3 align-top">
                      <div className="utility-secondary-color">
                        {renderValue(value, currentPath, level)}
                      </div>
                    </td>
                    <td className="border-b main-site-border-color-3 px-2 py-3 align-top">
                      <button
                        onClick={() => copyToClipboard(value, currentPath)}
                        className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                        title="Copy value"
                      >
                        {copiedPath === currentPath ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Hidden on desktop */}
        <div className="md:hidden space-y-3">
          {filteredEntries.map(([key, value], index) => {
            const currentPath = pathPrefix ? `${pathPrefix}.${key}` : key;
            
            return (
              <div 
                key={currentPath}
                className="border main-site-border-color-3 rounded-lg shadow-sm overflow-hidden bg-white"
              >
                <div className="light-site-color-3 px-3 py-2.5 flex items-center justify-between border-b main-site-border-color-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Table className="w-4 h-4 flex-shrink-0 main-site-text-color" />
                    <h4 className="font-semibold main-site-text-color text-sm truncate">
                      {formatKey(key)}
                    </h4>
                  </div>
                  <button
                    onClick={() => copyToClipboard(value, currentPath)}
                    className="p-1.5 rounded hover:bg-gray-200 transition-colors flex-shrink-0 ml-2"
                    title="Copy value"
                  >
                    {copiedPath === currentPath ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
                <div className="px-3 py-3 utility-secondary-color">
                  {renderValue(value, currentPath, level)}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  if (!hasNonExistingSection(data)) return null;

  return (
    <div className="flex flex-col w-full lg:col-span-2 shadow-lg p-4 sm:p-5 md:p-6 rounded-2xl mb-5 bg-white">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex flex-wrap items-center gap-3 cursor-pointer select-none
                   p-3 rounded-xl transition-all duration-300"
      >
        <span
          className="absolute inset-0 rounded-xl light-site-color-3 scale-x-0 origin-left
                     group-hover:scale-x-100 transition-transform duration-300 ease-out"
        />

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

        <span
          className="relative z-10 text-lg sm:text-xl md:text-2xl font-semibold utility-site-color 
                         group-hover:main-site-text-color transition-colors duration-300 leading-snug"
        >
          Additional Details for {name}
        </span>
      </div>

      {/* Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="mt-4 sm:mt-5 md:mt-6 w-full">
              {renderNestedTable(data)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdditionalDetailsSection;