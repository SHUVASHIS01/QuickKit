import React, { Suspense } from "react";
import { Link2 } from "lucide-react";
import ClientRedirect from "./ClientRedirect";

export function generateStaticParams() {
  return [{ code: "preview" }];
}

export default async function ShortLinkRedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-24 text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mx-auto border border-blue-100 animate-pulse">
            <Link2 className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Resolving Link...</h2>
        </div>
      }
    >
      <ClientRedirect code={code} />
    </Suspense>
  );
}
