import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { getSiteUrl } from "@/lib/site";

export async function POST(request: Request) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { studentId, templateKey } = body;
  if (!studentId || !templateKey) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: { user: true, package: true },
  });
  const template = await prisma.messageTemplate.findUnique({ where: { key: templateKey } });

  if (!student || !template || !student.user.phone) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const siteUrl = getSiteUrl();
  const bodyRendered = template.body
    .replaceAll("{{studentName}}", student.fullName)
    .replaceAll("{{arrivalDate}}", student.arrivalDate.toDateString())
    .replaceAll("{{city}}", student.city)
    .replaceAll("{{institution}}", student.institution)
    .replaceAll("{{portalLink}}", `${siteUrl}/app/login`)
    .replaceAll("{{supportPhone}}", "+64 21 841 446");

  const response = await sendWhatsAppMessage({ to: student.user.phone, body: bodyRendered });

  await prisma.messageLog.create({
    data: {
      studentId: student.id,
      channel: "WHATSAPP",
      templateKey: template.key,
      bodyRendered,
      status: response.status === "SENT" ? "SENT" : "FAILED",
      providerMessageId: response.providerMessageId,
      sentByUserId: token.sub ?? null,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: token.sub ?? null,
      action: "SEND_MESSAGE",
      entityType: "MessageLog",
      entityId: student.id,
      metaJson: { templateKey },
    },
  });

  return NextResponse.json({ ok: true });
}
