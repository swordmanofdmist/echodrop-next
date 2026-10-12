import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const allowedTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
};

export async function saveImage(file) {
  if (!file || typeof file === "string" || file.size === 0) return "";

  if (!allowedTypes[file.type]) {
    const error = new Error("Only JPG, PNG and WebP images are allowed.");
    error.status = 400;
    throw error;
  }

  const uploadFolder = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadFolder, { recursive: true });

  const fileName = `${Date.now()}-${randomUUID()}.${allowedTypes[file.type]}`;
  const bytes = await file.arrayBuffer();
  await writeFile(path.join(uploadFolder, fileName), Buffer.from(bytes));

  return fileName;
}
