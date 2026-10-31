# QuickKit — Project Documentation & Update Log

> **Tagline:** Everything you need. Nothing you don't.  
> **Repository:** [https://github.com/SHUVASHIS01/QuickKit.git](https://github.com/SHUVASHIS01/QuickKit.git)  
> **Status:** Production-Ready Foundation & Functional Core Tools (Phase 1 to Phase 6 Complete)

---

## 1. Overview
**QuickKit** is a free, global, minimal online tools platform designed to provide fast, privacy-first everyday utilities. Unlike traditional web tools bloated with invasive banner ads, paywalls, and mandatory user registrations, QuickKit executes file and data processing directly inside the user's browser memory using modern web standards (HTML5 Canvas, Web APIs, and client-side libraries).

---

## 2. Tech Stack & Design System
- **Framework:** Next.js (App Router, Turbopack, React 19, TypeScript)
- **Styling:** Tailwind CSS v4 with DaisyUI 5
- **Icons:** Lucide React
- **Validation & Types:** Zod, TypeScript Strict Mode
- **PDF Engine:** `pdf-lib` (100% in-browser manipulation)
- **QR Code Engine:** `qrcode`
- **Design Tokens:**
  - Background: Pure White (`#FFFFFF`)
  - Subtle Surface: Slate-50 (`#F8FAFC`)
  - Primary Brand Blue: `#2563EB` (Hover: `#1D4ED8`)
  - Primary Text: Slate-900 (`#0F172A`)
  - Muted Text: Slate-500 (`#64748B`)
  - Borders: Slate-200 (`#E2E8F0`)
  - Typography: Inter font with responsive scaling
  - Radii: 10–14px rounded borders with subtle elevation shadows

---

## 3. Architecture & Directory Layout

```
QuickKit/
├── public/                 # Static assets and icons
├── src/
│   ├── app/                # Next.js App Router pages & metadata
│   │   ├── layout.tsx      # Root layout with Inter font, Navbar, and Footer
│   │   ├── page.tsx        # Homepage (Hero with live search + sections)
│   │   ├── sitemap.ts      # Automated XML sitemap generation
│   │   ├── robots.ts       # Automated robots.txt rules
│   │   ├── about/          # About page
│   │   ├── privacy/        # Privacy policy page
│   │   ├── terms/          # Terms of service page
│   │   │
│   │   │── Tool Routes:
│   │   ├── qr-generator/           # /qr-generator
│   │   ├── json-formatter/         # /json-formatter
│   │   ├── base64-converter/       # /base64-converter
│   │   ├── image-compressor/       # /image-compressor
│   │   ├── image-converter/        # /image-converter
│   │   ├── image-resizer/          # /image-resizer
│   │   ├── pdf-merger/             # /pdf-merger
│   │   ├── pdf-splitter/           # /pdf-splitter (Coming Soon)
│   │   ├── video-to-gif/           # /video-to-gif (Coming Soon)
│   │   └── pinterest-downloader/   # /pinterest-downloader (Coming Soon)
│   │
│   ├── components/         # Shared UI Components
│   │   ├── home/           # Homepage Hero and dynamic sections
│   │   │   ├── HomeHero.tsx        # Interactive hero with live filterable search
│   │   │   └── HomeSections.tsx    # Popular, Categories, Value props, FAQs
│   │   ├── layout/         # Layout components
│   │   │   ├── Navbar.tsx          # Responsive navbar with search modal (⌘K)
│   │   │   └── Footer.tsx          # Clean footer with site links
│   │   ├── tool/           # Reusable Tool UI System
│   │   │   ├── ToolCard.tsx        # Registry-driven tool card
│   │   │   ├── ToolPageHeader.tsx  # Consistent tool header with privacy badge
│   │   │   ├── FileDropzone.tsx    # Accessible drag-and-drop zone
│   │   │   ├── FileList.tsx        # Uploaded file management
│   │   │   ├── ToolSettings.tsx    # Uniform settings container
│   │   │   ├── ProcessingProgress.tsx # Progress state indicator
│   │   │   ├── ResultPreview.tsx   # Side-by-side results and savings counter
│   │   │   ├── DownloadButton.tsx  # Standard download trigger
│   │   │   ├── ErrorMessage.tsx    # Accessible error notification
│   │   │   └── ComingSoonTool.tsx  # Honest roadmap & notification form
│   │   └── ui/             # Atomic components
│   │       └── DynamicIcon.tsx     # Safe Lucide dynamic icon resolver
│   │
│   ├── config/             # Central Registries & Configuration
│   │   ├── site.ts         # Site metadata, navigation, FAQ items, value props
│   │   └── tools.ts        # Single source of truth for all tools & categories
│   │
│   ├── features/           # Isolated Tool Implementations
│   │   ├── qr-generator/           # QR code generation with custom styles
│   │   ├── json-formatter/         # Prettify, minify, validate, line counters
│   │   ├── base64-converter/       # Dual text & binary file encoder/decoder
│   │   ├── image-compressor/       # Canvas-based client-side compression
│   │   ├── image-converter/        # PNG/JPG/WebP format transformer
│   │   ├── image-resizer/          # Pixel & ratio scaler with presets
│   │   └── pdf-merger/             # Browser-side multi-PDF merger
│   │
│   ├── lib/                # Shared utilities (classnames, formatBytes)
│   └── types/              # TypeScript definitions for tools and files
```

---

## 4. Implemented Features & Verification

### Phase 1 — Project Foundation
- Initialized Next.js 16 with TypeScript and App Router.
- Configured Tailwind CSS v4 alongside DaisyUI 5.
- Established strict ESLint 9 configuration (0 errors, 0 warnings).
- Reusable design tokens configured in `globals.css` and `@theme`.

### Phase 2 — Homepage
- **Navbar:** Sticky navigation with QuickKit branding, quick navigation links, mobile sheet menu, GitHub repository link, and modal search with keyboard navigation (`⌘K`).
- **Hero Section:** Value headline, real-time live search filter, and category pills that filter tools without full-page reloads.
- **Popular Tools Grid:** Registry-driven cards with dynamic icons, popularity pills, and hover elevation.
- **Browse by Category:** Image, PDF, Developer, Media, Converter, and Utility groupings with tool counts.
- **Why QuickKit:** 4 value pillars highlighting client-side privacy, free access, blazing speed, and minimal distraction.
- **Recently Added Tools:** Highlights new releases directly from registry metadata.
- **FAQ Accordion:** Interactive collapsible FAQ addressing privacy, pricing, and architecture.
- **Footer:** Links to tools, about, privacy, terms, and copyright.

### Phase 3 — Typed Central Tool Registry (`src/config/tools.ts`)
- Centralized database of all tools.
- Helper methods: `getToolBySlug()`, `getToolsByCategory()`, `getPopularTools()`, `getRecentTools()`, `searchTools()`.

### Phase 4 — Reusable Tool UI Architecture
- Created 9 modular components in `src/components/tool/` allowing rapid addition of new tools with zero UI duplication.

### Phase 5 — Functional Tools & Initial Routes
1. **QR Code Generator (`/qr-generator`):** URL, Plain Text, and Wi-Fi modes (WPA/WEP), custom foreground/background colors, error correction levels (L, M, Q, H), margin slider, live preview, PNG download, and copy to clipboard.
2. **JSON Formatter & Validator (`/json-formatter`):** Prettify with 2-space, 4-space, or tab indents, Minify mode, syntax error line detection, live char/line counters, sample JSON loader, copy, and file download.
3. **Base64 Converter (`/base64-converter`):** Text encode/decode with UTF-8 support, File to Base64 data URI mode, instant swap, copy, and text file export.
4. **Image Compressor (`/image-compressor`):** Client-side image compression using HTML5 Canvas, quality control (10–95%), max width scaling, live calculation of file size savings (%), and instant download.
5. **Image Converter (`/image-converter`):** Convert between WebP, PNG, and JPEG with quality adjustments and background fill handling.
6. **Image Resizer (`/image-resizer`):** Pixel width/height resizing, aspect ratio locking, social media presets (1080p, 720p, 1:1 square, avatar).
7. **PDF Merger (`/pdf-merger`):** Merge multiple PDF documents locally using `pdf-lib`, drag/drop, item reordering (move up/down), total size calculator, and client-side merge.
8. **PDF Splitter (`/pdf-splitter`):** Extract specific page ranges (e.g. `1-3, 5`) into a single PDF or extract every page separately and bundle into a clean `.zip` using `pdf-lib` + `JSZip` (100% in-browser).
9. **Video to GIF (`/video-to-gif`):** Upload MP4, WebM, or MOV video clips, adjust start offset, clip duration (1-8s), frame rate (5-15 FPS), resolution (320px-640px), and render animated GIFs in the browser with live frame-by-frame progress using `gifenc`.
10. **Pinterest Downloader (`/pinterest-downloader`):** Paste any public Pinterest pin link or shortlink (`pin.it`). Resolves the highest resolution original image or direct video asset via server-side redirect resolver with instant download and direct CDN link options.

### Phase 6 — Quality & Production Build
- `sitemap.ts` and `robots.ts` configured for search engine indexing.
- Next.js production build (`npm run build`) runs cleanly and prerenders all 19 routes statically.
- ESLint check (`npm run lint`) passes with 0 errors and 0 warnings.

---

## 5. Development & Build Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run ESLint check
npm run lint

# Compile production build
npm run build

# Start production server
npm run start
```

---

## 6. Next Steps & Planned Enhancements
- [ ] Add PDF Splitter using `pdf-lib` (extract individual pages or ranges).
- [ ] Implement client-side video frame capture to GIF using Web Workers.
- [ ] Add dark mode toggle switcher in Navbar using Tailwind/DaisyUI themes.
- [ ] Add offline support via Service Worker / PWA capabilities.

