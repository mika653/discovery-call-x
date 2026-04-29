type AnyRecord = Record<string, unknown>;

interface NotifySubmission {
  id?: string;
  businessName?: string;
  createdAt?: string;
  answers?: AnyRecord;
  summary?: {
    businessOverview?: string;
    websiteGoals?: string[];
    recommendedPages?: string[];
    suggestedFeatures?: string[];
  };
}

const DASHBOARD_URL = "https://dcx.heymika.me/admin";
const FROM = "DCX Leads <onboarding@resend.dev>";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function asString(value: unknown): string {
  if (value == null) return "";
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string").join(", ");
  return String(value);
}

function buildHtml(submission: NotifySubmission): string {
  const business = escapeHtml(submission.businessName || "Unnamed Business");
  const answers = (submission.answers || {}) as AnyRecord;
  const contactEmail = escapeHtml(asString(answers.contact_email) || "—");
  const contactPhone = escapeHtml(asString(answers.contact_phone) || "");
  const location = escapeHtml(asString(answers.business_location) || "");
  const overview = escapeHtml(submission.summary?.businessOverview || "");
  const goals = (submission.summary?.websiteGoals || []).slice(0, 4);
  const submittedAt = submission.createdAt
    ? new Date(submission.createdAt).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Just now";

  const goalChips = goals
    .map(
      (g) =>
        `<span style="display:inline-block;background:#f1f5f9;color:#0f172a;font-size:12px;padding:4px 10px;border-radius:999px;margin:2px 4px 2px 0;">${escapeHtml(
          g
        )}</span>`
    )
    .join("");

  const rows: Array<[string, string]> = [["Email", contactEmail]];
  if (contactPhone) rows.push(["Phone", contactPhone]);
  if (location) rows.push(["Location", location]);
  rows.push(["Submitted", escapeHtml(submittedAt)]);
  const detailRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 0;color:#64748b;font-size:13px;width:90px;">${label}</td>
          <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:500;">${value}</td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>New lead: ${business}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;width:32px;height:32px;line-height:32px;border-radius:8px;background:#7c3aed;color:#fff;font-weight:700;font-size:14px;">X</span>
      <span style="margin-left:8px;font-weight:600;color:#0f172a;font-size:14px;">DiscoveryCall X</span>
    </div>

    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
      <div style="padding:24px 28px 8px;">
        <p style="margin:0;color:#7c3aed;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">New lead</p>
        <h1 style="margin:6px 0 4px;color:#0f172a;font-size:22px;font-weight:700;line-height:1.2;">${business}</h1>
      </div>

      ${overview ? `<div style="padding:0 28px 16px;color:#475569;font-size:14px;line-height:1.55;">${overview}</div>` : ""}

      <div style="padding:0 28px 8px;">
        <table style="width:100%;border-collapse:collapse;">
          ${detailRows}
        </table>
      </div>

      ${goalChips ? `<div style="padding:8px 28px 24px;">${goalChips}</div>` : `<div style="height:16px;"></div>`}

      <div style="padding:0 28px 28px;">
        <a href="${DASHBOARD_URL}" style="display:block;background:#0f172a;color:#ffffff;text-align:center;text-decoration:none;font-size:14px;font-weight:600;padding:13px 16px;border-radius:10px;">View in dashboard →</a>
      </div>
    </div>

    <p style="text-align:center;color:#94a3b8;font-size:12px;margin:20px 0 0;">
      Sent automatically when someone completes the discovery form.
    </p>
  </div>
</body>
</html>`;
}

export async function sendNewLeadNotification(submission: NotifySubmission): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL;
  if (!apiKey || !to) return;

  const business = submission.businessName || "Unnamed Business";
  const html = buildHtml(submission);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to,
      subject: `New lead: ${business}`,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }
}
