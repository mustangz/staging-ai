import { NextRequest, NextResponse } from "next/server";
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

    const resultUrl = await generateStagedImage({
      imageUrl: dataUri,
      style: style.prompt,
      roomType: roomType.promptHint,
    });

    return NextResponse.json({ resultUrl });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image. Please try again." },
      { status: 500 }
    );
  }
}
