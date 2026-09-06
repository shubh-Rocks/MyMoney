import Groq from "groq-sdk";

class GroqService {
  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async forecastCashFlow(forecastData, days = 30) {
    const historical = forecastData?.historical?.dailyCollections || [];

    const upcomingLoans = forecastData?.upcoming?.loans || [];

    console.log("Historical length:", historical.length);
    console.log("Upcoming loans:", upcomingLoans.length);

    if (historical.length === 0) {
      throw new Error("Not enough historical collection data for forecasting");
    }

    const prompt = `
You are an AI cash-flow forecasting assistant.

Forecast daily loan collections for the next ${days} days.

Historical daily collections:

${JSON.stringify(historical)}

Upcoming loan dues:

${JSON.stringify(upcomingLoans)}

Rules:

1. Generate exactly ${days} forecast records.
2. Start from the day after the latest historical date.
3. Dates must be consecutive.
4. Date format must be YYYY-MM-DD.
5. predictedCollection must be >= 0.
6. lowerBound must be >= 0.
7. upperBound must be >= 0.
8. lowerBound <= predictedCollection.
9. predictedCollection <= upperBound.
10. Use historical collections as the primary signal.
11. Consider upcoming loan due dates.
12. Do not assume 100% repayment.
13. Increase uncertainty gradually for dates further in the future.

Return ONLY a valid JSON object.

Do not use markdown.
Do not use code fences.
Do not write any explanation.

The JSON must have exactly this structure:

{
  "forecast": [
    {
      "date": "YYYY-MM-DD",
      "predictedCollection": 5000,
      "lowerBound": 3000,
      "upperBound": 7000
    }
  ]
}
`;

    console.log("========== CALLING GROQ ==========");

    const completion = await this.client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_completion_tokens: 20000,
    });

    const content = completion?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Groq returned an empty forecast response");
    }

    let cleanedContent = content.trim();

    if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
    }

    let parsed;

    try {
      parsed = JSON.parse(cleanedContent);
    } catch (error) {
      console.error("RAW RESPONSE:");
      console.error(content);

      throw new Error("Groq returned invalid JSON");
    }

    if (!Array.isArray(parsed.forecast)) {
      throw new Error("Invalid forecast format returned by Groq");
    }

    if (parsed.forecast.length !== days) {
      throw new Error(
        `Expected ${days} forecast entries, received ${parsed.forecast.length}`,
      );
    }

    for (const item of parsed.forecast) {
      if (
        typeof item.date !== "string" ||
        typeof item.predictedCollection !== "number" ||
        typeof item.lowerBound !== "number" ||
        typeof item.upperBound !== "number"
      ) {
        throw new Error("Invalid forecast item returned by Groq");
      }

      if (
        !Number.isFinite(item.predictedCollection) ||
        !Number.isFinite(item.lowerBound) ||
        !Number.isFinite(item.upperBound)
      ) {
        throw new Error("Forecast values must be valid numbers");
      }

      if (
        item.predictedCollection < 0 ||
        item.lowerBound < 0 ||
        item.upperBound < 0
      ) {
        throw new Error("Forecast values cannot be negative");
      }

      if (item.lowerBound > item.predictedCollection) {
        throw new Error(
          "Forecast lower bound is greater than predicted collection",
        );
      }

      if (item.predictedCollection > item.upperBound) {
        throw new Error(
          "Forecast upper bound is lower than predicted collection",
        );
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
        throw new Error(`Invalid forecast date: ${item.date}`);
      }
    }

    return parsed;
  }
}

export const groqService = new GroqService();
