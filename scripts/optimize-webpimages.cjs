const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const root = process.cwd();
const targetDir = path.resolve(root, "public/grains/Images/webpimages");
const quality = Number(process.env.WEBP_QUALITY || 82);

async function listWebpFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".webp"))
    .map((entry) => path.join(dir, entry.name));
}

async function optimizeFile(filePath) {
  const input = await fs.readFile(filePath);
  const before = await sharp(input, { limitInputPixels: false }).metadata();

  if (before.pages && before.pages > 1) {
    return { filePath, status: "skipped", reason: "animated", beforeBytes: input.length, afterBytes: input.length };
  }

  const output = await sharp(input, { limitInputPixels: false })
    .webp({ quality, effort: 6 })
    .toBuffer();

  const after = await sharp(output, { limitInputPixels: false }).metadata();
  if (before.width !== after.width || before.height !== after.height) {
    throw new Error(`Dimension changed for ${path.basename(filePath)}: ${before.width}x${before.height} -> ${after.width}x${after.height}`);
  }

  if (output.length >= input.length) {
    return { filePath, status: "skipped", reason: "not smaller", beforeBytes: input.length, afterBytes: input.length };
  }

  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, output);
  await fs.rename(tempPath, filePath);

  return { filePath, status: "optimized", beforeBytes: input.length, afterBytes: output.length };
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function main() {
  if (!Number.isFinite(quality) || quality < 1 || quality > 100) {
    throw new Error("WEBP_QUALITY must be a number between 1 and 100.");
  }

  const files = await listWebpFiles(targetDir);
  let optimized = 0;
  let skipped = 0;
  let beforeTotal = 0;
  let afterTotal = 0;

  for (const file of files) {
    const result = await optimizeFile(file);
    beforeTotal += result.beforeBytes;
    afterTotal += result.afterBytes;

    if (result.status === "optimized") {
      optimized += 1;
      console.log(`optimized ${path.basename(file)} ${formatBytes(result.beforeBytes)} -> ${formatBytes(result.afterBytes)}`);
    } else {
      skipped += 1;
      console.log(`skipped ${path.basename(file)} (${result.reason})`);
    }
  }

  console.log("");
  console.log(`Processed: ${files.length}`);
  console.log(`Optimized: ${optimized}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Before: ${formatBytes(beforeTotal)}`);
  console.log(`After: ${formatBytes(afterTotal)}`);
  console.log(`Saved: ${formatBytes(beforeTotal - afterTotal)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
