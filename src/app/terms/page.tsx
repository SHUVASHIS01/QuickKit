import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — QuickKit",
  description: "Terms and conditions for utilizing QuickKit services and tools.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
        <p className="text-sm text-slate-500">Last updated: November 2026</p>

        <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4 leading-relaxed">
          <p>
            Welcome to QuickKit. By accessing or using our website and utility tools, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-4">1. Use of Tools</h2>
          <p>
            QuickKit provides utilities for personal and commercial file transformation, document editing, and developer debugging. You agree not to use the services for any unlawful purposes or to distribute harmful payloads.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-4">2. Disclaimer of Warranties</h2>
          <p>
            QuickKit is provided &quot;as is&quot; without warranties of any kind. While we rigorously test our utilities for stability and accuracy, you are advised to maintain independent backups of critical files before transformation.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-4">3. Modifications</h2>
          <p>
            We may introduce new features, refine existing tools, or update these terms periodically to improve the service quality.
          </p>
        </div>
      </div>
    </div>
  );
}

