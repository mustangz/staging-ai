import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { generateStagedImage } from "@/lib/replicate";
import { INTERIOR_STYLES, ROOM_TYPES } from "@/lib/styles";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File | null;
    const styleId = formData.get("style") as string | null;
    const roomTypeId = formData.get("roomType") as string | null;

    if (!image || !styleId || !roomTypeId) {
      return NextResponse.json(
        { error: "Missing required fields: image, style, roomType" },
        { status: 400 }
      );
    }

    const style = INTERIOR_STYLES.find((s) => s.id === styleId);
    const roomType = ROOM_TYPES.find((r) => r.id === roomTypeId);

    if (!style || !roomType) {
      return NextResponse.json(
        { error: "Invalid style or room type" },
        { status: 400 }
      );
    }

    // Convert the uploaded file to a data URI for Replicate
    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = image.type || "image/jpeg";
    const dataUri = `data:${mimeType};base64,${base64}`;

    // Get original image dimensions
    const originalMeta = await sharp(Buffer.from(bytes)).metadata();
    const origWidth = originalMeta.width || 1024;
    const origHeight = originalMeta.height || 768;

    const resultUrl = await generateStagedImage({
      imageUrl: dataUri,
      style: style.prompt,
      roomType: roomType.promptHint,
      stagingStyle: style.stagingStyle,
      stagingRoom: roomType.stagingRoom,
    });

    // Resize generated image to match original dimensions
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
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image. Please try again." },
      { status: 500 }
    );
  }
}
