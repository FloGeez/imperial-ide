import { useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import blackboardTheme from "monaco-themes/themes/Blackboard.json";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const beforeMount = (monaco: any) => {
    monaco.editor.defineTheme("imperial-theme", {
      ...blackboardTheme,
      colors: {
        ...blackboardTheme.colors,
        "editor.background": "#020617",
      },
    });
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div className="h-full w-full rounded-md border border-border/50 bg-card/50">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorDidMount}
        beforeMount={beforeMount}
        theme="imperial-theme"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "ui-monospace, monospace",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          folding: true,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          smoothScrolling: true,
          cursorBlinking: "phase",
          renderLineHighlight: "all",
          bracketPairColorization: {
            enabled: true,
          },
        }}
        loading={
          <div className="flex items-center justify-center h-full text-primary">
            Initialisation des systèmes...
          </div>
        }
      />
    </div>
  );
}
