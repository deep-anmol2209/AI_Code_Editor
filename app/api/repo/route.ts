// /app/api/github/download/route.ts
import { NextResponse, NextRequest } from "next/server";
import { auth } from "../../../auth";

export const dynamic = "force-dynamic"; // 🧩 prevents Next.js from building it statically

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    const session = await auth();
    const token = session?.user.githubAccessToken;

    if (!token || !owner || !repo) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/zipball/main`;

    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to download" }, { status: response.status });
    }

    const blob = await response.arrayBuffer();

    return new Response(blob, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${repo}.zip"`,
      },
    });
  } catch (error) {
    console.error("Download API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
