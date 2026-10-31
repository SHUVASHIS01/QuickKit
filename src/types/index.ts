export type ToolCategory =
  | "image"
  | "pdf"
  | "developer"
  | "media"
  | "converter"
  | "utility";

export type ToolStatus = "available" | "coming-soon" | "beta";

export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  category: ToolCategory;
  description: string;
  shortDescription: string;
  icon: string;
  status: ToolStatus;
  popular?: boolean;
  recentlyAdded?: boolean;
  privacyNotice?: string;
  tags: string[];
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
  accentColor: string;
}

export interface FileItem {
  id: string;
  file: File;
  previewUrl?: string;
  name: string;
  size: number;
  type: string;
  status: "idle" | "processing" | "completed" | "error";
  progress?: number;
  resultUrl?: string;
  resultBlob?: Blob;
  resultSize?: number;
  error?: string;
}

