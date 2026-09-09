// Run locally with PEXELS_API_KEY in the process environment, never VITE_*.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const args = process.argv.slice(2);
const option = (name) =>
  args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
const apiKey = process.env.PEXELS_API_KEY;
if (!apiKey)
  throw new Error(
    "Set PEXELS_API_KEY in your local process environment. Do not add it to client code or commit it.",
  );
const searching = args.includes("--search");
const query = searching ? option("--search") : null;
const id = option("--id");
const slot = option("--slot");
if (
  searching
    ? !query || query.startsWith("--")
    : !/^\d+$/.test(id || "") ||
      !["digital", "workplace", "collaboration"].includes(slot)
) {
  throw new Error(
    'Use --search "team collaboration" or --id VIDEO_ID --slot digital|workplace|collaboration.',
  );
}
const endpoint = searching
  ? `https://api.pexels.com/v1/videos/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=8`
  : `https://api.pexels.com/v1/videos/videos/${id}`;
const response = await fetch(endpoint, {
  headers: { Authorization: apiKey },
  signal: AbortSignal.timeout(30000),
});
if (!response.ok)
  throw new Error(
    `Pexels request failed (${response.status}). Check your key and quota.`,
  );
const data = await response.json();
if (searching) {
  for (const video of data.videos || [])
    console.log(
      `${video.id} | ${video.duration}s | ${video.user.name} | ${video.url}`,
    );
  console.log(
    "Review a clip and its license, then import its ID into a media slot.",
  );
} else {
  if (data.width < data.height)
    throw new Error("Select a landscape clip for these media panels.");
  const file = data.video_files
    .filter(
      (file) =>
        file.file_type === "video/mp4" &&
        file.width >= 960 &&
        file.width <= 1920,
    )
    .sort((a, b) => Math.abs(a.width - 1280) - Math.abs(b.width - 1280))[0];
  if (!file)
    throw new Error("No suitable web-sized MP4 is available for this video.");
  async function download(url, kind, limit) {
    const parsed = new URL(url);
    if (
      parsed.protocol !== "https:" ||
      !["videos.pexels.com", "images.pexels.com"].includes(parsed.hostname)
    )
      throw new Error("Unexpected media host.");
    const res = await fetch(parsed, {
      signal: AbortSignal.timeout(60000),
      redirect: "error",
    });
    if (!res.ok || !res.headers.get("content-type")?.startsWith(kind))
      throw new Error(`Invalid ${kind} response.`);
    const chunks = [];
    let size = 0;
    for await (const chunk of res.body) {
      size += chunk.length;
      if (size > limit)
        throw new Error(
          "Asset exceeds the web media size limit. Select a shorter clip.",
        );
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }
  const video = await download(file.link, "video/", 25 * 1024 * 1024);
  const poster = await download(data.image, "image/", 5 * 1024 * 1024);
  const directory = new URL("public/media/", root);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL(`pexels-${id}.mp4`, directory), video);
  await writeFile(new URL(`pexels-${id}.jpg`, directory), poster);
  const manifestUrl = new URL("src/content/imported-media.json", root);
  const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
  manifest[slot] = {
    src: `/media/pexels-${id}.mp4`,
    poster: `/media/pexels-${id}.jpg`,
    title: `Stock footage by ${data.user.name}`,
    source: data.url,
    credit: `${data.user.name} / Pexels`,
  };
  await writeFile(manifestUrl, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `Imported ${id} into ${slot}. Review ${fileURLToPath(manifestUrl)} and the page before publishing.`,
  );
}
