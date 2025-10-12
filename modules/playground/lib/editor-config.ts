import type { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

/**
 * Maps file extensions to Monaco language identifiers
 */
export const getEditorLanguage = (fileExtension: string): string => {
  const extension = fileExtension.toLowerCase();
  const languageMap: Record<string, string> = {
    // JavaScript/TypeScript
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    mjs: "javascript",
    cjs: "javascript",

    // Web stack
    json: "json",
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    sass: "scss",
    less: "less",

    // Docs & config
    md: "markdown",
    markdown: "markdown",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    toml: "ini",
    ini: "ini",
    conf: "ini",
    dockerfile: "dockerfile",

    // Programming
    py: "python",
    java: "java",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    php: "php",
    rb: "ruby",
    go: "go",
    rs: "rust",
    sh: "shell",
    bash: "shell",
    sql: "sql",
  };

  return languageMap[extension] || "plaintext";
};

/**
 * Global Monaco setup: themes, diagnostics, compiler options
 */
export const configureMonaco = (monaco: Monaco) => {
  // Modern Dark Theme
  monaco.editor.defineTheme("modern-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "7C7C7C", fontStyle: "italic" },
      { token: "keyword", foreground: "C586C0", fontStyle: "bold" },
      { token: "string", foreground: "CE9178" },
      { token: "number", foreground: "B5CEA8" },
      { token: "variable", foreground: "9CDCFE" },
      { token: "type", foreground: "4EC9B0" },
      { token: "function", foreground: "DCDCAA" },
    ],
    colors: {
      "editor.background": "#0D1117",
      "editor.foreground": "#E6EDF3",
      "editorLineNumber.foreground": "#7D8590",
      "editorLineNumber.activeForeground": "#F0F6FC",
      "editorCursor.foreground": "#F0F6FC",
      "editor.selectionBackground": "#264F78",
      "editor.lineHighlightBackground": "#21262D",
      "editorGutter.background": "#0D1117",
      "editorError.foreground": "#F85149",
      "editorWarning.foreground": "#D29922",
      "editorInfo.foreground": "#75BEFF",
    },
  });

  monaco.editor.setTheme("modern-dark");

  // Enable JS/TS IntelliSense + React support
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
    allowJs: true,
    typeRoots: ["node_modules/@types"],
  });
};

/**
 * Default editor options (VS Code–like UX)
 */
export const defaultEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  fontSize: 14,
  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  fontLigatures: true,
  minimap: { enabled: true, size: "proportional" },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  padding: { top: 16, bottom: 16 },

  lineNumbers: "on",
  lineHeight: 20,
  renderLineHighlight: "all",
  renderWhitespace: "selection",

  tabSize: 2,
  insertSpaces: true,
  detectIndentation: true,

  wordWrap: "on",
  wordWrapColumn: 120,
  wrappingIndent: "indent",

  folding: true,
  foldingHighlight: true,
  foldingStrategy: "indentation",
  showFoldingControls: "mouseover",

  smoothScrolling: true,
  mouseWheelZoom: true,

  selectionHighlight: true,
  occurrencesHighlight: true,

  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: "on",
  tabCompletion: "on",
  wordBasedSuggestions: true,

  formatOnPaste: true,
  formatOnType: true,

  matchBrackets: "always",
  bracketPairColorization: { enabled: true },

  rulers: [80, 120],
  stickyScroll: { enabled: true },
  "semanticHighlighting.enabled": true,

  cursorBlinking: "smooth",
  cursorSmoothCaretAnimation: "on",
  cursorStyle: "line",
  cursorWidth: 2,
};
