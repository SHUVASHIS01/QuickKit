"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, ArrowRightLeft, Download, AlertCircle } from "lucide-react";
import { FileDropzone } from "@/components/tool/FileDropzone";

export function Base64Converter() {
  const [tab, setTab] = useState<"text" | "file">("text");
  const [direction, setDirection] = useState<"encode" | "decode">("encode");
  
  // Text state
  const [inputStr, setInputStr] = useState("Hello from QuickKit! Everything you need. Nothing you don't.");
  const [copied, setCopied] = useState(false);

  // File state
  const [fileResult, setFileResult] = useState<{
    fileName: string;
    fileSize: number;
    base64: string;
  } | null>(null);

  // Safe utf-8 text encoding
  const encodeText = (str: string) => {
    try {
      const bytes = new TextEncoder().encode(str);
      const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
      return btoa(binString);
    } catch {
      throw new Error("Unable to encode text to Base64");
    }
  };

  // Safe utf-8 text decoding
  const decodeText = (b64: string) => {
    try {
      const binString = atob(b64.trim());
      const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    } catch {
      throw new Error("Invalid Base64 string. Please check the input formatting.");
    }
  };

  const { outputStr, error } = useMemo(() => {
    if (!inputStr.trim()) {
      return { outputStr: "", error: null };
    }
    try {
      if (direction === "encode") {
        return { outputStr: encodeText(inputStr), error: null };
      } else {
        return { outputStr: decodeText(inputStr), error: null };
      }
    } catch (err: unknown) {
      return {
        outputStr: "",
        error: err instanceof Error ? err.message : "Conversion error",
      };
    }
  }, [inputStr, direction]);

  const handleSwap = () => {
    if (outputStr && !error) {
      setInputStr(outputStr);
      setDirection((prev) => (prev === "encode" ? "decode" : "encode"));
    } else {
      setDirection((prev) => (prev === "encode" ? "decode" : "encode"));
    }
  };

  const handleCopy = () => {
    if (!outputStr) return;
    navigator.clipboard.writeText(outputStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setFileResult({
        fileName: file.name,
        fileSize: file.size,
        base64: b64,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 mb-6 gap-6">
        <button
          onClick={() => setTab("text")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            tab === "text"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Text Converter
        </button>
        <button
          onClick={() => setTab("file")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            tab === "file"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          File to Base64 (Data URI)
        </button>
      </div>

      {tab === "text" ? (
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Mode:
              </span>
              <button
                onClick={() => setDirection("encode")}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  direction === "encode"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Encode (Text → Base64)
              </button>
              <button
                onClick={() => setDirection("decode")}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  direction === "decode"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Decode (Base64 → Text)
              </button>
            </div>

            <button
              onClick={handleSwap}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" /> Swap
            </button>
          </div>

          {/* Text Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 border-b border-slate-100 pb-2">
                <span>{direction === "encode" ? "Plain Text Input" : "Base64 String Input"}</span>
                <span>{inputStr.length} chars</span>
              </div>
              <textarea
                rows={10}
                value={inputStr}
                onChange={(e) => setInputStr(e.target.value)}
                placeholder={
                  direction === "encode"
                    ? "Type or paste text to encode..."
                    : "Paste base64 string to decode..."
                }
                className="w-full resize-none border-0 p-0 text-sm font-mono text-slate-900 focus:outline-hidden placeholder:text-slate-400"
              />
            </div>

            {/* Output */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 border-b border-slate-200/80 pb-2">
                <span>{direction === "encode" ? "Base64 Output" : "Decoded Text Output"}</span>
                {outputStr && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy
                      </>
                    )}
                  </button>
                )}
              </div>

              {error ? (
                <div className="flex items-center gap-2 py-4 text-xs text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : (
                <textarea
                  readOnly
                  rows={10}
                  value={outputStr}
                  placeholder="Output will appear here instantly..."
                  className="w-full resize-none border-0 bg-transparent p-0 text-sm font-mono text-slate-900 focus:outline-hidden placeholder:text-slate-400"
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* File Mode */
        <div className="space-y-6">
          <FileDropzone
            onFilesSelected={handleFileUpload}
            label="Drop any file or image here to encode to Base64"
            hint="Supports images, fonts, documents, and assets up to 10MB."
            maxSizeMB={10}
          />

          {fileResult && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {fileResult.fileName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Encoded size: ~{Math.round(fileResult.base64.length / 1024)} KB
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(fileResult.base64);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    Copy Data URI
                  </button>

                  <a
                    href={fileResult.base64}
                    download={`encoded-${fileResult.fileName}.txt`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    <Download className="h-3.5 w-3.5" /> Download TXT
                  </a>
                </div>
              </div>

              <textarea
                readOnly
                rows={8}
                value={fileResult.base64}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700 focus:outline-hidden"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

