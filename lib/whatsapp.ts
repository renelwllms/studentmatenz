export type WhatsAppPayload = {
  to: string;
  body: string;
};

export type WhatsAppResponse = {
  providerMessageId: string;
  status: "SENT" | "FAILED";
};

export async function sendWhatsAppMessage(payload: WhatsAppPayload): Promise<WhatsAppResponse> {
  const provider = process.env.WHATSAPP_PROVIDER || "mock";
  if (provider === "mock") {
    return {
      providerMessageId: `mock-${Date.now()}`,
      status: "SENT",
    };
  }

  throw new Error(`Provider ${provider} not configured`);
}
