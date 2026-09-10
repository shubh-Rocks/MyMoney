import { sendEmail } from "@/services/email.service";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required",
        },
        { status: 400 },
      );
    }

    const subject = `New Support Request from ${name}`;
    const text = `Name :${name}\nEmail:${email}\nMessage:${message}`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; max-width: 600px; margin: auto;">
        <h2 style="color: #4f46e5; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">New Contact Message</h2>
        <p style="font-size: 16px; color: #374151;"><strong>Name:</strong> ${name}</p>
        <p style="font-size: 16px; color: #374151;"><strong>Email ID:</strong> <a href="mailto:${email}" style="color: #4f46e5;">${email}</a></p>
        <p style="font-size: 16px; color: #374151; margin-top: 20px;"><strong>Message / Problem:</strong></p>
        <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #4f46e5; color: #1f2937; font-size: 15px; line-height: 1.5;">
          ${message.replace(/\n/g, "<br>")}
        </div>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 30px; text-align: center;">This message was sent from your application contact form.</p>
      </div>
    `;

    await sendEmail(process.env.GOOGLE_USER, subject, text, html);

    return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email.please try again later.",
      },
      { status: 500 },
    );
  }
}
