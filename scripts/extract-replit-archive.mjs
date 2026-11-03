import fs from "node:fs";
import path from "node:path";
import { inflateRawSync } from "node:zlib";

const root = process.cwd();
const archivePath = path.join(root, "replit-source/nadezhny-partner.zip.b64");
if (!fs.existsSync(archivePath)) throw new Error("Не найден архив исходного Replit-проекта");
const archive = Buffer.from(fs.readFileSync(archivePath, "utf8").replace(/\s+/g, ""), "base64");

let eocd = -1;
for (let offset = archive.length - 22; offset >= Math.max(0, archive.length - 65557); offset--) {
  if (archive.readUInt32LE(offset) === 0x06054b50) { eocd = offset; break; }
}
if (eocd < 0) throw new Error("ZIP: не найдена центральная директория");
const entryCount = archive.readUInt16LE(eocd + 10);
let cursor = archive.readUInt32LE(eocd + 16);
const manifest = [];
const assetRoot = path.join(root, "public/replit-import");

for (let index = 0; index < entryCount; index++) {
  if (archive.readUInt32LE(cursor) !== 0x02014b50) throw new Error("ZIP: повреждена запись каталога");
  const method = archive.readUInt16LE(cursor + 10);
  const compressedSize = archive.readUInt32LE(cursor + 20);
  const uncompressedSize = archive.readUInt32LE(cursor + 24);
  const nameLength = archive.readUInt16LE(cursor + 28);
  const extraLength = archive.readUInt16LE(cursor + 30);
  const commentLength = archive.readUInt16LE(cursor + 32);
  const localOffset = archive.readUInt32LE(cursor + 42);
  const name = archive.subarray(cursor + 46, cursor + 46 + nameLength).toString("utf8");
  cursor += 46 + nameLength + extraLength + commentLength;
  if (!name || name.endsWith("/")) continue;

  manifest.push({ path: name, bytes: uncompressedSize });
  const extension = path.extname(name).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp", ".svg", ".avif", ".woff", ".woff2"].includes(extension)) continue;

  const localNameLength = archive.readUInt16LE(localOffset + 26);
  const localExtraLength = archive.readUInt16LE(localOffset + 28);
  const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
  const compressed = archive.subarray(dataOffset, dataOffset + compressedSize);
  let content;
  if (method === 0) content = compressed;
  else if (method === 8) content = inflateRawSync(compressed);
  else throw new Error("ZIP: неизвестный метод сжатия " + method + " для " + name);
  if (content.length !== uncompressedSize) throw new Error("ZIP: размер не совпал для " + name);

  const relative = name.replace(/\\/g, "/").split("/").filter((part) => part && part !== "." && part !== "..").join("/");
  const destination = path.join(assetRoot, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, content);
}

fs.mkdirSync(assetRoot, { recursive: true });
fs.writeFileSync(path.join(assetRoot, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("Replit archive inspected: " + manifest.length + " files; copied visual assets: " + fs.readdirSync(assetRoot, { recursive: true }).length);
console.log("Archive paths: " + manifest.map((item) => item.path).join(" | "));
