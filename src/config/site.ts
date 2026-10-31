export const SITE_CONFIG = {
  name: "QuickKit",
  tagline: "Everything you need. Nothing you don't.",
  description:
    "A free, fast, and minimal online tools platform. Process images, PDFs, developer utilities, and media securely right inside your browser without accounts or limits.",
  url: "https://quickkit.vercel.app",
  author: "QuickKit Team",
  github: "https://github.com/SHUVASHIS01/QuickKit.git",
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Popular Tools", href: "/#popular" },
    { label: "Categories", href: "/#categories" },
    { label: "Why QuickKit", href: "/#why-us" },
    { label: "FAQ", href: "/#faq" },
  ],
  footerLinks: {
    tools: [
      { label: "Image Compressor", href: "/image-compressor" },
      { label: "QR Code Generator", href: "/qr-generator" },
      { label: "JSON Formatter", href: "/json-formatter" },
      { label: "PDF Merger", href: "/pdf-merger" },
      { label: "Base64 Converter", href: "/base64-converter" },
    ],
    company: [
      { label: "About QuickKit", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "GitHub Repository", href: "https://github.com/SHUVASHIS01/QuickKit.git" },
    ],
  },
  valueProps: [
    {
      title: "100% Free & Unlimited",
      description: "No paywalls, no mandatory signups, and no artificial restrictions. Use all our core tools without limits.",
      icon: "Sparkles",
    },
    {
      title: "Privacy by Design",
      description: "Client-side processing keeps your sensitive files, photos, and confidential documents on your own device.",
      icon: "ShieldCheck",
    },
    {
      title: "Blazing Fast Execution",
      description: "Instant results powered by modern browser APIs, Canvas, WebAssembly, and local workers without network lag.",
      icon: "Zap",
    },
    {
      title: "Clean & Distraction-Free",
      description: "A minimal, uncluttered workspace designed for focus. Zero intrusive ads, popups, or confusing buttons.",
      icon: "LayoutGrid",
    },
  ],
  faqs: [
    {
      question: "Is QuickKit really completely free to use?",
      answer:
        "Yes, 100%. All core utilities on QuickKit are free, without any hidden subscriptions, credit requirements, or surprise paywalls.",
    },
    {
      question: "Are my files uploaded or stored on your servers?",
      answer:
        "No. QuickKit is built around a privacy-first architecture. Client-side tools (like the QR Generator, JSON Formatter, Base64 Converter, Image Compressor, and PDF Merger) execute in your browser's local memory. Your files never leave your device.",
    },
    {
      question: "Do I need to create an account or sign in?",
      answer:
        "No account is required. You can jump directly into any tool and start working immediately without handing over your email or personal data.",
    },
    {
      question: "Can I use QuickKit on mobile devices?",
      answer:
        "Yes, QuickKit is built with a responsive mobile-first design that functions smoothly across smartphones, tablets, laptops, and desktops.",
    },
    {
      question: "How can I contribute or report a bug?",
      answer:
        "QuickKit is an open project! You can check out our repository at GitHub, report issues, or suggest new tool ideas through our contact and GitHub links.",
    },
  ],
};

