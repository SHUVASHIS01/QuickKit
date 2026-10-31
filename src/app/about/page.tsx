import React from "react";
import { Metadata } from "next";
import { Sparkles, Shield, Cpu, Heart } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About QuickKit — Mission & Architecture",
  description: "Learn about QuickKit's philosophy: privacy-first, free, and minimal online tools.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <Sparkles className="h-3.5 w-3.5" /> About The Project
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Everything you need. Nothing you don&apos;t.
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          QuickKit was born out of frustration with modern web tools: excessive full-page ads, forced account signups, slow cloud uploads, and hidden paywalls for simple everyday tasks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <Shield className="h-6 w-6 text-emerald-600 mb-3" />
            <h3 className="font-bold text-slate-900">Privacy by Default</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Whenever technologically possible, your documents, images, and data are processed locally within your browser memory using HTML5 Canvas, WebAssembly, and modern web APIs.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <Cpu className="h-6 w-6 text-blue-600 mb-3" />
            <h3 className="font-bold text-slate-900">Zero Artificial Latency</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              No server queues or upload bandwidth bottlenecks. Operations execute at the speed of your device hardware.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <Heart className="h-6 w-6 text-red-500 mb-3" />
            <h3 className="font-bold text-slate-900">Forever Free</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Core utilities remain open, clean, and freely accessible to everyone around the world.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Explore Tools
          </Link>
        </div>
      </div>
    </div>
  );
}

