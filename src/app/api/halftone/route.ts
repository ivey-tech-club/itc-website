import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = Number(searchParams.get("scale"));
  if (!Number.isFinite(raw)) {
    return Response.json({ ok: false, error: "scale must be a number" }, { status: 400 });
  }
  const dotScale = Math.min(3, Math.max(0.5, raw));

  try {
    await run("python3", [path.join(process.cwd(), "scripts", "generate-halftone.py"), "--dot-scale", String(dotScale)], {
      timeout: 60_000,
    });
    return Response.json({ ok: true, dotScale });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "render failed" },
      { status: 500 },
    );
  }
}
