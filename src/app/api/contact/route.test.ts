import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { sendMail } = vi.hoisted(() => ({
  sendMail: vi.fn().mockResolvedValue({}),
}));

vi.mock("@/nodemailer/nodemailer", () => ({
  transporter: { sendMail },
  mailOptions: { from: "test@example.com", to: "me@example.com" },
}));

import { POST } from "./route";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    sendMail.mockClear();
    sendMail.mockResolvedValue({});
  });

  it("returns 400 when fields are missing", async () => {
    const res = await POST(makeRequest({ name: "A" }));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: "All fields are required",
    });
  });

  it("returns 400 for invalid email", async () => {
    const res = await POST(
      makeRequest({
        name: "Alex",
        email: "bad",
        subject: "Hello there",
        message: "This is a longer message",
      })
    );
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: "Please provide a valid email address",
    });
  });

  it("returns 400 when name is too short", async () => {
    const res = await POST(
      makeRequest({
        name: "A",
        email: "a@b.com",
        subject: "Hello there",
        message: "This is a longer message",
      })
    );
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: "Name must be at least 2 characters long",
    });
  });

  it("returns 400 when message is too short", async () => {
    const res = await POST(
      makeRequest({
        name: "Alex",
        email: "a@b.com",
        subject: "Hello there",
        message: "short",
      })
    );
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: "Message must be at least 10 characters long",
    });
  });

  it("returns 201 and sends mail for valid payload", async () => {
    const res = await POST(
      makeRequest({
        name: "Alex",
        email: "a@b.com",
        subject: "Hello there",
        message: "This is a longer message",
      })
    );
    expect(res.status).toBe(201);
    await expect(res.json()).resolves.toMatchObject({ success: true });
    expect(sendMail).toHaveBeenCalledOnce();
  });

  it("returns 500 when mail transport fails", async () => {
    sendMail.mockRejectedValueOnce(new Error("smtp down"));
    const res = await POST(
      makeRequest({
        name: "Alex",
        email: "a@b.com",
        subject: "Hello there",
        message: "This is a longer message",
      })
    );
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      error: "Something went wrong. Please try again later.",
    });
  });
});
