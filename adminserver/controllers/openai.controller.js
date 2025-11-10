// controllers/openai.controller.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const convertData = async (req, res) => {
  try {
    const { text, minLengthVariable = 10, keywords = [] } = req.body;

    if (!text || text.trim().length < Number(minLengthVariable)) {
      return res
        .status(400)
        .json({ error: "Please provide valid text, min length not matched" });
    }

    // ---- system and user content (NOTE: type MUST be 'input_text')
    const systemContent = [
      {
        type: "input_text",
        text:
          "You are an information extractor for Indian govt notices. " +
          "Return structured JSON only (no prose). Identify and split multiple entities if present. " +
          "Types you may emit: 'job', 'exam', 'result', 'admit_card', or 'other'. " +
          "Be faithful to the source; do not invent links or dates. " +
          "If a field is not present in the source, you MAY omit it.",
      },
    ];

    const seoHint =
      keywords?.length
        ? `Also, integrate these SEO keywords naturally if relevant: ${keywords.join(", ")}`
        : "";

    const userContent = [
      {
        type: "input_text",
        text:
          "Extract meaningful, publication-ready structured data from the following official text. " +
          "Preserve critical details like advertisements numbers, dates, fees, quotas, KRAs, CTC, etc. " +
          "Split into multiple items if multiple posts/exams exist. " +
          "Source text:\n\n" + text + "\n\n" + seoHint,
      },
    ];

    // ---- JSON Schema for structured outputs
    const schema = {
      type: "object",
      additionalProperties: false,
      properties: {
        source_summary: { type: "string" },
        seo_keywords_used: {
          type: "array",
          items: { type: "string" },
        },
        items: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              type: { type: "string", enum: ["job", "exam", "result", "admit_card", "other"] },
              title: { type: "string" },
              organization: { type: "string" },
              advertisement_no: { type: "string" },
              description: { type: "string" },

              important_dates: {
                type: "object",
                additionalProperties: false,
                properties: {
                  apply_start:         { type: "string" },
                  apply_end:           { type: "string" },
                  fee_last_date:       { type: "string" },
                  exam_date:           { type: "string" },
                  admit_card_release:  { type: "string" },
                  result_date:         { type: "string" },
                  other:               { type: "string" },
                  // optional catch-all key-value pairs
                  misc: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: false,
                      properties: {
                        label: { type: "string" },
                        value: { type: "string" }
                      },
                      required: ["label","value"]
                    }
                  }
                }
                // NOTE: no `required` here; with strict:false this is fine
              },

              official_links: {
                type: "array",
                items: { type: "string" },
              },

              // Job-only
              job: {
                type: "object",
                additionalProperties: false,
                properties: {
                  engagement_type: { type: "string" },
                  total_vacancies: { type: "integer" },
                  posting_locations: { type: "string" },
                  age_criteria: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      min: { type: "integer" },
                      max: { type: "integer" },
                      as_on: { type: "string" },
                      relaxations: { type: "string" },
                    },
                  },
                  vacancy_breakup: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: false,
                      properties: {
                        unit: { type: "string" },
                        post_name: { type: "string" },
                        vacancies: { type: "integer" },
                      },
                      required: ["unit", "post_name", "vacancies"],
                    },
                  },
                  education: { type: "string" },
                  experience: { type: "string" },
                  skills: { type: "string" },
                  selection_process: { type: "string" },
                  application_fee: { type: "string" },
                  reservations: { type: "string" },
                  pwd_info: { type: "string" },
                  documents_required: { type: "string" },
                  how_to_apply: { type: "string" },
                  job_profile: { type: "string" },
                  kras: { type: "string" },
                  pay_ctc: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      ctc_upper_range_lpa: { type: "number" },
                      variable_pay: { type: "string" },
                      contract_period: { type: "string" },
                      bifurcation: { type: "string" },
                    },
                  },
                },
              },

              // Exam-only
              exam: {
                type: "object",
                additionalProperties: false,
                properties: {
                  conducting_body: { type: "string" },
                  eligibility: { type: "string" },
                  syllabus: { type: "string" },
                  pattern: { type: "string" },
                  application_process: { type: "string" },
                  fee: { type: "string" },
                  centers: { type: "string" },
                },
              },

              // Result-only
              result: {
                type: "object",
                additionalProperties: false,
                properties: {
                  exam_name: { type: "string" },
                  result_link: { type: "string" },
                  cutoff_info: { type: "string" },
                  next_steps: { type: "string" },
                },
              },

              // Admit card-only
              admit_card: {
                type: "object",
                additionalProperties: false,
                properties: {
                  exam_name: { type: "string" },
                  download_start: { type: "string" },
                  download_end: { type: "string" },
                  instructions: { type: "string" },
                },
              },

              notes: { type: "string" },
            },
            required: ["type", "title"],
          },
        },
      },
      required: ["items"],
    };

    // ---- Responses API call
    const response = await client.responses.create({
      model: "gpt-4o",
      input: [
        { role: "system", content: systemContent },
        { role: "user", content: userContent },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "gov_notice_struct",
          schema,
          strict: false, // ← RELAXED: avoids strict 'required' enforcement on nested objects
        },
      },
      temperature: 0.2,
      // max_output_tokens: 4000,
    });

    const raw = response.output_text; // strict JSON string
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { source_summary: "", seo_keywords_used: [], items: [] };
    }

    // Mark which keywords appear in the JSON text
    if (keywords?.length) {
      const lc = raw.toLowerCase();
      parsed.seo_keywords_used = keywords.filter((k) =>
        lc.includes(String(k).toLowerCase())
      );
    }
    if (!parsed.source_summary) {
      parsed.source_summary = "Structured extraction completed from the provided notice.";
    }

    return res.json(parsed);
  } catch (error) {
    console.error("Error in extraction:", error);
    return res.status(500).json({
      error: "Failed to extract data",
      detail: error?.message,
    });
  }
};
