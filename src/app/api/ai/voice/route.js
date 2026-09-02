import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const formData = await request.formData();

    const audioFile = formData.get("audio");

    if (!audioFile) {
      return Response.json(
        {
          success: false,
          message: "Audio file is required",
        },
        { status: 400 },
      );
    }

    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3-turbo",
    });

    const transcript = transcription.text;

    console.log("TRANSCRIPT:", transcript);

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: `
You extract borrower and loan information
from Hindi, Hinglish, or English speech.

Extract ONLY information explicitly mentioned.

Never invent missing information.

Return borrower and loan information.

If information is missing, return null.

Phone numbers must be strings.
Amount and interest rate must be numbers.
Dates should use YYYY-MM-DD format.
            `,
        },
        {
          role: "user",
          content: transcript,
        },
      ],

      response_format: {
        type: "json_schema",

        json_schema: {
          name: "borrower_loan",

          strict: true,

          schema: {
            type: "object",

            properties: {
              borrower: {
                type: "object",

                properties: {
                  name: {
                    type: ["string", "null"],
                  },

                  phone: {
                    type: ["string", "null"],
                  },

                  email: {
                    type: ["string", "null"],
                  },
                },

                required: ["name", "phone", "email"],

                additionalProperties: false,
              },

              loan: {
                type: "object",

                properties: {
                  amount: {
                    type: ["number", "null"],
                  },

                  interestRate: {
                    type: ["number", "null"],
                  },

                  interestType: {
                    type: ["string", "null"],
                  },

                  lentDate: {
                    type: ["string", "null"],
                  },

                  dueDate: {
                    type: ["string", "null"],
                  },

                  notes: {
                    type: ["string", "null"],
                  },
                },

                required: [
                  "amount",
                  "interestRate",
                  "interestType",
                  "lentDate",
                  "dueDate",
                  "notes",
                ],

                additionalProperties: false,
              },
            },

            required: ["borrower", "loan"],

            additionalProperties: false,
          },
        },
      },
    });

    // 4. Convert AI response to JS object
    const extractedData = JSON.parse(completion.choices[0].message.content);

    console.log("EXTRACTED DATA:", extractedData);

    return Response.json({
      success: true,
      transcript,
      data: extractedData,
    });
  } catch (error) {
    console.error("VOICE AI ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to process voice input",
      },
      { status: 500 },
    );
  }
}
