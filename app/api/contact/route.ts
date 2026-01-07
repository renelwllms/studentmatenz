import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await prisma.contactSubmission.create({ data: parsed.data });
  const smtpHost = process.env.MAILGUN_SMTP_HOST;
  const smtpPort = Number(process.env.MAILGUN_SMTP_PORT ?? "587");
  const smtpUser = process.env.MAILGUN_SMTP_USER;
  const smtpPass = process.env.MAILGUN_SMTP_PASS;
  const mailFrom = process.env.MAILGUN_SMTP_FROM;
  const mailTo = process.env.MAILGUN_SMTP_TO;

  if (!smtpHost || !smtpUser || !smtpPass || !mailFrom || !mailTo) {
    return NextResponse.json({ error: "Email not configured" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const { name, email, phone, message } = parsed.data;
  const text = [
    "New contact form submission",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "-"}`,
    "Message:",
    message,
  ].join("\n");

  try {
    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      subject: `New contact form: ${name}`,
      text,
      replyTo: email,
    });
  } catch (error) {
    console.error("Failed to send contact email", error);
    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
