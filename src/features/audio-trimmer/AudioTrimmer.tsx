"use client";

import React, { useState, useRef } from "react";
import { FileDropzone } from "@/components/tool/FileDropzone";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { ErrorMessage } from "@/components/tool/ErrorMessage";
import { formatBytes } from "@/lib/utils";
import { Scissors, Play, Pause, Download, Loader2, RefreshCw, CheckCircle2 } from "lucide-react";

export function AudioTrimmer() {
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (!selected.type.startsWith("audio/") && !selected.name.match(/\.(mp3|wav|ogg|aac|m4a|flac)$/i)) {
      setError("Please select a supported audio file (MP3, WAV, OGG, AAC).");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const arrayBuffer = await selected.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arrayBuffer);

      setFile(selected);
      setAudioBuffer(decoded);
      setDuration(decoded.duration);
      setStartTime(0);
      setEndTime(Math.min(decoded.duration, 30));
      setResultBlob(null);
      setResultUrl(null);
      setIsProcessing(false);
    } catch {
      setError("Failed to decode audio file. Format might be corrupted.");
      setIsProcessing(false);
    }
  };

  const playPreview = () => {
    if (!audioBuffer || !audioContextRef.current) return;
    if (isPlaying) {
      sourceNodeRef.current?.stop();
      setIsPlaying(false);
      return;
    }

    const ctx = audioContextRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const playDuration = Math.max(0.1, endTime - startTime);
    source.start(0, startTime, playDuration);
    sourceNodeRef.current = source;
    setIsPlaying(true);

    source.onended = () => {
      setIsPlaying(false);
    };
  };

  const bufferToWave = (abuffer: AudioBuffer, totalLen: number) => {
    const numOfChan = abuffer.numberOfChannels;
    const length = totalLen * numOfChan * 2 + 44;
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

    // RIFF identifier
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    // format chunk identifier
    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // format chunk length
    setUint16(1); // sample format (raw)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // byte rate
    setUint16(numOfChan * 2); // block align
    setUint16(16); // bits per sample

    // data chunk identifier
    setUint32(0x61746164); // "data" chunk
    setUint32(length - pos - 4); // data length

    for (let i = 0; i < abuffer.numberOfChannels; i++) {
      channels.push(abuffer.getChannelData(i));
    }

    while (offset < totalLen) {
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

  const handleTrim = async () => {
    if (!audioBuffer) return;
    setIsProcessing(true);
    setError(null);

    try {
      const sampleRate = audioBuffer.sampleRate;
      const startSample = Math.floor(startTime * sampleRate);
      const endSample = Math.floor(endTime * sampleRate);
      const frameCount = endSample - startSample;

      if (frameCount <= 0) {
        setError("End time must be greater than start time.");
        setIsProcessing(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const tempCtx = new AudioCtx();
      const trimmedBuffer = tempCtx.createBuffer(
        audioBuffer.numberOfChannels,
        frameCount,
        sampleRate
      );

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const sourceData = audioBuffer.getChannelData(channel);
        const targetData = trimmedBuffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
          targetData[i] = sourceData[startSample + i];
        }
      }

      const wavBlob = bufferToWave(trimmedBuffer, frameCount);
      const url = URL.createObjectURL(wavBlob);

      setResultBlob(wavBlob);
      setResultUrl(url);
      setIsProcessing(false);
    } catch {
      setError("Failed to trim audio.");
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    sourceNodeRef.current?.stop();
    setFile(null);
    setAudioBuffer(null);
    setResultBlob(null);
    setResultUrl(null);
    setError(null);
    setIsPlaying(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      {!file ? (
        <FileDropzone
          onFilesSelected={handleFiles}
          accept="audio/*,.mp3,.wav,.ogg,.aac,.m4a"
          label="Drop an audio file here to cut and trim"
          hint="Supports MP3, WAV, OGG, and AAC with instant in-browser slicing."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Loaded Audio
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
              <p className="text-xs text-slate-500 mt-0.5">
                Total duration: {Math.floor(duration / 60)}:
                {Math.floor(duration % 60).toString().padStart(2, "0")} • {formatBytes(file.size)}
              </p>
            </div>

            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

            <ToolSettings title="Trim Range">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Start Time (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={endTime}
                    step="0.1"
                    value={startTime}
                    onChange={(e) => setStartTime(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    End Time (seconds)
                  </label>
                  <input
                    type="number"
                    min={startTime}
                    max={duration}
                    step="0.1"
                    value={endTime}
                    onChange={(e) => setEndTime(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={playPreview}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5 text-blue-600" /> Pause Selection
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 text-blue-600" /> Play Selection
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleTrim}
                  disabled={isProcessing}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Trimming...
                    </>
                  ) : (
                    <>
                      <Scissors className="h-3.5 w-3.5" /> Cut Audio
                    </>
                  )}
                </button>
              </div>
            </ToolSettings>
          </div>

          <div className="lg:col-span-6">
            {resultUrl && resultBlob ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-base font-semibold text-slate-900">Audio Trimmed!</h3>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <audio src={resultUrl} controls className="w-full" />
                  <p className="text-xs text-slate-500">
                    Duration: {(endTime - startTime).toFixed(1)}s • Size: {formatBytes(resultBlob.size)}
                  </p>
                </div>

                <a
                  href={resultUrl}
                  download={`trimmed-${file.name.split(".")[0]}.wav`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" /> Download Trimmed Audio (.WAV)
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 h-72 text-center space-y-2">
                <Scissors className="h-8 w-8 text-slate-300" />
                <p>Set start &amp; end seconds, preview, and click Cut Audio.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

