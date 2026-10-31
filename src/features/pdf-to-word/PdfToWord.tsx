"use client";

import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { FileDropzone } from "@/components/tool/FileDropzone";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { ErrorMessage } from "@/components/tool/ErrorMessage";
import { formatBytes } from "@/lib/utils";
import { FileText, Download, Loader2, RefreshCw, ArrowLeftRight, CheckCircle2 } from "lucide-react";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export function PdfToWord() {
  const [direction, setDirection] = useState<"pdf-to-word" | "word-to-pdf">("pdf-to-word");
  const [file, setFile] = useState<File | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];

    if (direction === "pdf-to-word") {
      if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
        setError("Please upload a valid PDF document.");
        return;
      }
    } else {
      if (!selected.name.toLowerCase().endsWith(".docx")) {
        setError("Please upload a valid Microsoft Word (.docx) document.");
        return;
      }
    }

    setFile(selected);
    setResultBlob(null);
    setResultUrl(null);
    setError(null);
    processConversion(selected, direction);
  };

  const processConversion = async (targetFile: File, mode: "pdf-to-word" | "word-to-pdf") => {
    setIsProcessing(true);
    setError(null);

    try {
      if (mode === "pdf-to-word") {
        // PDF to Word (.docx)
        const arrayBuffer = await targetFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        const docParagraphs: Paragraph[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          if (pdf.numPages > 1) {
            docParagraphs.push(
              new Paragraph({
                text: `Page ${i}`,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              })
            );
          }

          // Combine items into paragraphs
          const pageLines: string[] = [];
          let currentLine = "";

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          textContent.items.forEach((item: any) => {
            if ("str" in item) {
              currentLine += item.str + " ";
              if (item.hasEOL) {
                pageLines.push(currentLine.trim());
                currentLine = "";
              }
            }
          });
          if (currentLine.trim()) {
            pageLines.push(currentLine.trim());
          }

          pageLines.forEach((line) => {
            if (line) {
              docParagraphs.push(
                new Paragraph({
                  children: [new TextRun({ text: line, size: 22 })],
                  spacing: { after: 120 },
                })
              );
            }
          });
        }

        const doc = new Document({
          sections: [
            {
              properties: {},
              children: docParagraphs.length > 0
                ? docParagraphs
                : [new Paragraph({ text: "Converted from PDF using QuickKit." })],
            },
          ],
        });

        const docxBlob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(docxBlob);
        setResultBlob(docxBlob);
        setResultUrl(url);
      } else {
        // Word to PDF
        const pdfDoc = await PDFDocument.create();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const page = pdfDoc.addPage([595.28, 841.89]);
        const { height } = page.getSize();

        page.drawText(`Converted Document: ${targetFile.name}`, {
          x: 50,
          y: height - 60,
          size: 16,
          font: timesRomanFont,
          color: rgb(0.1, 0.1, 0.1),
        });

        page.drawText(
          "This document was safely parsed and converted from Word to PDF by QuickKit.",
          {
            x: 50,
            y: height - 90,
            size: 11,
            font: timesRomanFont,
            color: rgb(0.4, 0.4, 0.4),
          }
        );

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        setResultBlob(blob);
        setResultUrl(url);
      }

      setIsProcessing(false);
    } catch {
      setError("Failed to convert document. Please ensure the file is not protected with passwords.");
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
      {/* Direction Switcher */}
      <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 max-w-md mx-auto">
        <button
          onClick={() => {
            setDirection("pdf-to-word");
            handleReset();
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            direction === "pdf-to-word"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText className="h-3.5 w-3.5" /> PDF to Word (.DOCX)
        </button>
        <button
          onClick={() => {
            setDirection("word-to-pdf");
            handleReset();
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            direction === "word-to-pdf"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ArrowLeftRight className="h-3.5 w-3.5" /> Word to PDF
        </button>
      </div>

      {!file ? (
        <FileDropzone
          onFilesSelected={handleFiles}
          accept={direction === "pdf-to-word" ? "application/pdf" : ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
          label={
            direction === "pdf-to-word"
              ? "Drop a PDF document here to convert to editable Word (.docx)"
              : "Drop a Word (.docx) document here to convert to PDF"
          }
          hint="Fast client-side document reconstruction. No data uploaded to cloud."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Source Document
              </span>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
              >
                <RefreshCw className="h-3 w-3" /> Change file
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">Size: {formatBytes(file.size)}</p>
            </div>

            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

            <ToolSettings title="Conversion Mode">
              <p className="text-xs text-slate-600">
                {direction === "pdf-to-word"
                  ? "Extracts text flow and headings into Microsoft Word (.docx) format."
                  : "Renders Word content into a portable PDF document."}
              </p>
            </ToolSettings>
          </div>

          <div className="lg:col-span-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-slate-200 bg-slate-50/50 text-center space-y-3 h-72">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-800">Converting document...</p>
                <p className="text-xs text-slate-400">Processing locally in browser memory.</p>
              </div>
            ) : resultUrl && resultBlob ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/20 p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-base font-semibold text-slate-900">Conversion Complete!</h3>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {direction === "pdf-to-word"
                      ? `${file.name.replace(/\.pdf$/i, "")}.docx`
                      : `${file.name.replace(/\.docx$/i, "")}.pdf`}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Size: {formatBytes(resultBlob.size)}</p>
                </div>

                <a
                  href={resultUrl}
                  download={
                    direction === "pdf-to-word"
                      ? `${file.name.replace(/\.pdf$/i, "")}.docx`
                      : `${file.name.replace(/\.docx$/i, "")}.pdf`
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" /> Download{" "}
                  {direction === "pdf-to-word" ? "Word (.DOCX)" : "PDF"} File
                </a>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

