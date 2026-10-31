import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Please provide a valid Pinterest URL." }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format." }, { status: 400 });
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    if (!hostname.includes("pinterest") && !hostname.includes("pin.it")) {
      return NextResponse.json(
        { error: "The provided URL is not a recognized Pinterest link." },
        { status: 400 }
      );
    }

    // Fetch the target pin page following redirects
    const response = await fetch(parsedUrl.toString(), {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Could not fetch Pinterest page (Status: ${response.status})` },
        { status: 400 }
      );
    }

    const html = await response.text();

    // 1. Check for Video
    const videoMatch =
      html.match(/<meta\s+property=["']og:video(?::secure_url)?["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<video[^>]+src=["']([^"']+)["']/i) ||
      html.match(/"contentUrl":\s*"([^"]+\.mp4[^"]*)"/i) ||
      html.match(/"url":\s*"(https:\/\/v\.pinimg\.com\/videos\/[^"]+)"/i);

    const videoUrl = videoMatch ? videoMatch[1].replace(/\\u0026/g, "&") : null;

    // 2. Check for Image
    const imageMatch =
      html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
      html.match(/"image":\s*"([^"]+)"/i) ||
      html.match(/"image":\s*\[\s*"([^"]+)"/i);

    let imageUrl = imageMatch ? imageMatch[1].replace(/\\u0026/g, "&") : null;

    // Attempt to get original full-resolution image if pinimg
    if (imageUrl && imageUrl.includes("pinimg.com")) {
      // Replace /236x/, /474x/, /736x/ with /originals/
      imageUrl = imageUrl.replace(/\/(236x|474x|736x)\//, "/originals/");
    }

    // 3. Check for Title
    const titleMatch =
      html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<title>([^<]+)<\/title>/i);

    const title = titleMatch ? titleMatch[1].trim() : "Pinterest Media";

    if (!videoUrl && !imageUrl) {
      return NextResponse.json(
        { error: "Could not locate public media on this Pinterest link. It might be private or expired." },
        { status: 404 }
      );
    }

    const isVideo = Boolean(videoUrl);
    const mediaUrl = isVideo ? videoUrl : imageUrl;
    const thumbnail = imageUrl || videoUrl;

    return NextResponse.json({
      success: true,
      title,
      mediaType: isVideo ? "video" : "image",
      mediaUrl,
      thumbnail,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to extract Pinterest media.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

