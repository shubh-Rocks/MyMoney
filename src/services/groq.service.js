import Groq from "groq-sdk";

class GroqService {
  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async forecastCashFlow(forecastData, days = 30) {
    const prompt = `
You are a financial cash-flow forecasting assistant.

Analyze the provided historical collection data and upcoming loan dues.

Forecast the expected daily loan collections for the next ${days} days.

Important:
- Use historical collection patterns.
- Consider upcoming due amounts.
- Consider realistic repayment behavior.
- Do not assume that 100% of upcoming dues will be collected.
- Predictions should be realistic.
- Confidence range should widen as the forecast date gets further away.
- Return numbers only, without currency symbols.
- Return exactly ${days} forecast entries.

Historical data:
${JSON.stringify(forecastData.historical)}

Upcoming dues:
${JSON.stringify(forecastData.upcoming)}
`;

    const completion = await this.client.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: "You are a financial forecasting assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      response_format: {
        type: "json_schema",
        json_schema: {
          name: "cash_flow_forecast",
          strict: true,
          schema: {
            type: "object",
            properties: {
              forecast: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    date: {
                      type: "string",
                    },
                    predictedCollection: {
                      type: "number",
                    },
                    lowerBound: {
                      type: "number",
                    },
                    upperBound: {
                      type: "number",
                    },
                  },
                  required: [
                    "date",
                    "predictedCollection",
                    "lowerBound",
                    "upperBound",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["forecast"],
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(completion.choices[0].message.content);
  }
}

export const groqService = new GroqService();
