// src/app/api/contact/route.ts
import { mailOptions, transporter } from "@/nodemailer/nodemailer";
import { NextResponse, NextRequest } from "next/server";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactSuccess {
  message: string;
  success: true;
}

interface ContactError {
  error: string;
}

type ContactResponse = ContactSuccess | ContactError;

interface EmailError extends Error {
  code?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ContactResponse>> {
  try {
    // Parse request body
    const { name, email, subject, message }: ContactFormData =
      await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json<ContactError>(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<ContactError>(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (name.length < 2) {
      return NextResponse.json<ContactError>(
        { error: "Name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    if (subject.length < 5) {
      return NextResponse.json<ContactError>(
        { error: "Subject must be at least 5 characters long" },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json<ContactError>(
        { error: "Message must be at least 10 characters long" },
        { status: 400 }
      );
    }

    // Create professional email template
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8fafc;
            }
            .container {
              background-color: #ffffff;
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #4f46e5 0%, #10b981 100%);
              color: white;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 25px;
              text-align: center;
            }
            .field {
              margin-bottom: 20px;
            }
            .field-label {
              font-weight: 600;
              color: #4f46e5;
              margin-bottom: 5px;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .field-value {
              background-color: #f8fafc;
              padding: 12px;
              border-radius: 6px;
              border-left: 4px solid #4f46e5;
              font-size: 16px;
            }
            .message-content {
              background-color: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
              white-space: pre-wrap;
              font-size: 16px;
              line-height: 1.7;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
              color: #64748b;
              font-size: 14px;
            }
            .timestamp {
              background-color: #f1f5f9;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 12px;
              color: #64748b;
              text-align: center;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Portfolio Website Contact</p>
            </div>
            
            <div class="field">
              <div class="field-label">Name</div>
              <div class="field-value">${name}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Email</div>
              <div class="field-value">${email}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Subject</div>
              <div class="field-value">${subject}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Message</div>
              <div class="message-content">${message}</div>
            </div>
            
            <div class="timestamp">
              Submitted on ${new Date().toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              })}
            </div>
            
            <div class="footer">
              <p>This message was sent from your portfolio contact form.</p>
              <p>You can reply directly to this email to respond to ${name}.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      ...mailOptions,
      subject: `Portfolio Contact: ${subject}`,
      html: emailTemplate,
      replyTo: email, // Allow direct reply to sender
    });

    // Log the contact for debugging (optional)
    console.log("Contact form submission:", {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
    });

    // Return success response
    return NextResponse.json<ContactSuccess>(
      {
        message: "Message sent successfully! I'll get back to you soon.",
        success: true,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Contact form error:", error);

    const emailError = error as EmailError;

    // Handle specific email errors
    if (emailError.code === "EAUTH") {
      return NextResponse.json<ContactError>(
        { error: "Email service configuration error. Please try again later." },
        { status: 500 }
      );
    }

    if (emailError.code === "ECONNECTION") {
      return NextResponse.json<ContactError>(
        {
          error: "Unable to send email at the moment. Please try again later.",
        },
        { status: 500 }
      );
    }

    // Generic error response
    return NextResponse.json<ContactError>(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

export async function OPTIONS(_request: NextRequest): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
