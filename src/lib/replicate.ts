import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const DEMO_MODE = process.env.DEMO_MODE === "true";

// Sample staged room images for demo mode
const DEMO_IMAGES: Record<string, string> = {
  "living-room": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1024&q=90",
  "bedroom": "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1024&q=90",
  "kitchen": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1024&q=90",
  "bathroom": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1024&q=90",
  "office": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1024&q=90",
  "dining": "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1024&q=90",
};

export interface GenerateInput {
  imageUrl: string;
  style: string;
  roomType: string;
}

/**
 * Step 1: Use Flux Kontext Pro to clean the room — remove construction items,
 * ladders, buckets, debris, etc. Returns URL of cleaned image.
 */
async function cleanRoom(imageUrl: string, roomType: string): Promise<string> {
  const output = (await replicate.run("black-forest-labs/flux-kontext-pro", {
    input: {
      prompt: `Remove all construction items, ladders, buckets, paint cans, OSB boards, tools, debris, and temporary objects from this ${roomType}. Replace them with clean empty floor and walls. Keep the exact same room structure, walls, floor, ceiling, windows, doors, camera angle, and perspective. The room should look clean and empty, ready for furniture.`,
      input_image: imageUrl,
      aspect_ratio: "match_input_image",
      output_format: "jpg",
      safety_tolerance: 2,
    },
  })) as { url(): string } | string;

  if (output && typeof output === "object" && "url" in output) {
    return (output as { url(): string }).url();
  }
  if (typeof output === "string") {
    return output;
  }
  throw new Error("Failed to clean room image");
}

/**
 * Step 2: Use adirik/interior-design — same pipeline as Interior AI.
 * Realistic Vision V3.0 + SegFormer segmentation + dual ControlNet (seg + MLSD).
 * Automatically masks structural elements (walls, windows, doors) and inpaints furniture.
 */
async function stageRoom(
  cleanImageUrl: string,
  style: string,
  roomType: string
): Promise<string> {
  const prompt = `A beautifully furnished ${roomType}, ${style}, professional real estate photography, photorealistic, well-lit, high quality interior design`;
  const negativePrompt =
    "lowres, watermark, banner, logo, text, deformed, blurry, blur, out of focus, out of frame, surreal, ugly, construction materials, ladders, buckets, tools, debris";

  const output = (await replicate.run(
    "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
    {
      input: {
        image: cleanImageUrl,
        prompt,
        negative_prompt: negativePrompt,
        guidance_scale: 15,
        prompt_strength: 0.8,
        num_inference_steps: 50,
      },
    }
  )) as { url(): string } | string;

  if (output && typeof output === "object" && "url" in output) {
    return (output as { url(): string }).url();
  }
  if (typeof output === "string") {
    return output;
  }
  throw new Error("No output received from staging model");
}

/**
 * Two-step virtual staging pipeline:
 * 1. Flux Kontext Pro cleans the room (removes construction items)
 * 2. adirik/interior-design stages furniture (segmentation + dual ControlNet inpainting)
 * Set DEMO_MODE=true in .env.local to skip API calls.
 */
export async function generateStagedImage({
  imageUrl,
  style,
  roomType,
}: GenerateInput): Promise<string> {
  if (DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 3000));
    return DEMO_IMAGES[roomType] || DEMO_IMAGES["living-room"];
  }

  // Step 1: Clean the room
  const cleanedImageUrl = await cleanRoom(imageUrl, roomType);

  // Step 2: Stage the clean room with furniture
  return stageRoom(cleanedImageUrl, style, roomType);
}
