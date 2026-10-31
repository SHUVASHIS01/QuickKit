import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mediaUrl = searchParams.get("url");
  const filename = searchParams.get("filename") || "pinterest-media";

  if (!mediaUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const upstreamRes = await fetch(mediaUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!upstreamRes.ok) {
      return NextResponse.json(
        { error: "Failed to download media file from Pinterest CDN." },
        { status: upstreamRes.status }
      );
    }

    const contentType =
      upstreamRes.headers.get("content-type") || "application/octet-stream";
    const arrayBuffer = await upstreamRes.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Download failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

