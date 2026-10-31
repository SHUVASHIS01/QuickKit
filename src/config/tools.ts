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
    status: "available",
    popular: false,
    recentlyAdded: true,
    privacyNotice: "Secure client-side document processing with zip bundle support.",
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
    status: "available",
    popular: true,
    recentlyAdded: true,
    privacyNotice: "Rendered client-side using Web Canvas and frame quantization.",
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
    status: "available",
    popular: true,
    recentlyAdded: true,
    privacyNotice: "Direct link extraction without tracking or credential storage.",
    tags: ["pinterest", "downloader", "media", "pins", "images"],
  },
  {
    id: "background-remover",
    name: "Background Remover",
    slug: "background-remover",
    category: "image",
    shortDescription: "Erase image backgrounds instantly with transparent PNG export.",
    description:
      "Automatically detect subjects and isolate transparent backgrounds for portraits, product photos, and graphics right in your browser.",
    icon: "Eraser",
    status: "available",
    popular: true,
    recentlyAdded: true,
    privacyNotice: "100% in-browser Canvas processing. Photos never leave your machine.",
    tags: ["background", "remove", "transparent", "cutout", "png", "photo", "image"],
  },
  {
    id: "image-upscaler",
    name: "Image Upscaler",
    slug: "image-upscaler",
    category: "image",
    shortDescription: "Upscale 2x and 4x with bicubic edge enhancement and sharpening.",
    description:
      "Increase image resolution up to 400% with high-fidelity adaptive bicubic interpolation, unsharp masking, and contrast restoration.",
    icon: "Maximize",
    status: "available",
    popular: true,
    recentlyAdded: true,
    privacyNotice: "Hardware-accelerated client-side canvas rendering.",
    tags: ["upscale", "super-resolution", "enhance", "enlarge", "sharp", "image"],
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF Converter",
    slug: "image-to-pdf",
    category: "pdf",
    shortDescription: "Convert multiple JPG & PNG photos into a clean single PDF.",
    description:
      "Combine photos and scans into a single organized PDF document with custom page orientations, margins, and page order.",
    icon: "FileSpreadsheet",
    status: "available",
    popular: true,
    recentlyAdded: true,
    privacyNotice: "Zero server uploads. Generated directly using browser pdf-lib.",
    tags: ["image to pdf", "jpg to pdf", "png to pdf", "photos", "documents", "pdf"],
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG Converter",
    slug: "pdf-to-jpg",
    category: "pdf",
    shortDescription: "Convert PDF pages into high-resolution JPG or PNG images.",
    description:
      "Render individual PDF document pages into crisp JPEG or PNG images with ZIP batch download support.",
    icon: "FileImage",
    status: "available",
    popular: true,
    recentlyAdded: true,
    privacyNotice: "Rendered locally in your browser canvas.",
    tags: ["pdf to jpg", "pdf to image", "pdf to png", "rasterize", "pages"],
  },
  {
    id: "pdf-compressor",
    name: "PDF Compressor",
    slug: "pdf-compressor",
    category: "pdf",
    shortDescription: "Reduce PDF document file size while preserving readability.",
    description:
      "Compress bloated PDF documents, strip unnecessary metadata, and optimize document streams directly on your device.",
    icon: "Minimize",
    status: "available",
    popular: true,
    recentlyAdded: true,
    privacyNotice: "Confidential files stay strictly inside your local device memory.",
    tags: ["pdf", "compress", "shrink", "optimize", "size", "document"],
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word Converter",
    slug: "pdf-to-word",
    category: "converter",
    shortDescription: "Convert PDF to editable Word (DOCX) and vice versa.",
    description:
      "Extract structured text and formatting from PDF files into editable Microsoft Word (.docx) documents, or convert Word documents to PDF.",
    icon: "FileText",
    status: "available",
    popular: true,
    recentlyAdded: true,
    privacyNotice: "Processed locally using client-side document parsers and docx engine.",
    tags: ["pdf to word", "word to pdf", "docx", "convert", "editable", "document"],
  },
  {
    id: "pdf-text-editor",
    name: "PDF Text & Annotation Editor",
    slug: "pdf-text-editor",
    category: "pdf",
    shortDescription: "Add text, signatures, and annotations onto any PDF.",
    description:
      "Click anywhere on a PDF page to overlay text, add signatures, insert timestamps, and download an updated PDF document instantly.",
    icon: "PenTool",
    status: "available",
    popular: true,
    recentlyAdded: true,
    privacyNotice: "Zero document telemetry. All signatures and text stay on your device.",
    tags: ["pdf editor", "sign pdf", "annotate", "add text", "stamp", "signature"],
  },
  {
    id: "audio-trimmer",
    name: "Audio Trimmer & Cutter",
    slug: "audio-trimmer",
    category: "media",
    shortDescription: "Cut and trim audio clips (MP3, WAV, OGG) with waveform preview.",
    description:
      "Precisely trim audio recordings, songs, and voice notes. Set custom start and end points with audio waveform playback and instant download.",
    icon: "Scissors",
    status: "available",
    popular: true,
    recentlyAdded: true,
    privacyNotice: "Decoded and sliced in browser memory using standard Web Audio APIs.",
    tags: ["audio", "trim", "cut", "mp3", "wav", "ringtone", "sound"],
  },
  {
    id: "audio-converter",
    name: "Audio Format Converter",
    slug: "audio-converter",
    category: "converter",
    shortDescription: "Convert audio between MP3, WAV, OGG, and AAC formats.",
    description:
      "Fast, high-fidelity audio conversion with sample rate adjustments and multi-format audio rendering.",
    icon: "Music",
    status: "available",
    popular: true,
    recentlyAdded: true,
    privacyNotice: "Processed 100% locally using HTML5 Web Audio rendering.",
    tags: ["audio", "converter", "mp3 to wav", "wav to mp3", "sound", "music"],
  },
  {
    id: "word-counter",
    name: "Word & Character Counter",
    slug: "word-counter",
    category: "utility",
    shortDescription: "Count words, characters, sentences, paragraphs, and reading time.",
    description:
      "A complete text analysis workstation with real-time statistics: character counts, word density, speaking time, reading time, and case transformations.",
    icon: "AlignLeft",
    status: "available",
    popular: true,
    recentlyAdded: true,
    privacyNotice: "Client-side text processing. No keystroke logging or cloud sync.",
    tags: ["word counter", "character count", "reading time", "text analyzer", "utility"],
  },
  {
    id: "url-shortener",
    name: "URL Shortener & QR Maker",
    slug: "url-shortener",
    category: "utility",
    shortDescription: "Generate clean short links and paired QR codes for any destination.",
    description:
      "Shorten lengthy links into concise URLs, generate matching high-resolution QR codes, and keep track of your short links locally.",
    icon: "Link2",
    status: "available",
    popular: true,
    recentlyAdded: true,
    privacyNotice: "Instant creation with local storage history.",
    tags: ["url shortener", "short link", "tinyurl", "bitly", "qr code", "utility"],
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

