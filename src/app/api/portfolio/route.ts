import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const PORTFOLIO_DIR = path.join(process.cwd(), "public/portfolio");
const PORTFOLIO_JSON = path.join(process.cwd(), "data/portfolio.json");

interface PortfolioEntry {
  id: string;
  roomType: string;
  roomName: string;
  style: string;
  styleName: string;
  beforeImage: string;
  afterImage: string;
  timestamp: string;
}

async function readPortfolio(): Promise<PortfolioEntry[]> {
  try {
    const data = await fs.readFile(PORTFOLIO_JSON, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writePortfolio(entries: PortfolioEntry[]): Promise<void> {
  await fs.mkdir(path.dirname(PORTFOLIO_JSON), { recursive: true });
  await fs.writeFile(PORTFOLIO_JSON, JSON.stringify(entries, null, 2));
}

async function fetchImageAsBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function GET() {
  const entries = await readPortfolio();
  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { beforeUrl, afterUrl, roomType, roomName, style, styleName } = body;

    if (!beforeUrl || !afterUrl || !roomType || !style) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    await fs.mkdir(PORTFOLIO_DIR, { recursive: true });

    // Fetch and save images
    const [beforeBuffer, afterBuffer] = await Promise.all([
      fetchImageAsBuffer(beforeUrl),
      fetchImageAsBuffer(afterUrl),
    ]);

    await Promise.all([
      fs.writeFile(path.join(PORTFOLIO_DIR, `${id}-before.jpg`), beforeBuffer),
      fs.writeFile(path.join(PORTFOLIO_DIR, `${id}-after.jpg`), afterBuffer),
    ]);

    const entry: PortfolioEntry = {
      id,
      roomType,
      roomName: roomName || roomType,
      style,
      styleName: styleName || style,
      beforeImage: `/portfolio/${id}-before.jpg`,
      afterImage: `/portfolio/${id}-after.jpg`,
      timestamp: new Date().toISOString(),
    };

    const entries = await readPortfolio();
    entries.unshift(entry);
    await writePortfolio(entries);

    return NextResponse.json(entry);
  } catch (err) {
    console.error("Portfolio save error:", err);
    return NextResponse.json(
      { error: "Failed to save to portfolio" },
      { status: 500 }
    );
  }
}
