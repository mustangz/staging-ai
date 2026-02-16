import { NextRequest, NextResponse } from "next/server";
import { appendFile } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { rating, issues, comment, roomType, style } = body;

    if (!rating || !["good", "bad"].includes(rating)) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    const entry = {
      rating,
      issues: issues || [],
      comment: comment || null,
      roomType: roomType || null,
      style: style || null,
      timestamp: new Date().toISOString(),
    };

    const filePath = join(process.cwd(), "feedback.jsonl");
    await appendFile(filePath, JSON.stringify(entry) + "\n", "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}
