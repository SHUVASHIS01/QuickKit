import React from "react";
import { Sliders } from "lucide-react";

interface ToolSettingsProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function ToolSettings({
  title = "Configuration",
  description = "Adjust parameters for your output file.",
  children,
}: ToolSettingsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Sliders className="h-4 w-4 text-blue-600" />
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {description && (
            <p className="text-xs text-slate-500">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

