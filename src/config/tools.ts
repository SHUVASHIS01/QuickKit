import { CategoryInfo, ToolItem } from "@/types";

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "image",
    name: "Image Tools",
    description: "Compress, resize, convert and optimize your images in seconds.",
    icon: "Image",
    accentColor: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    id: "pdf",
    name: "PDF Suite",
    description: "Merge, split, organize and manipulate PDF documents locally.",
    icon: "FileText",
    accentColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    id: "developer",
    name: "Developer Utilities",
    description: "Format JSON, encode base64, generate QR codes, and test payloads.",
    icon: "Code2",
    accentColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    id: "media",
    name: "Media & Video",
    description: "Convert video to GIF, extract frames, and download media assets.",
    icon: "Video",
    accentColor: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    id: "converter",
    name: "Format Converters",
    description: "Convert between various file, text, and data formats seamlessly.",
    icon: "ArrowLeftRight",
    accentColor: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    id: "utility",
    name: "Daily Utilities",
    description: "Everyday helpers for text, hashes, counts and calculations.",
    icon: "Wrench",
    accentColor: "bg-slate-50 text-slate-600 border-slate-100",
  },
];

export const TOOLS: ToolItem[] = [
  {
    id: "qr-generator",
    name: "QR Code Generator",
    slug: "qr-generator",
    category: "developer",
    shortDescription: "Generate customized high-resolution QR codes instantly.",
    description:
      "Create high-resolution QR codes for URLs, WiFi, plain text, and contact cards. Customize colors, margins, error correction levels, and download as PNG or SVG.",
    icon: "QrCode",
    status: "available",
    popular: true,
    recentlyAdded: true,
    privacyNotice: "100% processed in your browser. No data leaves your device.",
    tags: ["qr", "generator", "barcode", "link", "wifi", "developer"],
  },
  {
    id: "json-formatter",
    name: "JSON Formatter & Validator",
    slug: "json-formatter",
    category: "developer",
    shortDescription: "Prettify, minify, inspect, and validate JSON data.",
    description:
      "A fast, distraction-free JSON tool to format, beautify, minify, validate, and debug messy JSON payloads directly in your browser.",
    icon: "FileCode",
    status: "available",
    popular: true,
    recentlyAdded: true,
    privacyNotice: "Processed entirely client-side. Your payloads remain completely private.",
    tags: ["json", "format", "beautify", "minify", "validate", "developer"],
  },
  {
    id: "base64-converter",
    name: "Base64 Encoder & Decoder",
    slug: "base64-converter",
    category: "developer",
    shortDescription: "Encode text and files to Base64, or decode back.",
    description:
      "Safely encode text strings or binary files to Base64 strings, or decode Base64 data back to plain text or downloadable files.",
    icon: "Binary",
    status: "available",
    popular: true,
    recentlyAdded: false,
    privacyNotice: "Browser-side memory processing only. Zero server transmission.",
    tags: ["base64", "encode", "decode", "binary", "ascii", "developer"],
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    slug: "image-compressor",
    category: "image",
    shortDescription: "Compress JPG, PNG, and WebP images without quality loss.",
    description:
      "Shrink image file sizes by up to 80% while preserving visual clarity. Perfect for web optimization, email attachments, and storage saving.",
    icon: "Minimize2",
    status: "available",
    popular: true,
    recentlyAdded: true,
    privacyNotice: "Processed locally using high-performance browser Canvas APIs.",
    tags: ["image", "compress", "optimize", "jpg", "png", "webp", "photo"],
  },
  {
    id: "image-converter",
    name: "Image Format Converter",
    slug: "image-converter",
    category: "image",
    shortDescription: "Convert between JPG, PNG, WEBP, and AVIF formats.",
    description:
      "Easily convert image formats in batches with customizable output quality, transparent background preservation, and direct download.",
    icon: "FileImage",
    status: "available",
    popular: true,
    recentlyAdded: false,
    privacyNotice: "Zero server uploads. Converted in-browser using modern Web APIs.",
    tags: ["image", "convert", "format", "png to jpg", "webp", "avif"],
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    slug: "image-resizer",
    category: "image",
    shortDescription: "Resize images to exact dimensions or percentage scale.",
    description:
      "Batch resize pictures with aspect ratio locking, preset dimensions for social media (Instagram, Twitter, YouTube), or custom pixel scales.",
    icon: "Maximize2",
    status: "available",
    popular: false,
    recentlyAdded: false,
    privacyNotice: "Runs locally on your device for absolute confidentiality.",
    tags: ["image", "resize", "scale", "crop", "dimensions", "social"],
  },
  {
    id: "pdf-merger",
    name: "PDF Merger",
    slug: "pdf-merger",
    category: "pdf",
    shortDescription: "Combine multiple PDF documents into a single organized file.",
    description:
      "Drag and drop multiple PDF files, reorder pages, and merge them seamlessly into one comprehensive PDF document using pdf-lib in your browser.",
    icon: "Files",
    status: "available",
    popular: true,
    recentlyAdded: true,
    privacyNotice: "Your sensitive documents never leave your browser. Powered by client-side pdf-lib.",
    tags: ["pdf", "merge", "combine", "join", "documents"],
  },
  {
    id: "pdf-splitter",
    name: "PDF Splitter",
    slug: "pdf-splitter",
    category: "pdf",
    shortDescription: "Extract specific pages or separate a PDF into single files.",
    description:
      "Select specific page ranges or extract each page as an independent PDF document with zero upload limits.",
    icon: "Scissors",
    status: "coming-soon",
    popular: false,
    recentlyAdded: false,
    privacyNotice: "Secure client-side document processing.",
    tags: ["pdf", "split", "extract", "pages", "documents"],
  },
  {
    id: "video-to-gif",
    name: "Video to GIF Converter",
    slug: "video-to-gif",
    category: "media",
    shortDescription: "Turn short video clips into lightweight, loopable GIFs.",
    description:
      "Upload MP4, WebM, or MOV clips, select duration and frame rate, and create optimized animated GIFs for sharing.",
    icon: "Film",
    status: "coming-soon",
    popular: false,
    recentlyAdded: true,
    privacyNotice: "Rendered client-side using WebAssembly & Canvas.",
    tags: ["video", "gif", "animation", "mp4", "clip"],
  },
  {
    id: "pinterest-downloader",
    name: "Pinterest Media Downloader",
    slug: "pinterest-downloader",
    category: "media",
    shortDescription: "Download images and media from Pinterest links.",
    description:
      "Paste any public Pinterest pin link to extract the original high-resolution photo or video asset directly.",
    icon: "DownloadCloud",
    status: "coming-soon",
    popular: false,
    recentlyAdded: true,
    privacyNotice: "Direct link extraction without tracking or credential storage.",
    tags: ["pinterest", "downloader", "media", "pins", "images"],
  },
];

export function getToolBySlug(slug: string): ToolItem | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): ToolItem[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getPopularTools(): ToolItem[] {
  return TOOLS.filter((t) => t.popular);
}

export function getRecentTools(): ToolItem[] {
  return TOOLS.filter((t) => t.recentlyAdded);
}

export function searchTools(query: string): ToolItem[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return TOOLS;
  return TOOLS.filter(
    (tool) =>
      tool.name.toLowerCase().includes(clean) ||
      tool.description.toLowerCase().includes(clean) ||
      tool.shortDescription.toLowerCase().includes(clean) ||
      tool.category.toLowerCase().includes(clean) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(clean))
  );
}

