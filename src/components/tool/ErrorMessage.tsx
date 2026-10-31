import React from "react";
import { AlertCircle, XCircle } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
  title?: string;
  onDismiss?: () => void;
}

export function ErrorMessage({
  message = "An unexpected error occurred while processing.",
  title = "Processing Error",
  onDismiss,
}: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/70 p-4 text-xs text-red-700">
      <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="font-semibold text-red-900">{title}</h4>
        <p className="mt-0.5 leading-relaxed">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-700"
          aria-label="Dismiss"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

