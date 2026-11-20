"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Pipette,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Palette
} from "lucide-react";

export function ImageColorPicker() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<{
    hex: string;
    rgb: string;
    hsl: string;
  }>({
    hex: "#2563EB",
    rgb: "rgb(37, 99, 235)",
    hsl: "hsl(221, 83%, 53%)",
  });
  const [palette, setPalette] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>(["#2563EB"]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const [loupePos, setLoupePos] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load a default demo image on mount so the user has immediate visual feedback
  useEffect(() => {
    // Generate an attractive demo gradient pattern on a hidden canvas
    const demoCanvas = document.createElement("canvas");
    demoCanvas.width = 800;
    demoCanvas.height = 450;
    const ctx = demoCanvas.getContext("2d");
    if (ctx) {
      // Beautiful gradient
      const grad = ctx.createLinearGradient(0, 0, 800, 450);
      grad.addColorStop(0, "#3b82f6");
      grad.addColorStop(0.3, "#8b5cf6");
      grad.addColorStop(0.6, "#ec4899");
      grad.addColorStop(1, "#f59e0b");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 450);

      // Circles
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(200, 225, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(400, 225, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#06b6d4";
      ctx.beginPath();
      ctx.arc(600, 225, 60, 0, Math.PI * 2);
      ctx.fill();

      setImageSrc(demoCanvas.toDataURL());
    }
  }, []);

  // When imageSrc updates, draw to canvas and extract dominant palette
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 450;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      // Extract simple palette by sampling grid
      extractPalette(ctx, canvas.width, canvas.height);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const extractPalette = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const samples: string[] = [];
    const stepX = Math.floor(width / 5);
    const stepY = Math.floor(height / 4);

    for (let x = stepX / 2; x < width; x += stepX) {
      for (let y = stepY / 2; y < height; y += stepY) {
        const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
        const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
        if (!samples.includes(hex)) {
          samples.push(hex);
        }
      }
    }
    setPalette(samples.slice(0, 8));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setImageSrc(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Helper conversions
  const rgbToHex = (r: number, g: number, b: number) =>
    "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const setColorFromRgb = (r: number, g: number, b: number) => {
    const hex = rgbToHex(r, g, b);
    const rgb = `rgb(${r}, ${g}, ${b})`;
    const hsl = rgbToHsl(r, g, b);
    setSelectedColor({ hex, rgb, hsl });
    setHistory((prev) => [hex, ...prev.filter((c) => c !== hex)].slice(0, 8));
  };

  const setColorFromHex = (hex: string) => {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    setColorFromRgb(r, g, b);
  };

  // Mouse move on canvas for live color & loupe
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = Math.floor((e.clientX - rect.left) * scaleX);
    const canvasY = Math.floor((e.clientY - rect.top) * scaleY);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const pixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
      setHoverColor(hex);
      setLoupePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        visible: true,
      });
    } catch {
      // Ignored for bounds
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = Math.floor((e.clientX - rect.left) * scaleX);
    const canvasY = Math.floor((e.clientY - rect.top) * scaleY);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
    setColorFromRgb(pixel[0], pixel[1], pixel[2]);
  };

  // Native EyeDropper API (Chromium browsers)
  const openSystemEyeDropper = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ("EyeDropper" in window) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eyeDropper = new (window as any).EyeDropper();
        const res = await eyeDropper.open();
        if (res?.sRGBHex) {
          setColorFromHex(res.sRGBHex);
        }
      } catch {
        // User canceled eye dropper
      }
    } else {
      alert("System EyeDropper is supported in Chromium browsers (Chrome, Edge). You can click directly on the image below!");
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Canvas / Image Area (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          {/* Top toolbar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
              >
                <Upload className="h-3.5 w-3.5" /> Upload Image
              </button>
              <button
                onClick={openSystemEyeDropper}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                title="Pick from anywhere on screen"
              >
                <Pipette className="h-3.5 w-3.5 text-blue-600" /> Screen Eyedropper
              </button>
            </div>
            {hoverColor && (
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-700">
                <span
                  className="h-3.5 w-3.5 rounded-full border border-black/10 inline-block"
                  style={{ backgroundColor: hoverColor }}
                />
                {hoverColor}
              </div>
            )}
          </div>

          {/* Canvas container */}
          <div
            className="mt-4 relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center min-h-[360px] cursor-crosshair group"
            onMouseLeave={() => setLoupePos((prev) => ({ ...prev, visible: false }))}
          >
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onClick={handleCanvasClick}
              className="max-w-full max-h-[500px] object-contain rounded-xl select-none"
            />

            {/* Hover Loupe / Crosshair Tooltip */}
            {loupePos.visible && hoverColor && (
              <div
                className="pointer-events-none absolute z-20 flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-[130%]"
                style={{ left: loupePos.x, top: loupePos.y }}
              >
                <div
                  className="h-10 w-10 rounded-full border-2 border-white shadow-md ring-1 ring-black/20"
                  style={{ backgroundColor: hoverColor }}
                />
                <span className="bg-slate-900/90 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-sm">
                  {hoverColor}
                </span>
              </div>
            )}
          </div>

          <p className="mt-3 text-center text-xs text-slate-500">
            Hover over the image to preview, click anywhere to select the color.
          </p>

          {/* Palette extraction */}
          {palette.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-600 block mb-2 flex items-center gap-1.5">
                <Palette className="h-4 w-4 text-purple-600" /> Extracted Image Palette
              </span>
              <div className="flex flex-wrap gap-2">
                {palette.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setColorFromHex(color)}
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white transition-all text-xs font-mono"
                    title={`Select ${color}`}
                  >
                    <span
                      className="h-4 w-4 rounded-md border border-black/10 shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-slate-700">{color}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Selected Color & Format Details (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Big Color Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-3">
              Selected Color
            </span>

            {/* Color Swatch */}
            <div
              className="w-full h-32 rounded-2xl border border-black/10 shadow-inner flex items-end justify-end p-3 transition-colors"
              style={{ backgroundColor: selectedColor.hex }}
            >
              <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-mono font-bold px-2.5 py-1 rounded-lg shadow-2xs">
                {selectedColor.hex}
              </span>
            </div>

            {/* Format Rows */}
            <div className="mt-5 space-y-2.5">
              {/* HEX */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">HEX</span>
                  <span className="font-mono text-sm font-bold text-slate-800">{selectedColor.hex}</span>
                </div>
                <button
                  onClick={() => copyText(selectedColor.hex, "hex")}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 shadow-2xs transition-colors"
                  title="Copy HEX"
                >
                  {copiedKey === "hex" ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {/* RGB */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">RGB</span>
                  <span className="font-mono text-sm font-bold text-slate-800">{selectedColor.rgb}</span>
                </div>
                <button
                  onClick={() => copyText(selectedColor.rgb, "rgb")}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 shadow-2xs transition-colors"
                  title="Copy RGB"
                >
                  {copiedKey === "rgb" ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {/* HSL */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">HSL</span>
                  <span className="font-mono text-sm font-bold text-slate-800">{selectedColor.hsl}</span>
                </div>
                <button
                  onClick={() => copyText(selectedColor.hsl, "hsl")}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 shadow-2xs transition-colors"
                  title="Copy HSL"
                >
                  {copiedKey === "hsl" ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Color History */}
          {history.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-3">
                Picked Colors History
              </span>
              <div className="flex flex-wrap gap-2">
                {history.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setColorFromHex(c)}
                    className="h-8 w-8 rounded-xl border border-black/10 hover:scale-110 shadow-2xs transition-transform"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
