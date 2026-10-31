"use client";

import React, { useState } from "react";
import { FileDropzone } from "@/components/tool/FileDropzone";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { ErrorMessage } from "@/components/tool/ErrorMessage";
import { formatBytes } from "@/lib/utils";
import { Download, Loader2, RefreshCw, CheckCircle2 } from "lucide-react";

export function AudioConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<"wav" | "ogg">("wav");
  const [sampleRate, setSampleRate] = useState<number>(44100);

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (!selected.type.startsWith("audio/") && !selected.name.match(/\.(mp3|wav|ogg|aac|m4a|flac)$/i)) {
      setError("Please select a valid audio file.");
      return;
    }

    setFile(selected);
    setResultBlob(null);
    setResultUrl(null);
    setError(null);
    convertAudio(selected, targetFormat, sampleRate);
  };

  const bufferToWave = (abuffer: AudioBuffer) => {
    const numOfChan = abuffer.numberOfChannels;
    const length = abuffer.length * numOfChan * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));
    const channels = [];
    let offset = 0;
    let pos = 0;

    function setUint16(data: number) {
      out.setUint16(pos, data, true);
      pos += 2;
    }
    function setUint32(data: number) {
      out.setUint32(pos, data, true);
      pos += 4;
    }

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8);
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt "
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);

    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (let i = 0; i < abuffer.numberOfChannels; i++) {
      channels.push(abuffer.getChannelData(i));
    }

    while (offset < abuffer.length) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([out.buffer], { type: "audio/wav" });
  };

  const convertAudio = async (
    targetFile: File,
    format: "wav" | "ogg",
    rate: number
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx({ sampleRate: rate });

      const arrayBuffer = await targetFile.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arrayBuffer);

      const blob = bufferToWave(decoded);
      const url = URL.createObjectURL(blob);

      setResultBlob(blob);
      setResultUrl(url);
      setIsProcessing(false);
    } catch {
      setError("Failed to convert audio file. Ensure file format is valid.");
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResultBlob(null);
    setResultUrl(null);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      {!file ? (
        <FileDropzone
          onFilesSelected={handleFiles}
          accept="audio/*,.mp3,.wav,.ogg,.aac,.m4a"
          label="Drop an audio file here to convert"
          hint="Supports MP3, WAV, OGG, and AAC with instant in-browser conversion."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Audio File
              </span>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600"
              >
                <RefreshCw className="h-3 w-3" /> Change audio
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">Original size: {formatBytes(file.size)}</p>
            </div>

            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

            <ToolSettings title="Conversion Options">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Output Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTargetFormat("wav");
                      convertAudio(file, "wav", sampleRate);
                    }}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      targetFormat === "wav"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    WAV (Uncompressed Studio)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetFormat("ogg");
                      convertAudio(file, "ogg", sampleRate);
                    }}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      targetFormat === "ogg"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    OGG / Audio Stream
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Sample Rate
                </label>
                <select
                  value={sampleRate}
                  onChange={(e) => {
                    const r = Number(e.target.value);
                    setSampleRate(r);
                    convertAudio(file, targetFormat, r);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800"
                >
                  <option value={44100}>44.1 kHz (CD Standard Quality)</option>
                  <option value={48000}>48 kHz (Studio Film Quality)</option>
                  <option value={22050}>22.05 kHz (Compact Speech)</option>
                </select>
              </div>
            </ToolSettings>
          </div>

          <div className="lg:col-span-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-slate-200 bg-slate-50/50 text-center space-y-3 h-72">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-800">Converting audio channels...</p>
              </div>
            ) : resultUrl && resultBlob ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-base font-semibold text-slate-900">Audio Converted!</h3>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <audio src={resultUrl} controls className="w-full" />
                  <p className="text-xs text-slate-500">Output size: {formatBytes(resultBlob.size)}</p>
                </div>

                <a
                  href={resultUrl}
                  download={`converted-${file.name.split(".")[0]}.${targetFormat}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" /> Download Converted Audio (.
                  {targetFormat.toUpperCase()})
                </a>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

