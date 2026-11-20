import type { Metadata } from "next";
import { ToolItem } from "@/types";
import { SITE_CONFIG } from "@/config/site";

const OG_IMAGE = {
  url: "/og-image.svg",
  width: 1200,
  height: 630,
  alt: "QuickKit — Free Online Tools",
};

/**
 * Tool-specific SEO overrides: optimized title + description + extra keywords.
 */
const TOOL_SEO: Record<
  string,
  { title: string; description: string; keywords?: string[] }
> = {
  "qr-generator": {
    title: "Free QR Code Generator — Custom Colors, PNG & SVG Download",
    description:
      "Generate high-resolution customized QR codes for URLs, WiFi, text, and contact cards. Choose colors, margins, and error correction. Download PNG or SVG instantly — no signup.",
    keywords: ["qr code generator", "free qr code", "wifi qr code", "url qr code", "svg qr code"],
  },
  "json-formatter": {
    title: "JSON Formatter & Validator — Beautify, Minify & Debug Online",
    description:
      "Format, beautify, minify, and validate JSON data instantly in your browser. Spot syntax errors, collapse nodes, and copy clean output — 100% private, no server uploads.",
    keywords: ["json formatter", "json validator", "json beautifier", "json minifier", "json parser"],
  },
  "base64-converter": {
    title: "Base64 Encoder & Decoder — Text and File Conversion",
    description:
      "Encode text strings or binary files to Base64, or decode Base64 back to plain text or downloadable files. Fully client-side, secure, and instant.",
    keywords: ["base64 encoder", "base64 decoder", "base64 file", "encode decode", "binary to text"],
  },
  "image-compressor": {
    title: "Image Compressor — Reduce JPG, PNG & WebP Size Free",
    description:
      "Compress JPG, PNG, and WebP images by up to 80% without visible quality loss. Perfect for web optimization, faster loading, and email attachments. No upload required.",
    keywords: ["image compressor", "compress jpg", "compress png", "reduce image size", "webp compressor"],
  },
  "image-converter": {
    title: "Image Format Converter — JPG to PNG, WebP & More Online",
    description:
      "Convert between JPG, PNG, WebP, and AVIF formats in batches. Adjust output quality, preserve transparency, and download directly — all in your browser.",
    keywords: ["image converter", "jpg to png", "png to webp", "webp converter", "avif converter"],
  },
  "image-resizer": {
    title: "Image Resizer — Resize Photos Online Free, No Upload",
    description:
      "Resize images to exact pixel dimensions or percentage scale. Lock aspect ratio, use social media presets (Instagram, Twitter, YouTube), and batch resize locally.",
    keywords: ["image resizer", "resize photo online", "resize image free", "photo resizer", "crop image"],
  },
  "image-upscaler": {
    title: "AI Image Upscaler — 2x & 4x Resolution Enhancement Free",
    description:
      "Upscale images 2x or 4x with bicubic interpolation, unsharp masking, and contrast restoration. Enhance low-resolution photos without uploading to any server.",
    keywords: ["image upscaler", "upscale photo", "ai upscaler free", "enhance image resolution", "super resolution"],
  },
  "pdf-merger": {
    title: "PDF Merger — Combine Multiple PDFs Online Free",
    description:
      "Drag, drop, and reorder PDF files then merge them into one document in seconds. All processing happens in your browser with pdf-lib — your documents stay private.",
    keywords: ["pdf merger", "combine pdf", "merge pdf files", "join pdf", "pdf combiner"],
  },
  "pdf-splitter": {
    title: "PDF Splitter — Extract Pages & Split PDF Files Free",
    description:
      "Split PDF documents by page range or extract each page as a separate PDF file. Zip download support and zero server uploads — fast, free, and private.",
    keywords: ["pdf splitter", "split pdf", "extract pdf pages", "pdf page extractor", "separate pdf"],
  },
  "pdf-compressor": {
    title: "PDF Compressor — Reduce PDF File Size Online Free",
    description:
      "Compress large PDF files, strip unnecessary metadata, and optimize document streams directly on your device. Reduce PDF size without compromising readability.",
    keywords: ["pdf compressor", "compress pdf", "reduce pdf size", "shrink pdf", "optimize pdf"],
  },
  "pdf-to-jpg": {
    title: "PDF to JPG Converter — High-Resolution Page Images Free",
    description:
      "Convert PDF pages to crisp JPG or PNG images with batch ZIP download. Render any PDF document as high-resolution images — all locally in your browser.",
    keywords: ["pdf to jpg", "pdf to image", "pdf to png", "convert pdf pages", "rasterize pdf"],
  },
  "pdf-to-word": {
    title: "PDF to Word Converter — Convert & Edit PDF Documents Free",
    description:
      "Extract structured text and formatting from PDFs into editable Word (.docx) documents. Convert Word to PDF too. Client-side processing, no cloud upload.",
    keywords: ["pdf to word", "pdf to docx", "word to pdf", "convert pdf editable", "pdf editor"],
  },
  "pdf-text-editor": {
    title: "PDF Text Editor — Add Text, Signatures & Stamps Online",
    description:
      "Click anywhere on a PDF page to overlay text, add digital signatures, insert timestamps, and annotate documents. Download the updated PDF instantly.",
    keywords: ["pdf text editor", "sign pdf online", "annotate pdf", "add text to pdf", "pdf signature"],
  },
  "audio-trimmer": {
    title: "Audio Trimmer & Cutter — Trim MP3, WAV Online Free",
    description:
      "Precisely cut and trim audio recordings, music, and voice notes. Set custom start/end points with waveform preview, then download your trimmed clip instantly.",
    keywords: ["audio trimmer", "mp3 cutter", "trim audio online", "wav cutter", "ringtone maker"],
  },
  "audio-converter": {
    title: "Audio Format Converter — Convert MP3, WAV, OGG Free",
    description:
      "Convert audio files between MP3, WAV, OGG, and AAC formats with sample rate adjustments. Fast, high-fidelity conversion using HTML5 Web Audio — no server uploads.",
    keywords: ["audio converter", "mp3 to wav", "wav to mp3", "ogg converter", "aac converter"],
  },
  "video-to-gif": {
    title: "Video to GIF Converter — Make Animated GIFs Free Online",
    description:
      "Turn MP4, WebM, or MOV clips into optimized loopable GIFs. Set duration, frame rate, and dimensions. Create shareable animations entirely in your browser.",
    keywords: ["video to gif", "mp4 to gif", "make gif from video", "gif maker online", "animated gif"],
  },
  "word-counter": {
    title: "Word & Character Counter — Free Online Text Analyzer",
    description:
      "Count words, characters, sentences, and paragraphs in real time. Get reading time, speaking time, keyword density, and perform case transformations instantly.",
    keywords: ["word counter", "character counter", "text analyzer", "reading time calculator", "sentence counter"],
  },
  "url-shortener": {
    title: "URL Shortener & QR Code Maker — Free Short Links",
    description:
      "Shorten long URLs into concise links and generate matching high-resolution QR codes. Track your short links in local history — no account or server needed.",
    keywords: ["url shortener", "link shortener", "free url shortener", "short link generator", "tiny url"],
  },
  "pinterest-downloader": {
    title: "Pinterest Video & Image Downloader — Free Download",
    description:
      "Paste any public Pinterest pin URL to extract and download the original high-resolution photo or video. Fast, direct download without login or tracking.",
    keywords: ["pinterest downloader", "download pinterest video", "pinterest image downloader", "save pinterest", "pin downloader"],
  },
  "currency-converter": {
    title: "Currency Converter — 160+ Currencies, Live Exchange Rates",
    description:
      "Convert between 160+ world currencies with real-time exchange rates. Multi-currency overview, offline benchmark rates, and instant calculation — no account needed.",
    keywords: ["currency converter", "exchange rate", "usd to bdt", "live currency", "money converter"],
  },
  "password-generator": {
    title: "Password Generator — Strong, Random & Secure Passwords Free",
    description:
      "Generate cryptographically secure random passwords, memorable passphrases, or PINs. Customize length, numbers, and symbols. 100% private, client-side.",
    keywords: ["password generator", "random password", "secure password", "strong password generator", "pin generator"],
  },
  "percentage-calculator": {
    title: "Percentage Calculator — Fast Percent, Discount & Tax Calculation",
    description:
      "Free online percentage calculator. Calculate percentage of a number, percentage change, discounts, sales tax, and tips with instant live results.",
    keywords: ["percentage calculator", "calculate percentage", "percent change calculator", "discount calculator", "tax calculator"],
  },
  "case-converter": {
    title: "Case Converter — UPPERCASE, lowercase, Title Case & camelCase",
    description:
      "Convert text case between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case instantly in your browser.",
    keywords: ["case converter", "text case converter", "uppercase to lowercase", "title case converter", "camelcase converter"],
  },
  "text-repeater": {
    title: "Text Repeater — Repeat Words, Sentences & Messages 10,000x",
    description:
      "Repeat any text, message, or emoji up to 10,000 times with custom line breaks or separators. 1-click copy to clipboard and text file download.",
    keywords: ["text repeater", "repeat text", "repeat text 100 times", "sorry repeater", "message repeater online"],
  },
  "image-color-picker": {
    title: "Image Color Picker — Extract HEX, RGB, HSL & Palettes Online",
    description:
      "Pick colors from any image with an interactive magnifying loupe. Extract dominant color palettes and copy HEX, RGB, and HSL codes instantly.",
    keywords: ["image color picker", "eyedropper online", "hex color from image", "image palette generator", "rgb color picker"],
  },
  "heic-to-jpg": {
    title: "HEIC to JPG Converter — Convert Apple iPhone Photos Online Free",
    description:
      "Convert Apple HEIC and HEIF photos to high-quality JPG or PNG images directly in your browser. Batch conversion and ZIP download supported — no upload.",
    keywords: ["heic to jpg", "heic to png", "convert heic to jpg", "iphone photo converter", "heif to jpg"],
  },
  "typing-speed-test": {
    title: "Typing Speed Test — Test Your WPM & Accuracy Online Free",
    description:
      "Check your typing speed (WPM) and accuracy in 15, 30, or 60-second typing tests. Real-time feedback, detailed keystroke breakdown, and score summary.",
    keywords: ["typing speed test", "typing test", "wpm test", "typing practice", "keyboard speed test"],
  },
};

/**
 * Generate full SEO metadata for a tool page.
 */
export function generateToolMetadata(tool: ToolItem): Metadata {
  const seo = TOOL_SEO[tool.slug] ?? {
    title: tool.name,
    description: tool.description,
    keywords: tool.tags,
  };

  const canonicalUrl = `${SITE_CONFIG.url}/${tool.slug}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: [
      ...(seo.keywords ?? tool.tags),
      "free online tool",
      "no upload",
      "browser tool",
      "quickkit",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: `${seo.title} | QuickKit`,
      description: seo.description,
      siteName: SITE_CONFIG.name,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.title} | QuickKit`,
      description: seo.description,
      images: [OG_IMAGE.url],
    },
  };
}
