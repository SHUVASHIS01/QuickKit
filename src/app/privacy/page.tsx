import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — QuickKit",
  description: "QuickKit privacy policy and commitment to client-side data security.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-slate-500">Last updated: November 2026</p>

        <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4 leading-relaxed">
          <p>
            QuickKit is engineered with a strict <strong>Privacy-First architecture</strong>. We believe your personal files, photos, source code, and documents are private.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-4">1. Client-Side Processing</h2>
          <p>
            The majority of QuickKit tools (including QR Generator, JSON Formatter, Base64 Converter, Image Compressor, Image Resizer, and PDF Merger) execute 100% locally on your computer or mobile device. Your files are not uploaded to our servers or stored on any remote disk.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-4">2. No Account or Tracking</h2>
          <p>
            We do not require account registration, personal phone numbers, or passwords to use QuickKit. We do not sell user data to advertising brokers.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-4">3. Analytics & Diagnostics</h2>
          <p>
            We may collect anonymous aggregate telemetry (such as page views or general error rates) strictly to maintain uptime and ensure web application stability.
          </p>
        </div>
      </div>
    </div>
  );
}

