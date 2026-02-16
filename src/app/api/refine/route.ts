import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { refineImage } from "@/lib/replicate";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, prompt } = await request.json();

    if (!imageUrl || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields: imageUrl, prompt" },
        { status: 400 }
      );
    }

    // Get dimensions from the input image
    const base64Data = imageUrl.split(",")[1];
    const imgBuffer = Buffer.from(base64Data, "base64");
    const meta = await sharp(imgBuffer).metadata();
    const origWidth = meta.width || 1024;
    const origHeight = meta.height || 768;

    const resultUrl = await refineImage(imageUrl, prompt);

    // Resize to match original
    const resultResponse = await fetch(resultUrl);
    const resultBuffer = Buffer.from(await resultResponse.arrayBuffer());
    const resizedBuffer = await sharp(resultBuffer)
      .resize(origWidth, origHeight, { fit: "cover" })
      .jpeg({ quality: 90 })
      .toBuffer();

    const resizedBase64 = resizedBuffer.toString("base64");
    const resizedDataUri = `data:image/jpeg;base64,${resizedBase64}`;

    return NextResponse.json({ resultUrl: resizedDataUri });
  } catch (error) {
    console.error("Refine error:", error);
    return NextResponse.json(
      { error: "Failed to refine image. Please try again." },
      { status: 500 }
    );
  }
}
