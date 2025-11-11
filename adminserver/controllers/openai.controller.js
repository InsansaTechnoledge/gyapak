import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const convertData = async (req, res) => {
  try {
    const { text, minLengthVariable, keywords = [] } = req.body;

    if (!text || text.trim().length < minLengthVariable) {
      return res.status(400).json({ error: "Please provide valid text, min length not matched" });
    }

    let prompt = `
    You are an assistant specialized in summarizing Indian government job openings 
    and exam forms. Extract only the meaningful details like job title, 
    important dates, eligibility, and official links.

    Example Output Format:
    - Job Title:
    - Important Dates:
    - Eligibility:
    - Application Link:
    - Additional Notes:
    `;

    if (keywords.length > 0) {
      prompt += `
      Also, optimize the summarized content for SEO using the following keywords:
      ${keywords.join(", ")}.

      Ensure keywords are naturally integrated into the text without breaking readability.
      `;
    }

    prompt += `
    Now summarize the following text:
    """${text}"""
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant for summarizing job details." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 400,
    });

    const summary = completion.choices[0].message.content;
    res.json({ summary });
  } catch (error) {
    console.error("Error in summarization:", error);
    res.status(500).json({ error: "Failed to summarize text" });
  }
};
