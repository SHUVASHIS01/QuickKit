"use client";

import React, { useState } from "react";
import { ToolItem } from "@/types";
import { Clock, CheckCircle2, Shield, Bell } from "lucide-react";

interface ComingSoonToolProps {
  tool: ToolItem;
}

export function ComingSoonTool({ tool }: ComingSoonToolProps) {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <div className="mx-auto max-w-2xl text-center py-12 px-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200 mb-6">
        <Clock className="h-3.5 w-3.5" />
        Feature Under Active Development
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        {tool.name} is coming soon
      </h2>

      <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
        We are engineering a fast, privacy-preserving browser implementation for{" "}
        <span className="font-semibold text-slate-800">{tool.name}</span>. In line with QuickKit principles, all processing will run securely in your client environment.
      </p>

      {/* Value badges */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Shield className="h-4 w-4 text-emerald-600 mb-2" />
          <h3 className="text-xs font-semibold text-slate-900">Zero Uploads</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Files never reach any external cloud.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <CheckCircle2 className="h-4 w-4 text-blue-600 mb-2" />
          <h3 className="text-xs font-semibold text-slate-900">100% Free</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">No subscription or signup required.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Clock className="h-4 w-4 text-purple-600 mb-2" />
          <h3 className="text-xs font-semibold text-slate-900">Next Release</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Slated for the upcoming update cycle.</p>
        </div>
      </div>

      {/* Notify Form */}
      <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 max-w-md mx-auto">
        {subscribed ? (
          <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 font-medium">
            <CheckCircle2 className="h-5 w-5" />
            Thank you! You will be notified as soon as this tool goes live.
          </div>
        ) : (
          <form onSubmit={handleNotify} className="space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700">
              <Bell className="h-3.5 w-3.5 text-blue-600" />
              Notify me when {tool.name} launches
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
              />
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Notify Me
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

