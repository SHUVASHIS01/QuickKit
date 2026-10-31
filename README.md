# QuickKit

> **Everything you need. Nothing you don't.**  
> A free, global, minimal online tools platform.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-v5-570DF8?style=flat&logo=daisyui)](https://daisyui.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

- **Privacy-First Architecture:** Files and sensitive data remain strictly in your browser's local memory. No remote uploads or cloud tracking.
- **100% Free & Unlimited:** No credit card, no subscription, and no mandatory registration.
- **Minimal, Distraction-Free UI:** Clean white surfaces, subtle borders, Inter typography, and zero intrusive ads.
- **Blazing Fast Performance:** Powered by Next.js App Router, Turbopack, HTML5 Canvas, and modern Web APIs.
- **Central Tool Registry:** Strongly-typed registry generating homepage listings, search results, and navigation links.

---

## 🛠️ Included Tools

| Tool | Route | Status | Processing |
| :--- | :--- | :---: | :---: |
| **QR Code Generator** | `/qr-generator` | ✅ Live | Browser / Canvas |
| **JSON Formatter & Validator** | `/json-formatter` | ✅ Live | In-Memory |
| **Base64 Converter** | `/base64-converter` | ✅ Live | In-Memory (Text & Files) |
| **Image Compressor** | `/image-compressor` | ✅ Live | Browser Canvas |
| **Image Format Converter** | `/image-converter` | ✅ Live | Browser Canvas |
| **Image Resizer** | `/image-resizer` | ✅ Live | Browser Canvas |
| **PDF Merger** | `/pdf-merger` | ✅ Live | Browser `pdf-lib` |
| **PDF Splitter** | `/pdf-splitter` | ⏳ Coming Soon | Client-side Planned |
| **Video to GIF** | `/video-to-gif` | ⏳ Coming Soon | WebAssembly / Workers |
| **Pinterest Downloader** | `/pinterest-downloader` | ⏳ Coming Soon | Planned |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.18+` or `v20+` (Tested on `v24`)
- npm `v9+`

### Installation
```bash
# Clone the repository
git clone https://github.com/SHUVASHIS01/QuickKit.git
cd QuickKit

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Available Scripts
- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run build`: Generates the static production build.
- `npm run start`: Runs the built production application.
- `npm run lint`: Runs ESLint checks.

---

## 📖 Detailed Documentation
For an architectural breakdown and phase-by-phase implementation log, please refer to [`PROJECT_UPDATES.md`](./PROJECT_UPDATES.md).

---

## 📄 License
Open source and released under the [MIT License](LICENSE).
