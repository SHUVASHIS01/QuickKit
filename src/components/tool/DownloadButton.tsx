import React from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface DownloadButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  href?: string;
  download?: string;
  variant?: "primary" | "secondary" | "outline";
}

export function DownloadButton({
  label = "Download",
  href,
  download,
  className,
  variant = "primary",
  ...props
}: DownloadButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-xs",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
  };

  if (href) {
    return (
      <a
        href={href}
        download={download}
        className={cn(baseClasses, variants[variant], className)}
      >
        <Download className="h-4 w-4" /> {label}
      </a>
    );
  }

  return (
    <button
      className={cn(baseClasses, variants[variant], className)}
      {...props}
    >
      <Download className="h-4 w-4" /> {label}
    </button>
  );
}

