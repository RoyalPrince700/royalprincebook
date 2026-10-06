const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

const crc32 = (buffer) => {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const body = Buffer.concat([Buffer.from(type), data]);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(crc32(body), 8 + data.length);
  return out;
};

const insideRoundedRect = (x, y, size, inset, radius) => {
  const left = inset;
  const top = inset;
  const right = size - inset;
  const bottom = size - inset;
  const halfWidth = (right - left) / 2;
  const halfHeight = (bottom - top) / 2;
  const midX = (left + right) / 2;
  const midY = (top + bottom) / 2;
  const qx = Math.abs(x - midX) - (halfWidth - radius);
  const qy = Math.abs(y - midY) - (halfHeight - radius);
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) <= radius;
};

const paint = (x, y, size) => {
  const px = x + 0.5;
  const py = y + 0.5;
  if (!insideRoundedRect(px, py, size, size * 0.06, size * 0.22)) {
    return [0, 0, 0, 0];
  }

  const thickness = Math.max(1, size * 0.055);
  const left = size * 0.28;
  const lines = [
    [size * 0.36, 1],
    [size * 0.51, 0.78],
    [size * 0.66, 0.56]
  ];

  for (const [lineY, length] of lines) {
    const onLine =
      py >= lineY &&
      py <= lineY + thickness &&
      px >= left &&
      px <= left + size * 0.44 * length;
    if (onLine) return [228, 177, 90, 255];
  }

  return [28, 25, 21, 255];
};

const png = (size) => {
  const stride = size * 4 + 1;
  const raw = Buffer.alloc(stride * size);
  for (let y = 0; y < size; y += 1) {
    const row = y * stride;
    raw[row] = 0;
    for (let x = 0; x < size; x += 1) {
      const [r, g, b, a] = paint(x, y, size);
      const index = row + 1 + x * 4;
      raw[index] = r;
      raw[index + 1] = g;
      raw[index + 2] = b;
      raw[index + 3] = a;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0))
  ]);
};

const root = path.join(__dirname, '..');
fs.writeFileSync(path.join(root, 'icon.png'), png(256));
fs.writeFileSync(path.join(root, 'tray.png'), png(32));
console.log('Wrote icon.png and tray.png');
