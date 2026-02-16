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
  stagingStyle: string;
  stagingRoom: string;
}

/**
 * Step 1: Use Flux Kontext Pro to clean and finish the room — remove construction
 * items, add doors to empty frames, finish outlets, paint ceiling.
 */
async function cleanRoom(imageUrl: string, roomType: string): Promise<string> {
  const output = (await replicate.run("black-forest-labs/flux-kontext-pro", {
    input: {
      prompt: `Clean up and finish this ${roomType} photo for virtual staging. ONLY remove: ladders, buckets, paint cans, tools, debris, construction trash, OSB boards, and temporary objects. Finishing touches: if the ceiling is bare or unfinished, paint it white. Add white doors to any empty door frames or doorways that have no door. Replace electrical junction boxes or bare wiring with finished outlets (near floor level) or light switches (at wall height ~120cm). NEVER remove or change: walls, load-bearing walls, columns, pillars, beams, windows, door frames, radiators, pipes, flooring, stairs, railings, or any permanent structural element. Keep every wall, partition, and architectural feature exactly as it is. The room structure must remain 100% identical.`,
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
 * Step 2: Use proplabs/virtual-staging — dedicated virtual staging model.
 * Handles room structure preservation and furniture placement natively.
 */
async function stageRoom(
  cleanImageUrl: string,
  stagingStyle: string,
  stagingRoom: string
): Promise<string> {
  const output = (await replicate.run(
    "proplabs/virtual-staging:635d607efc6e3a6016ef6d655327cd35f3d792e84b8f110688b04498c6e94cfb",
    {
      input: {
        image: cleanImageUrl,
        room: stagingRoom,
        furniture_style: stagingStyle,
        furniture_items: "Default (AI decides)",
        replicate_api_key: process.env.REPLICATE_API_TOKEN,
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
 * 1. Flux Kontext Pro cleans the room (removes construction items, finishes surfaces)
 * 2. proplabs/virtual-staging adds furniture (dedicated staging model)
 * Set DEMO_MODE=true in .env.local to skip API calls.
 */
export async function generateStagedImage({
  imageUrl,
  style,
  roomType,
  stagingStyle,
  stagingRoom,
}: GenerateInput): Promise<string> {
  if (DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 3000));
    return DEMO_IMAGES[roomType] || DEMO_IMAGES["living-room"];
  }

  // Step 1: Clean the room
  const cleanedImageUrl = await cleanRoom(imageUrl, roomType);

  // Step 2: Stage the clean room with furniture
  return stageRoom(cleanedImageUrl, stagingStyle, stagingRoom);
}
