import { apiClient } from "@/lib/api.Client";
import Groq from "groq-sdk";
import { cookies } from "next/headers";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;

    if (!token) {
      return Response.json(
        {
          success: false,
          message: "unauthorized:Token missing",
        },
        { status: 401 },
      );
    }

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
You extract borrower, loan, and address information from speech.
Extract ONLY information explicitly mentioned.
Never invent missing information.

Strict Formatting Rules:
- name: String (min 3 chars).
- email: Valid email string (use "@" instead of spoken words like "at the rate").
- phone: Exactly 10 digits string.
- lentDate & dueDate: YYYY-MM-DD format strings.
- amount: Number (between 1000 and 1000000).
- interestRate: Number (greater than 0 and max 100).
- interestType: MUST BE EXACTLY uppercase string either "SIMPLE" or "COMPOUND".
- street, city, state: Strings.
- pincode: Exactly 6 digits string (e.g., "482001").`,
        },
        { role: "user", content: transcript },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "borrower_loan_schema",
          strict: true,
          schema: {
            type: "object",
            properties: {
              name: { type: ["string", "null"] },
              email: { type: ["string", "null"] },
              phone: { type: ["string", "null"] },
              lentDate: { type: ["string", "null"] },
              dueDate: { type: ["string", "null"] },
              amount: { type: ["number", "null"] },
              interestRate: { type: ["number", "null"] },
              interestType: {
                type: ["string", "null"],
                enum: ["SIMPLE", "COMPOUND", null],
              },
              street: { type: ["string", "null"] },
              city: { type: ["string", "null"] },
              state: { type: ["string", "null"] },
              pincode: { type: ["string", "null"] },
              notes: { type: ["string", "null"] },
            },
            required: [
              "name",
              "email",
              "phone",
              "lentDate",
              "dueDate",
              "amount",
              "interestRate",
              "interestType",
              "street",
              "city",
              "state",
              "pincode",
              "notes",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    // 4. Convert AI response to JS object
    const extractedData = JSON.parse(completion.choices[0].message.content);

    console.log("EXTRACTED DATA:", extractedData);

    const response = await apiClient.addBorrower(extractedData, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    return Response.json({
      success: true,
      transcript,
      data: extractedData,
      borrowerResult: response.borrower || response,
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
