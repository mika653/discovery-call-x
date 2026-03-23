import { NextRequest, NextResponse } from "next/server";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Convert a plain object to Firestore document fields
function toFirestoreFields(obj: Record<string, unknown>): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      fields[key] = { nullValue: null };
    } else if (typeof value === "string") {
      fields[key] = { stringValue: value };
    } else if (typeof value === "number") {
      fields[key] = Number.isInteger(value)
        ? { integerValue: String(value) }
        : { doubleValue: value };
    } else if (typeof value === "boolean") {
      fields[key] = { booleanValue: value };
    } else if (Array.isArray(value)) {
      fields[key] = {
        arrayValue: {
          values: value.map((v) => {
            if (typeof v === "string") return { stringValue: v };
            if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
            if (typeof v === "boolean") return { booleanValue: v };
            if (v === null) return { nullValue: null };
            if (typeof v === "object") return { mapValue: { fields: toFirestoreFields(v as Record<string, unknown>) } };
            return { stringValue: String(v) };
          }),
        },
      };
    } else if (typeof value === "object") {
      fields[key] = {
        mapValue: { fields: toFirestoreFields(value as Record<string, unknown>) },
      };
    } else {
      fields[key] = { stringValue: String(value) };
    }
  }
  return fields;
}

// Convert Firestore document fields back to a plain object
function fromFirestoreFields(fields: Record<string, Record<string, unknown>>): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, valueObj] of Object.entries(fields)) {
    obj[key] = fromFirestoreValue(valueObj);
  }
  return obj;
}

function fromFirestoreValue(valueObj: Record<string, unknown>): unknown {
  if ("stringValue" in valueObj) return valueObj.stringValue;
  if ("integerValue" in valueObj) return Number(valueObj.integerValue);
  if ("doubleValue" in valueObj) return valueObj.doubleValue;
  if ("booleanValue" in valueObj) return valueObj.booleanValue;
  if ("nullValue" in valueObj) return null;
  if ("arrayValue" in valueObj) {
    const arr = valueObj.arrayValue as { values?: Record<string, unknown>[] };
    return (arr.values || []).map(fromFirestoreValue);
  }
  if ("mapValue" in valueObj) {
    const map = valueObj.mapValue as { fields: Record<string, Record<string, unknown>> };
    return fromFirestoreFields(map.fields || {});
  }
  return null;
}

// POST — save a submission
export async function POST(req: NextRequest) {
  try {
    const submission = await req.json();
    const docUrl = `${BASE_URL}/submissions/${submission.id}?key=${API_KEY}`;

    const res = await fetch(docUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: toFirestoreFields(submission) }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Firestore REST error:", res.status, errBody);
      return NextResponse.json({ success: false, error: errBody }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API: Failed to save submission:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// GET — fetch all submissions
export async function GET() {
  try {
    const listUrl = `${BASE_URL}/submissions?key=${API_KEY}`;
    const res = await fetch(listUrl, { cache: "no-store" });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Firestore REST error:", res.status, errBody);
      return NextResponse.json({ success: false, error: errBody }, { status: 500 });
    }

    const data = await res.json();
    const documents = data.documents || [];
    const submissions = documents.map((doc: { fields: Record<string, Record<string, unknown>> }) =>
      fromFirestoreFields(doc.fields)
    );
    submissions.sort(
      (a: Record<string, unknown>, b: Record<string, unknown>) =>
        new Date(b.createdAt as string).getTime() -
        new Date(a.createdAt as string).getTime()
    );

    return NextResponse.json({ success: true, submissions });
  } catch (err) {
    console.error("API: Failed to fetch submissions:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// PATCH — update status
export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const docUrl = `${BASE_URL}/submissions/${id}?updateMask.fieldPaths=status&key=${API_KEY}`;

    const res = await fetch(docUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: { status: { stringValue: status } },
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return NextResponse.json({ success: false, error: errBody }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// DELETE — delete a submission
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const docUrl = `${BASE_URL}/submissions/${id}?key=${API_KEY}`;

    const res = await fetch(docUrl, { method: "DELETE" });

    if (!res.ok) {
      const errBody = await res.text();
      return NextResponse.json({ success: false, error: errBody }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
