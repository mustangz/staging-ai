export interface InteriorStyle {
  id: string;
  name: string;
  icon: string;
  prompt: string;
  stagingStyle: string; // Maps to proplabs/virtual-staging furniture_style enum
}

export const INTERIOR_STYLES: InteriorStyle[] = [
  {
    id: "modern",
    name: "Nowoczesny",
    icon: "🏢",
    prompt: "modern interior design, sleek furniture, clean lines, neutral colors with accent pieces, contemporary lighting, minimalist decor, high-end finishes",
    stagingStyle: "Modern",
  },
  {
    id: "scandinavian",
    name: "Skandynawski",
    icon: "🌿",
    prompt: "scandinavian interior design, light wood furniture, white and beige tones, cozy textiles, hygge atmosphere, natural materials, simple elegant forms",
    stagingStyle: "Scandinavian",
  },
  {
    id: "classic",
    name: "Klasyczny",
    icon: "🏛️",
    prompt: "classic traditional interior design, elegant furniture, rich fabrics, warm wood tones, ornamental details, sophisticated lighting, timeless decor",
    stagingStyle: "Traditional",
  },
  {
    id: "industrial",
    name: "Industrialny",
    icon: "🏭",
    prompt: "industrial interior design, exposed brick, metal accents, raw wood, Edison bulbs, leather furniture, loft-style decor, urban atmosphere",
    stagingStyle: "Urban Industrial",
  },
  {
    id: "minimalist",
    name: "Minimalistyczny",
    icon: "⬜",
    prompt: "minimalist interior design, essential furniture only, monochromatic palette, clean surfaces, plenty of open space, zen-like atmosphere, less is more",
    stagingStyle: "Modern Organic",
  },
  {
    id: "boho",
    name: "Boho",
    icon: "🌺",
    prompt: "bohemian interior design, eclectic mix of patterns and textures, warm earthy colors, plants, macrame, vintage furniture, layered textiles, cozy and artistic",
    stagingStyle: "Farmhouse",
  },
];

export type RoomType = {
  id: string;
  name: string;
  icon: string;
  promptHint: string;
  stagingRoom: string; // Maps to proplabs/virtual-staging room enum
};

export const ROOM_TYPES: RoomType[] = [
  {
    id: "living-room",
    name: "Salon",
    icon: "🛋️",
    promptHint: "living room with sofa, coffee table, TV stand, rug, curtains",
    stagingRoom: "Living Room",
  },
  {
    id: "living-kitchen",
    name: "Salon z aneksem",
    icon: "🛋️🍳",
    promptHint: "open-plan living room with kitchenette, sofa, coffee table, kitchen island or counter with stools, dining area",
    stagingRoom: "Living Room",
  },
  {
    id: "bedroom",
    name: "Sypialnia",
    icon: "🛏️",
    promptHint: "bedroom with bed, nightstands, wardrobe, soft lighting, bedding",
    stagingRoom: "Bedroom",
  },
  {
    id: "kitchen",
    name: "Kuchnia",
    icon: "🍳",
    promptHint: "kitchen with dining table, chairs, modern appliances, organized countertops",
    stagingRoom: "Kitchen",
  },
  {
    id: "bathroom",
    name: "Łazienka",
    icon: "🚿",
    promptHint: "bathroom with towels, bath mat, accessories, plants, organized vanity",
    stagingRoom: "Bathroom",
  },
  {
    id: "office",
    name: "Biuro",
    icon: "💼",
    promptHint: "home office with desk, ergonomic chair, bookshelf, desk lamp, organized workspace",
    stagingRoom: "Office",
  },
  {
    id: "dining",
    name: "Jadalnia",
    icon: "🍽️",
    promptHint: "dining room with dining table, chairs, centerpiece, pendant lighting, sideboard",
    stagingRoom: "Dining Room",
  },
];
