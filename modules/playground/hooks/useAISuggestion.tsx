import { useState, useCallback, useRef } from "react";
import type * as monaco from "monaco-editor"; // ✅ import Monaco types
interface AISuggestionsState {
  suggestion: string | null;
  isLoading: boolean;
  position: { line: number; column: number } | null;
  decoration: string[];
  isEnabled: boolean;
}

interface UseAISuggestionsReturn extends AISuggestionsState {
  toggleEnabled: () => void;
  fetchSuggestion: (type: string, editor: monaco.editor.IStandaloneCodeEditor) => void;
  acceptSuggestion: (
    editor: monaco.editor.IStandaloneCodeEditor,
    monacoInstance: typeof monaco
  ) => void;
  rejectSuggestion: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  clearSuggestion: (editor: monaco.editor.IStandaloneCodeEditor) => void;
}

export const useAISuggestions = (): UseAISuggestionsReturn => {
  const [state, setState] = useState<AISuggestionsState>({
    suggestion: null,
    isLoading: false,
    position: null,
    decoration: [],
    isEnabled: true,
  });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionCache = useRef<Map<string, string>>(new Map());

  const toggleEnabled = useCallback(() => {
    setState((prev) => ({ ...prev, isEnabled: !prev.isEnabled }));
  }, []);

  const fetchSuggestion = useCallback(  (type: string, editor: monaco.editor.IStandaloneCodeEditor) => {
    if (!state.isEnabled || !editor) return;

    const model = editor.getModel();
    const cursorPosition = editor.getPosition();
    if (!model || !cursorPosition) return;

    // Debounce API calls
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const startLine = Math.max(1, cursorPosition.lineNumber - 2);
      const endLine = cursorPosition.lineNumber + 1;
      const contextLines = model.getLinesContent().slice(startLine - 1, endLine);
      const contextKey = contextLines.join("\n");

      // Check cache first
      if (suggestionCache.current.has(contextKey)) {
        const cached = suggestionCache.current.get(contextKey)!;
        setState((prev) => ({
          ...prev,
          suggestion: cached,
          position: {
            line: cursorPosition.lineNumber,
            column: cursorPosition.column,
          },
          isLoading: false,
        }));
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const payload = {
          fileContent: contextLines.join("\n"),
          cursorLine: cursorPosition.lineNumber - 1,
          cursorColumn: cursorPosition.column - 1,
          suggestionType: type,
        };

        const response = await fetch("/api/code-completion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`API responded with status ${response.status}`);

        const data = await response.json();

        if (data.suggestion) {
          const suggestionText = data.suggestion.trim();
          suggestionCache.current.set(contextKey, suggestionText);

          setState((prev) => ({
            ...prev,
            suggestion: suggestionText,
            position: {
              line: cursorPosition.lineNumber,
              column: cursorPosition.column,
            },
            isLoading: false,
          }));
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Error fetching code suggestion:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    }, 400); // 400ms debounce
  }, [state.isEnabled]);

  const acceptSuggestion = useCallback((editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
    setState((currentState) => {
      if (!currentState.suggestion || !currentState.position || !editor) {
        return currentState;
      }

      const { line, column } = currentState.position;
      const sanitizedSuggestion = currentState.suggestion.replace(/^\d+:\s*/gm, "");

      editor.executeEdits("", [
        {
          range: new monacoInstance.Range(line, column, line, column),
          text: sanitizedSuggestion,
          forceMoveMarkers: true,
        },
      ]);

      if (editor && currentState.decoration.length > 0) {
        editor.deltaDecorations(currentState.decoration, []);
      }

      return {
        ...currentState,
        suggestion: null,
        position: null,
        decoration: [],
      };
    });
  }, []);

  const rejectSuggestion = useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor) => {
      setState((currentState) => {
        if (editor && currentState.decoration.length > 0) {
          editor.deltaDecorations(currentState.decoration, []);
        }

        return {
          ...currentState,
          suggestion: null,
          position: null,
          decoration: [],
        };
      });
    },
    []
  );
  const clearSuggestion = useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor) => {
      setState((currentState) => {
        if (editor && currentState.decoration.length > 0) {
          editor.deltaDecorations(currentState.decoration, []);
        }
        return {
          ...currentState,
          suggestion: null,
          position: null,
          decoration: [],
        };
      });
    },
    []
  );

  return {
    ...state,
    toggleEnabled,
    fetchSuggestion,
    acceptSuggestion,
    rejectSuggestion,
    clearSuggestion,
  };
};
