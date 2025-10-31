import { readTemplateStructureFromJson, saveTemplateStructureToJson } from "@/modules/playground/lib/path-to-json";
import { zipToTree } from "@/modules/playground/lib/zip-to-tree";
import { db } from "@/lib/db";
import { templatePath } from "@/lib/template";
import path from "path";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

function validateJsonStructure(data: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(data));
    return true;
  } catch (error) {
    console.log("❌ Invalid JSON structure:", error);
    return false;
  }
}

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  console.log("🔹 [API] /api/template/[id] called");

  const { params } = context;
  const id = params?.id;
  console.log("🆔 Playground ID:", id);

  if (!id) {
    return NextResponse.json({ error: "Missing playground ID" },{ status: 400 });
  }

  const playground = await db.playground.findUnique({
    where: { id },
    include: { templateFiles: true },
  });

  console.log("📂 Playground fetched:", JSON.stringify(playground, null, 2));

  if (!playground) {
    return NextResponse.json({ error: "Playground not found" }, { status: 404 });
  }

  // ✅ If already saved template in DB
  if (playground.templateFiles?.[0]?.content) {
    console.log("🟢 Template found in DB, returning existing content.");
    return NextResponse.json({ templateJson: playground.templateFiles[0].content }, {
      status: 200,
    });
  }

  // ✅ Handle GitHub-based playgrounds
  if (playground.template === "GITHUB") {
    try {
      console.log("📦 Fetching GitHub repo zip...");
      if (!playground.repoUrl) {
        console.error("❌ No repo URL found for this playground");
        return NextResponse.json({ error: "No repo URL found for this playground" }, {
          status: 400,
        });
      }

      console.log("🌐 Repo URL:", playground.repoUrl);

      // Add redirect handling and log status
      const res = await fetch(playground.repoUrl, { redirect: "follow" });
      console.log("🔍 Response status:", res.status, res.statusText);
      console.log("🔍 Response headers:", Object.fromEntries(res.headers.entries()));

      if (!res.ok) throw new Error(`Failed to fetch GitHub repo ZIP: ${res.statusText}`);

      const blob = await res.blob();
      console.log("📦 Blob created from response.");
      console.log("📏 Blob size (bytes):", blob.size);
      console.log("📄 Blob type:", blob.type);

      // Debug before ZIP parsing
      console.log("🔍 Passing blob to zipToTree...");
      const repoTree = await zipToTree(blob);
      console.log("✅ Repo tree generated from GitHub ZIP");

      console.log("🧩 Repo tree preview:", JSON.stringify(repoTree, null, 2).slice(0, 1000));

      if (!validateJsonStructure(repoTree.items)) {
        console.error("❌ Invalid repo JSON structure");
        throw new Error("Invalid repo JSON structure");
      }

      console.log("✅ Repo JSON structure validated successfully.");
      return NextResponse.json({ templateJson: repoTree }, { status: 200 });

    } catch (error) {
      console.error("💥 GitHub import error:", error);
      console.error("💥 Error stack:", error instanceof Error ? error.stack : "No stack trace");
      return NextResponse.json(
        {
          error: "Failed to import GitHub repo",
          details: String(error),
        },
        { status: 500 }
      );
    }
  }

  // ✅ Handle Local Template (Normal flow)
  try {
    console.log("📁 Handling local template...");
    const templateKey = playground.template as keyof typeof templatePath;
    const templateDir = templatePath[templateKey];
    console.log("📂 Template dir:", templateDir);

    if (!templateDir) {
      console.error("❌ Invalid template path");
      return NextResponse.json({ error: "Invalid template path" }, { status: 404 });
    }

    const inputPath = path.join(process.cwd(), templateDir);
    const outputFile = path.join(process.cwd(), `output/${templateKey}.json`);
    console.log("🧠 Input path:", inputPath);
    console.log("🧠 Output file:", outputFile);

    await saveTemplateStructureToJson(inputPath, outputFile);
    console.log("✅ Template structure saved to JSON");

    const result = await readTemplateStructureFromJson(outputFile);
    console.log("📖 Template structure read from JSON");

    if (!validateJsonStructure(result.items)) {
      throw new Error("Invalid local template structure");
    }

    await fs.unlink(outputFile);
    console.log("🧹 Cleaned up temporary file.");

    return NextResponse.json({ templateJson: result }, { status: 200 });
  } catch (error) {
    console.error("💥 Local template error:", error);
    console.error("💥 Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return NextResponse.json(
      {
        error: "Failed to generate local template",
        details: String(error),
      },
      { status: 500 })
    ;
  }
}
