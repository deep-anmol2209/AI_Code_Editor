import JSZip from "jszip";

export interface TemplateFolder {
  folderName: string;
  items: (TemplateFolder | { filename: string; fileExtension: string; content: string })[];
}

export async function zipToTree(zipBlob: Blob): Promise<TemplateFolder> {
  console.log("🧩 [zipToTree] Starting ZIP parsing...");
  const arrayBuffer = await zipBlob.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  console.log("✅ ZIP loaded. Total entries:", Object.keys(zip.files).length);

  const root: TemplateFolder = { folderName: "root", items: [] };

  for (const [path, zipEntry] of Object.entries(zip.files)) {
    if (zipEntry.dir) continue;

    const content = await zipEntry.async("text");
    const parts = path.split("/");

    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;

      if (isFile) {
        const dotIndex = part.lastIndexOf(".");
        const filename = dotIndex !== -1 ? part.substring(0, dotIndex) : part;
        const fileExtension = dotIndex !== -1 ? part.substring(dotIndex + 1) : "";

        current.items.push({
          filename,
          fileExtension,
          content
        });
      } else {
        let folder = current.items.find(
          (item) => "folderName" in item && item.folderName === part
        ) as TemplateFolder | undefined;

        if (!folder) {
          folder = { folderName: part, items: [] };
          current.items.push(folder);
        }
        current = folder;
      }
    }
  }

  console.log("✅ [zipToTree] Finished building tree");
  return root;
}
