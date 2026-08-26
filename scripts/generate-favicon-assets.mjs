import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const publicDirectory = path.join(repositoryRoot, 'public');
const sourcePath = path.join(publicDirectory, 'favicon.svg');
const svg = await fs.readFile(sourcePath);

async function renderPng(size) {
  return sharp(svg, { density: 384 })
    .resize(size, size, { fit: 'fill' })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
}

function createIco(images) {
  const directorySize = 6 + images.length * 16;
  const header = Buffer.alloc(directorySize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = directorySize;
  images.forEach(({ size, data }, index) => {
    const entry = 6 + index * 16;
    header.writeUInt8(size === 256 ? 0 : size, entry);
    header.writeUInt8(size === 256 ? 0 : size, entry + 1);
    header.writeUInt8(0, entry + 2);
    header.writeUInt8(0, entry + 3);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });

  return Buffer.concat([header, ...images.map(({ data }) => data)]);
}

const png16 = await renderPng(16);
const png32 = await renderPng(32);
const png48 = await renderPng(48);
const png180 = await renderPng(180);

await Promise.all([
  fs.writeFile(path.join(publicDirectory, 'favicon-16x16.png'), png16),
  fs.writeFile(path.join(publicDirectory, 'favicon-32x32.png'), png32),
  fs.writeFile(path.join(publicDirectory, 'apple-touch-icon.png'), png180),
  fs.writeFile(
    path.join(publicDirectory, 'favicon.ico'),
    createIco([
      { size: 16, data: png16 },
      { size: 32, data: png32 },
      { size: 48, data: png48 },
    ]),
  ),
]);

console.log('Generated favicon.ico, 16px, 32px and 180px favicon assets from public/favicon.svg.');
