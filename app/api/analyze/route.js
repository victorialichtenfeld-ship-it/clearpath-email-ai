import { getServerSession } from "next-auth";
import { google } from "googleapis";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  const session = await getServerSession();
  if (!session?.accessToken) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });
  const gmail = google.gmail({ version: "v1", auth });

  // Fetch last 30 emails
  const listRes = await gmail.users.messages.list({
    userId: "me",
    maxResults: 30,
    q: "in:inbox",
  });

  const messages = listRes.data.messages || [];
  const emailData = [];

  for (const msg of messages.slice(0, 20)) {
    const full = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
      format: "metadata",
      metadataHeaders: ["Subject", "From", "Date"],
    });

    const headers = full.data.payload.headers;
    const subject = headers.find((h) => h.name === "Subject")?.value || "(no subject)";
    const from = headers.find((h) => h.name === "From")?.value || "";
    const date = headers.find((h) => h.name === "Date")?.value || "";
    const snippet = full.data.snippet || "";

    emailData.push({ subject, from, date, snippet });
  }

  const emailList = emailData
    .map((e, i) => `Email ${i + 1}:\nFrom: ${e.from}\nDate: ${e.date}\nSubject: ${e.subject}\nPreview: ${e.snippet}`)
    .join("\n\n---\n\n");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: `You are an AI assistant specialized for real estate agents. You analyze their emails to help them close more deals and never miss a hot lead.

    When analyzing emails, focus on:
    - Hot leads (people ready to buy or sell NOW)
    - Follow-ups that are overdue (leads that went cold that need re-engagement)
    - Urgent client requests
    - New listing inquiries
    - Offers and negotiations

    Be specific, actionable, and direct. Real estate agents are busy — give them exactly what they need to act on right now.`,
    messages: [
      {
        role: "user",
        content: `Analyze these emails from my inbox and give me:

1. 🔥 HOT LEADS (ready to act now) — list name, what they want, and what to do
2. ⚠️ URGENT — needs response today
3. 📋 FOLLOW UP — leads that went quiet and need a nudge
4. ✉️ DRAFT REPLY — write me a reply for the single most important email

Here are my emails:

${emailList}`,
      },
    ],
  });

  return Response.json({
    analysis: response.content[0].text,
    emailCount: emailData.length,
  });
}
