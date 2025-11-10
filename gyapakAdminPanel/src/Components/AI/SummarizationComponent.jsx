// src/components/SummarizationComponent.jsx
import React, { useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";

function Chip({ children }) {
  return (
    <span className="inline-flex items-center text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
      {children}
    </span>
  );
}

function Section({ title, children }) {
  if (!children) return null;
  // if children is empty string or null, hide
  const isEmpty =
    (typeof children === "string" && children.trim() === "") ||
    (Array.isArray(children) && children.length === 0);
  if (isEmpty) return null;

  return (
    <div className="mt-4">
      <div className="font-semibold text-gray-800 mb-1">{title}</div>
      <div className="text-sm text-gray-700 whitespace-pre-wrap">{children}</div>
    </div>
  );
}

function DatesList({ dates }) {
  if (!dates) return null;
  const entries = Object.entries(dates).filter(
    ([, v]) => typeof v === "string" && v.trim() !== ""
  );
  if (!entries.length) return null;
  return (
    <div className="mt-3">
      <div className="font-semibold">Important Dates</div>
      <ul className="list-disc pl-5 text-sm mt-1">
        {entries.map(([k, v]) => (
          <li key={k}>
            <b className="capitalize">{k.replace(/_/g, " ")}:</b> {v}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LinksList({ links }) {
  if (!Array.isArray(links) || links.length === 0) return null;
  return (
    <div className="mt-3">
      <div className="font-semibold">Official Links</div>
      <ul className="list-disc pl-5 mt-1 text-blue-700 text-sm">
        {links.map((u, i) => (
          <li key={`${u}-${i}`}>
            <a className="underline break-all" href={u} target="_blank" rel="noreferrer">
              {u}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VacancyBreakup({ breakup }) {
  if (!Array.isArray(breakup) || breakup.length === 0) return null;
  return (
    <div className="mt-3">
      <div className="font-semibold">Vacancy Breakup</div>
      <div className="overflow-x-auto mt-1">
        <table className="min-w-[520px] w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left px-3 py-2 border-b">Unit / Zone / Circle</th>
              <th className="text-left px-3 py-2 border-b">Post</th>
              <th className="text-left px-3 py-2 border-b">Vacancies</th>
            </tr>
          </thead>
          <tbody>
            {breakup.map((r, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-50">
                <td className="px-3 py-2 border-b">{r.unit}</td>
                <td className="px-3 py-2 border-b">{r.post_name}</td>
                <td className="px-3 py-2 border-b">{r.vacancies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function JsonActions({ data }) {
  const json = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(json);
      alert("JSON copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  const downloadJson = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `extracted_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={copyJson}
        className="px-3 py-1 text-sm rounded-lg bg-gray-200 hover:bg-gray-300"
      >
        Copy JSON
      </button>
      <button
        onClick={downloadJson}
        className="px-3 py-1 text-sm rounded-lg bg-gray-800 text-white hover:bg-gray-900"
      >
        Download JSON
      </button>
    </div>
  );
}

const SummarizationComponent = () => {
  const [data, setData] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState(null); // { source_summary, items, seo_keywords_used }
  const minLengthVariable = 10; // keep small for easier testing

  const handleAddKeyword = () => {
    const k = keywordInput.trim();
    if (k && !keywords.includes(k)) {
      setKeywords((prev) => [...prev, k]);
    }
    setKeywordInput("");
  };
  const handleRemoveKeyword = (k) =>
    setKeywords((prev) => prev.filter((x) => x !== k));

  const handleExtract = async () => {
    if (data.trim().length < minLengthVariable) return;
    setLoading(true);
    setOut(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/convert`, {
        text: data,
        minLengthVariable,
        keywords,
      });
      setOut(res.data);
    } catch (e) {
      console.error(e);
      setOut({ error: "❌ Extraction failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 border-2 border-black/40 rounded-2xl shadow-xl bg-white">
      <p className="text-2xl text-center text-purple-800 font-bold">
        Govt Notice → Structured Output
      </p>
      <p className="text-center text-md text-gray-500 m-4">
        Paste full official text. The extractor returns multiple items (job/exam/result/admit card).
      </p>

      {/* Input */}
      <div className="max-w-5xl border mx-auto p-4 flex flex-col rounded-xl shadow-inner bg-gray-50">
        <label htmlFor="dataInput" className="font-medium text-gray-700">
          Paste the official notification text 👇
        </label>
        <textarea
          id="dataInput"
          className="mt-3 px-3 py-2 border-2 border-purple-500/80 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-700"
          rows={12}
          placeholder="e.g., SBI advertisement pages…"
          value={data}
          onChange={(e) => {
            setData(e.target.value);
            setOut(null);
          }}
        />
        {data.length < minLengthVariable && (
          <p className="text-gray-400 text-xs mt-2">
            {minLengthVariable - data.length} character
            {minLengthVariable - data.length !== 1 && "s"} remaining to enable extraction
          </p>
        )}

        {/* Keywords */}
        <label className="font-medium text-gray-700 mt-5 mb-2">
          SEO Keywords (Optional)
        </label>
        <div className="flex gap-3 items-center">
          <input
            className="flex-grow px-3 py-2 border-2 border-purple-500/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-700"
            type="text"
            placeholder="Add keyword (e.g., 'SBI SCO recruitment', 'bank jobs 2025')"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
          />
          <button
            onClick={handleAddKeyword}
            className="border-2 px-3 py-1 bg-green-600 text-gray-100 rounded-xl hover:bg-green-700 transition"
          >
            Add
          </button>
        </div>
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {keywords.map((k, i) => (
              <span
                key={i}
                className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {k}
                <button
                  onClick={() => handleRemoveKeyword(k)}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="justify-start flex items-center gap-4">
          <button
            className={`mt-6 border-2 px-5 py-2 rounded-full text-sm shadow-2xl transition-all duration-300 ${
              data.length < minLengthVariable || loading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-purple-900 hover:bg-purple-950 text-gray-100 hover:scale-105"
            }`}
            disabled={data.length < minLengthVariable || loading}
            onClick={handleExtract}
          >
            {loading ? "Extracting…" : "Extract"}
          </button>
        </div>
      </div>

      {/* Output */}
      {out?.error && (
        <div className="border-2 p-6 mt-10 border-red-300 rounded-2xl bg-red-50 max-w-5xl mx-auto text-red-700">
          {out.error}
        </div>
      )}

      {!out?.error && out && (
        <div className="mt-10 max-w-6xl mx-auto space-y-6">
          {/* Source summary + SEO chips */}
          {(out.source_summary || (out.seo_keywords_used || []).length > 0) && (
            <div className="p-4 border rounded-xl bg-gray-50 text-gray-700">
              {out.source_summary && (
                <>
                  <div className="font-semibold">Source Summary</div>
                  <p className="mt-1 text-sm">{out.source_summary}</p>
                </>
              )}
              {(out.seo_keywords_used || []).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {out.seo_keywords_used.map((k, i) => (
                    <Chip key={i}>{k}</Chip>
                  ))}
                </div>
              )}
              <JsonActions data={out} />
            </div>
          )}

          {/* Items */}
          {Array.isArray(out.items) && out.items.length > 0 ? (
            out.items.map((item, idx) => {
              const { type } = item || {};
              return (
                <div
                  key={idx}
                  className="border-2 p-6 rounded-2xl bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <h3 className="text-xl font-bold text-purple-800">{item.title}</h3>
                    <div className="flex items-center gap-2">
                      <Chip>{type || "other"}</Chip>
                      {item.organization && (
                        <span className="text-sm text-gray-500">
                          {item.organization}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Common top-line attributes */}
                  <div className="grid md:grid-cols-2 gap-4 mt-3 text-sm text-gray-700">
                    {item.advertisement_no && (
                      <p>
                        <b>Advt. No:</b> {item.advertisement_no}
                      </p>
                    )}
                    {item.description && (
                      <p className="md:col-span-2 whitespace-pre-wrap">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <DatesList dates={item.important_dates} />
                  <LinksList links={item.official_links} />

                  {/* Type-specific renderers */}
                  {type === "job" && item.job && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
                        {item.job.engagement_type && (
                          <p><b>Engagement:</b> {item.job.engagement_type}</p>
                        )}
                        {Number.isFinite(item.job.total_vacancies) && (
                          <p><b>Total Vacancies:</b> {item.job.total_vacancies}</p>
                        )}
                        {item.job.posting_locations && (
                          <p className="md:col-span-2">
                            <b>Locations:</b> {item.job.posting_locations}
                          </p>
                        )}
                      </div>

                      {/* Age */}
                      {item.job.age_criteria && (
                        <div className="mt-3 text-sm">
                          <b>Age:</b>{" "}
                          {item.job.age_criteria.min ?? ""}{item.job.age_criteria.min != null ? " - " : ""}
                          {item.job.age_criteria.max ?? ""}{" "}
                          {item.job.age_criteria.as_on
                            ? `(as on ${item.job.age_criteria.as_on})`
                            : ""}
                          {item.job.age_criteria.relaxations && (
                            <div className="mt-1 whitespace-pre-wrap">
                              {item.job.age_criteria.relaxations}
                            </div>
                          )}
                        </div>
                      )}

                      <VacancyBreakup breakup={item.job.vacancy_breakup} />

                      <Section title="Education">{item.job.education}</Section>
                      <Section title="Experience">{item.job.experience}</Section>
                      <Section title="Skills">{item.job.skills}</Section>
                      <Section title="Selection Process">{item.job.selection_process}</Section>
                      <Section title="Application Fee">{item.job.application_fee}</Section>
                      <Section title="Reservations">{item.job.reservations}</Section>
                      <Section title="PwBD Info">{item.job.pwd_info}</Section>
                      <Section title="Documents Required">{item.job.documents_required}</Section>
                      <Section title="How to Apply">{item.job.how_to_apply}</Section>
                      <Section title="Job Profile">{item.job.job_profile}</Section>
                      <Section title="KRAs">{item.job.kras}</Section>

                      {/* Pay/CTC */}
                      {item.job.pay_ctc && (
                        <div className="mt-3 text-sm">
                          <div className="font-semibold">CTC / Pay</div>
                          <div className="whitespace-pre-wrap mt-1">
                            {item.job.pay_ctc.ctc_upper_range_lpa
                              ? `Upper CTC: ₹${item.job.pay_ctc.ctc_upper_range_lpa} LPA\n`
                              : ""}
                            {item.job.pay_ctc.variable_pay
                              ? `Variable: ${item.job.pay_ctc.variable_pay}\n`
                              : ""}
                            {item.job.pay_ctc.contract_period
                              ? `Contract: ${item.job.pay_ctc.contract_period}\n`
                              : ""}
                            {item.job.pay_ctc.bifurcation
                              ? `Bifurcation: ${item.job.pay_ctc.bifurcation}`
                              : ""}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {type === "exam" && item.exam && (
                    <>
                      <Section title="Conducting Body">
                        {item.exam.conducting_body}
                      </Section>
                      <Section title="Eligibility">{item.exam.eligibility}</Section>
                      <Section title="Syllabus">{item.exam.syllabus}</Section>
                      <Section title="Pattern">{item.exam.pattern}</Section>
                      <Section title="Application Process">
                        {item.exam.application_process}
                      </Section>
                      <Section title="Fee">{item.exam.fee}</Section>
                      <Section title="Exam Centers">{item.exam.centers}</Section>
                    </>
                  )}

                  {type === "result" && item.result && (
                    <>
                      <Section title="Exam Name">{item.result.exam_name}</Section>
                      <Section title="Result Link">{item.result.result_link}</Section>
                      <Section title="Cutoff Information">{item.result.cutoff_info}</Section>
                      <Section title="Next Steps">{item.result.next_steps}</Section>
                    </>
                  )}

                  {type === "admit_card" && item.admit_card && (
                    <>
                      <Section title="Exam Name">{item.admit_card.exam_name}</Section>
                      <div className="grid md:grid-cols-2 gap-4 mt-3 text-sm">
                        {item.admit_card.download_start && (
                          <p><b>Download Start:</b> {item.admit_card.download_start}</p>
                        )}
                        {item.admit_card.download_end && (
                          <p><b>Download End:</b> {item.admit_card.download_end}</p>
                        )}
                      </div>
                      <Section title="Instructions">{item.admit_card.instructions}</Section>
                    </>
                  )}

                  <Section title="Notes">{item.notes}</Section>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500">No items found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SummarizationComponent;
