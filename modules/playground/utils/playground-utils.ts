export interface TemplateFile {
    filename: string;
    fileExtension: string;
    content: string;
  }
  
  /**
   * Represents a folder in the template structure which can contain files and other folders
   */
  export interface TemplateFolder {
    folderName: string;
    items: (TemplateFile | TemplateFolder)[];
  }
  
  /**
   * Type representing either a file or folder in the template structure
   */
  export type TemplateItem = TemplateFile | TemplateFolder;

  export interface TemplateFileTreeProps {
    data: TemplateItem;
    onFileSelect?: (file: TemplateFile) => void;
    selectedFile?: TemplateFile;
    title?: string;
    onAddFile?: (file: TemplateFile, parentPath: string) => void;
    onAddFolder?: (folder: TemplateFolder, parentPath: string) => void;
    onDeleteFile?: (file: TemplateFile, parentPath: string) => void;
    onDeleteFolder?: (folder: TemplateFolder, parentPath: string) => void;
    onRenameFile?: (
      file: TemplateFile,
      newFilename: string,
      newExtension: string,
      parentPath: string
    ) => void;
    onRenameFolder?: (
      folder: TemplateFolder,
      newFolderName: string,
      parentPath: string
    ) => void;
  }

  export interface TemplateNodeProps {
    item: TemplateItem;
    onFileSelect?: (file: TemplateFile) => void;
    selectedFile?: TemplateFile;
    level: number;
    path?: string;
    onAddFile?: (file: TemplateFile, parentPath: string) => void;
    onAddFolder?: (folder: TemplateFolder, parentPath: string) => void;
    onDeleteFile?: (file: TemplateFile, parentPath: string) => void;
    onDeleteFolder?: (folder: TemplateFolder, parentPath: string) => void;
    onRenameFile?: (
      file: TemplateFile,
      newFilename: string,
      newExtension: string,
      parentPath: string
    ) => void;
    onRenameFolder?: (
      folder: TemplateFolder,
      newFolderName: string,
      parentPath: string
    ) => void;
  }