"use client";

import React, { useEffect } from "react";
import { Link2, ArrowRight } from "lucide-react";

export default function ClientRedirect({ code }: { code: string }) {
  useEffect(() => {
    if (!code) return;
    try {
      const saved = localStorage.getItem("quickkit_short_urls");
      if (saved) {
        const list = JSON.parse(saved);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const found = list.find((item: any) => item.code === code);
        if (found) {
          window.location.href = found.originalUrl;
        }
      }
    } catch {
      // ignore
    }
  }, [code]);

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mx-auto border border-blue-100">
        <Link2 className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-bold text-slate-900">Redirecting to Destination</h2>
      <p className="text-xs text-slate-500">Short Code: /s/{code}</p>

      <div className="pt-4 text-xs text-slate-400 space-y-2">
        <p>If not redirected automatically, your browser session may not contain this link.</p>
        <a href="/url-shortener" className="text-blue-600 hover:underline inline-flex items-center gap-1">
          Create short link with QuickKit <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

