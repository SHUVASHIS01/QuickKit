"use client";

import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";
import { Sparkles, Shield, Zap, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold">
                Quick<span className="text-blue-600">Kit</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              {SITE_CONFIG.tagline} A free, lightweight suite of online tools designed to save time. No mandatory signups, no intrusive ads, and privacy-first local browser processing.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="inline-flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-emerald-600" /> Client-Side Privacy
              </span>
              <span className="inline-flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-amber-500" /> Zero Wait Times
              </span>
            </div>
          </div>

          {/* Quick Tools Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Popular Tools
            </h3>
            <ul className="space-y-2 text-sm">
              {SITE_CONFIG.footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform & Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Platform
            </h3>
            <ul className="space-y-2 text-sm">
              {SITE_CONFIG.footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 QuickKit. Open source & free for everyone.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for creators, developers, and everyday users.
          </p>
        </div>
      </div>
    </footer>
  );
}

