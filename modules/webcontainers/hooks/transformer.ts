// interface TemplateItem {
//     filename: string;
//     fileExtension: string;
//     content: string;
//     folderName?: string;
//     items?: TemplateItem[];
//   }
  
//   interface WebContainerFile {
//     file: {
//       contents: string;
//     };
//   }
  
//   interface WebContainerDirectory {
//     directory: {
//       [key: string]: WebContainerFile | WebContainerDirectory;
//     };
//   }
  
//   type WebContainerFileSystem = Record<string, WebContainerFile | WebContainerDirectory>;
  
//   export function transformToWebContainerFormat(template: { folderName: string; items: TemplateItem[] }): WebContainerFileSystem {
//     function processItem(item: TemplateItem): WebContainerFile | WebContainerDirectory {
//       if (item.folderName && item.items) {
//         // This is a directory
//         const directoryContents: WebContainerFileSystem = {};
        
//         item.items.forEach(subItem => {
//           const key = subItem.fileExtension 
//             ? `${subItem.filename}.${subItem.fileExtension}`
//             : subItem.folderName!;
//           directoryContents[key] = processItem(subItem);
//         });
  
//         return {
//           directory: directoryContents
//         };
//       } else {
//         // This is a file
//         return {
//           file: {
//             contents: item.content
//           }
//         };
//       }
//     }
  
//     const result: WebContainerFileSystem = {};
    
//     template.items.forEach(item => {
//       const key = item.fileExtension 
//         ? `${item.filename}.${item.fileExtension}`
//         : item.folderName!;
//       result[key] = processItem(item);
//     });
  
//     return result;
//   }1

import { TemplateFolder, TemplateFile } from "@/modules/playground/utils/playground-utils";

interface WebContainerFile {
  file: {
    contents: string;
  };
}

interface WebContainerDirectory {
  directory: {
    [key: string]: WebContainerFile | WebContainerDirectory;
  };
}

type WebContainerFileSystem = Record<string, WebContainerFile | WebContainerDirectory>;

/**
 * ✅ Converts TemplateFolder into WebContainer filesystem format
 */
export function transformToWebContainerFormat(template: TemplateFolder): WebContainerFileSystem {
  function processItem(item: TemplateFolder | TemplateFile): WebContainerFile | WebContainerDirectory {
    // 🗂 If it's a folder
    if ("folderName" in item && "items" in item) {
      const directoryContents: WebContainerFileSystem = {};

      for (const subItem of item.items) {
        const key =
          "filename" in subItem
            ? `${subItem.filename}.${subItem.fileExtension}`
            : subItem.folderName;
        directoryContents[key] = processItem(subItem);
      }

      return {
        directory: directoryContents,
      };
    }

    // 📄 Otherwise, it's a file
    return {
      file: {
        contents: item.content || "",
      },
    };
  }

  const result: WebContainerFileSystem = {};

  for (const item of template.items) {
    const key =
      "filename" in item
        ? `${item.filename}.${item.fileExtension}`
        : item.folderName;
    result[key] = processItem(item);
  }

  return result;
}
