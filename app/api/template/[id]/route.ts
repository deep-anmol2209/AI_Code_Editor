import { readTemplateStructureFromJson, saveTemplateStructureToJson } from "@/modules/playground/lib/path-to-json";
import { db } from "@/lib/db";
import { templatePath } from "@/lib/template";
import path from "path";
import fs from "fs/promises";
import { NextRequest } from "next/server";

function validateJsonStructure(data: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(data));
    return true;
  } catch (error) {
    console.log("Invalid JSON:", error);
    return false;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("hello");
  
  const { id } = params;

  if (!id) {
    return Response.json({ error: "Missing playground ID" }, { status: 400 });
  }

  const playground = await db.playground.findUnique({
    where: { id },
  });

  if (!playground) {
    console.log("playground not found");
    
    return Response.json({ error: "Playground not found" }, { status: 404 });
  }
  console.log("playground: ", playground);
  
  const templateKey = playground.template as keyof typeof templatePath;
  console.log("template key: ", templateKey);
  
  const templateDir = templatePath[templateKey];
  console.log("dir: ", templateDir);
  
  if (!templateDir) {
    console.log("invalid template path");
    
    return Response.json({ error: "Invalid template path" }, { status: 404 });
  }

  try {
    const inputPath = path.join(process.cwd(), templateDir);
    const outputFile = path.join(process.cwd(), `output/${templateKey}.json`);

    await saveTemplateStructureToJson(inputPath, outputFile);
    const result = await readTemplateStructureFromJson(outputFile);

    if (!validateJsonStructure(result.items)) {
      return Response.json({ error: "Invalid JSON structure" }, { status: 500 });
    }

    await fs.unlink(outputFile);

    return Response.json({ success: true, templateJson: result }, { status: 200 });
  } catch (error) {
    console.error("Error generating template JSON:", error);
    return Response.json(
      { error: "Failed to generate template", details: String(error) },
      { status: 500 }
    );
  }
}
