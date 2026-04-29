import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { isAdmin } from "@/lib/admin-auth";
import { sendNewLeadNotification } from "@/lib/notification-email";

export const runtime = "nodejs";

// POST — save a submission (open: clients submit through this)
export async function POST(req: NextRequest) {
  try {
    const submission = await req.json();
    if (!submission?.id) {
      return NextResponse.json(
        { success: false, error: "Missing submission id" },
        { status: 400 }
      );
    }
    await adminDb().collection("submissions").doc(submission.id).set(submission);

    // Email notification — never fail the submission if mail fails
    try {
      await sendNewLeadNotification(submission);
    } catch (mailErr) {
      console.error("Notification email failed:", mailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API: Failed to save submission:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// GET — fetch all submissions (admin only)
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const snap = await adminDb().collection("submissions").get();
    const submissions = snap.docs.map((d) => d.data());
    submissions.sort(
      (a, b) =>
        new Date(b.createdAt as string).getTime() -
        new Date(a.createdAt as string).getTime()
    );
    return NextResponse.json({ success: true, submissions });
  } catch (err) {
    console.error("API: Failed to fetch submissions:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// PATCH — update submission status (admin only)
export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing id or status" },
        { status: 400 }
      );
    }
    await adminDb().collection("submissions").doc(id).update({ status });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// DELETE — remove a submission (admin only)
export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id" },
        { status: 400 }
      );
    }
    await adminDb().collection("submissions").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
