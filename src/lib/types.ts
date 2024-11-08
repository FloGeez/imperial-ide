export interface FileSystemNode {
  name: string;
  path: string;
  type: "file" | "directory";
  content?: string;
  children?: FileSystemNode[];
}

export interface Tab {
  id: string;
  path: string;
  label: string;
  content: string;
}
