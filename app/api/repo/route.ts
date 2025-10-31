// /app/api/github/download/route.ts
import  getServerSession  from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "../../../auth";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  const session = await auth()
  console.log(session);
  
  const token = session?.user.githubAccessToken; // you already have this from NextAuth

  if (!token || !owner || !repo) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  // GitHub API endpoint for zipball
  const url = `https://api.github.com/repos/${owner}/${repo}/zipball/main`; 
  // You can replace "main" with dynamic branch name if needed

  // Fetch with authorization header
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to download" }, { status: response.status });
  }

  // Return the ZIP file as a stream
  const blob = await response.arrayBuffer();

  return new Response(blob, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${repo}.zip"`,
    },
  });
}