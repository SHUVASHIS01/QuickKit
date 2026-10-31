"use client";

import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { DownloadButton } from "@/components/tool/DownloadButton";
import { Copy, Check, QrCode as QrIcon, Wifi, Type, Link as LinkIcon } from "lucide-react";

export function QrGenerator() {
  const [mode, setMode] = useState<"text" | "url" | "wifi">("url");
  const [content, setContent] = useState("https://quickkit.vercel.app");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState<"WPA" | "WEP" | "nopass">("WPA");

  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#FFFFFF");
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [margin, setMargin] = useState(2);

  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let active = true;
    const raw =
      mode === "wifi"
        ? `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`
        : content;

    if (!raw.trim()) {
      return;
    }

    QRCode.toDataURL(raw, {
      width: 400,
      margin: margin,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel: errorLevel,
    })
      .then((url) => {
        if (active) {
          setDataUrl(url);
        }
      })
      .catch((err) => {
        console.error("QR generation error", err);
      });

    return () => {
      active = false;
    };
  }, [content, wifiSsid, wifiPassword, wifiEncryption, mode, darkColor, lightColor, errorLevel, margin]);

  const hasContent = mode === "wifi" ? Boolean(wifiSsid.trim()) : Boolean(content.trim());
  const activeDataUrl = hasContent ? dataUrl : "";

  const handleCopy = async () => {
    if (!activeDataUrl) return;
    try {
      const res = await fetch(activeDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const rawText =
        mode === "wifi"
          ? `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`
          : content;
      navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form / Settings */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mode Selector */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => {
                setMode("url");
                if (!content.startsWith("http")) setContent("https://");
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                mode === "url"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LinkIcon className="h-3.5 w-3.5" /> URL Link
            </button>
            <button
              onClick={() => setMode("text")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                mode === "text"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Type className="h-3.5 w-3.5" /> Plain Text
            </button>
            <button
              onClick={() => setMode("wifi")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                mode === "wifi"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Wifi className="h-3.5 w-3.5" /> Wi-Fi Network
            </button>
          </div>

          {/* Content Inputs */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">QR Code Content</h3>

            {mode === "url" && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target Website URL
                </label>
                <input
                  type="url"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {mode === "text" && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Text Content
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter any note, message, or numbers..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {mode === "wifi" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="MyHomeWiFi"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Network password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Security Encryption
                  </label>
                  <select
                    value={wifiEncryption}
                    onChange={(e) =>
                      setWifiEncryption(e.target.value as "WPA" | "WEP" | "nopass")
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="WPA">WPA / WPA2 (Recommended)</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None (Open Network)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Customization Options */}
          <ToolSettings title="Appearance & Quality">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Foreground Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border border-slate-200 bg-transparent p-0"
                  />
                  <span className="text-xs font-mono text-slate-600 uppercase">
                    {darkColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border border-slate-200 bg-transparent p-0"
                  />
                  <span className="text-xs font-mono text-slate-600 uppercase">
                    {lightColor}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Error Correction Level
                </label>
                <select
                  value={errorLevel}
                  onChange={(e) => setErrorLevel(e.target.value as "L" | "M" | "Q" | "H")}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 focus:bg-white"
                >
                  <option value="L">Low (~7% recovery)</option>
                  <option value="M">Medium (~15% recovery)</option>
                  <option value="Q">Quartile (~25% recovery)</option>
                  <option value="H">High (~30% recovery)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Quiet Zone Margin ({margin})
                </label>
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </ToolSettings>
        </div>

        {/* Right Preview & Download Card */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-6 text-center">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center justify-center gap-1.5">
              <QrIcon className="h-4 w-4 text-blue-600" />
              Live QR Preview
            </h3>

            <div className="flex justify-center p-6 bg-slate-50/60 rounded-xl border border-slate-100 min-h-[260px] items-center">
              {activeDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeDataUrl}
                  alt="Generated QR Code"
                  className="max-h-56 max-w-56 rounded-lg shadow-2xs border border-slate-200/60"
                />
              ) : (
                <div className="text-xs text-slate-400">
                  Enter content on the left to generate QR
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="space-y-2.5">
              <DownloadButton
                href={activeDataUrl}
                download="quickkit-qrcode.png"
                label="Download PNG Image"
                className="w-full"
                disabled={!activeDataUrl}
              />

              <button
                onClick={handleCopy}
                disabled={!activeDataUrl}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy Image to Clipboard
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              High resolution raster graphic. Free for commercial or personal use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

