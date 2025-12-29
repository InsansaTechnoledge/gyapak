// src/components/BriefEditableSection.jsx
import React, { useEffect, useRef } from "react";

const ToolbarButton = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="px-2 py-1 text-xs sm:text-[11px] rounded-md border border-gray-200 bg-white hover:bg-gray-100 active:scale-[0.98] transition"
  >
    {label}
  </button>
);

const BriefEditableSection = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const lastHtmlRef = useRef("");

  // Keep internal editor in sync when value changes from outside
  useEffect(() => {
    if (!editorRef.current) return;
    if ((value || "") !== lastHtmlRef.current) {
      editorRef.current.innerHTML = value || "";
      lastHtmlRef.current = value || "";
    }
  }, [value]);

  const emitChange = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    lastHtmlRef.current = html;
    onChange?.(html);
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const applyCommand = (command, arg = null) => {
    if (!editorRef.current) return;
    focusEditor();

    if (command === "formatBlock") {
      // arg: "p", "h1", "h2", etc
      document.execCommand("formatBlock", false, arg);
    } else if (command === "createLink") {
      const url = window.prompt("Enter link URL:");
      if (!url) return;
      document.execCommand("createLink", false, url);
    } else if (command === "insertTable") {
      // Simple 2x2 table insert
      const tableHtml = `
        <table border="1" style="border-collapse:collapse; width:100%; margin:8px 0;">
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
          </tr>
          <tr>
            <td>Row 1, Col 1</td>
            <td>Row 1, Col 2</td>
          </tr>
        </table>
      `;
      document.execCommand("insertHTML", false, tableHtml);
    } else if (command === "clear") {
      document.execCommand("removeFormat", false, null);
      document.execCommand("unlink", false, null);
    } else {
      document.execCommand(command, false, arg);
    }

    emitChange();
  };

  const handleInput = () => {
    emitChange();
  };

  return (
    <div className="mt-10">
      <h2 className="text-purple-700 text-2xl sm:text-3xl mb-4 text-center font-bold">
        Brief Details
      </h2>

      {/* Helper text */}
      <p className="text-xs sm:text-sm text-gray-500 mb-2">
        Write a short summary about this opportunity (min 100 characters). You can use{" "}
        <span className="font-semibold">headings, bold text, bullet points, links, tables</span>{" "}
        etc. Whatever you format here will appear the same on the main site.
      </p>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2 bg-gray-50 border border-gray-200 rounded-md px-2 py-2">
        <ToolbarButton label="B" onClick={() => applyCommand("bold")} />
        <ToolbarButton label="I" onClick={() => applyCommand("italic")} />
        <ToolbarButton label="U" onClick={() => applyCommand("underline")} />

        <ToolbarButton label="H1" onClick={() => applyCommand("formatBlock", "h1")} />
        <ToolbarButton label="H2" onClick={() => applyCommand("formatBlock", "h2")} />
        <ToolbarButton label="Paragraph" onClick={() => applyCommand("formatBlock", "p")} />

        <ToolbarButton label="• List" onClick={() => applyCommand("insertUnorderedList")} />
        <ToolbarButton label="1. List" onClick={() => applyCommand("insertOrderedList")} />

        <ToolbarButton label="Link" onClick={() => applyCommand("createLink")} />
        <ToolbarButton label="Table" onClick={() => applyCommand("insertTable")} />

        <ToolbarButton label="Clear" onClick={() => applyCommand("clear")} />
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="w-full min-h-[160px] border border-purple-300 rounded-md p-4 text-gray-800 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 prose max-w-none"
        style={{ whiteSpace: "pre-wrap" }}
        suppressContentEditableWarning
      />
    </div>
  );
};

export default BriefEditableSection;
