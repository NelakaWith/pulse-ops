import { NextResponse } from "next/server";
import axios from "axios";

const GITHUB_API = "https://api.github.com";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get("endpoint"); // e.g. repos/nelaka/repo-name

  if (!endpoint) {
    return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
  }

  try {
    const res = await axios.get(`${GITHUB_API}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      // set a short timeout for external request
      timeout: 10_000,
      validateStatus: () => true, // we'll handle status codes below
    });

    const status = res.status;
    const data = res.data;

    // Return response with caching headers (since `fetch`-specific `next` option
    // isn't available when using axios). Adjust s-maxage as needed.
    return NextResponse.json(data, {
      status,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=59",
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : String(err ?? "Unknown error");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
