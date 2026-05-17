import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("public/icons", { recursive: true });

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="120" fill="#66714A"/>
  <circle cx="256" cy="256" r="150" fill="#F7F1E3"/>
  <path d="M164 268L226 330L354 190" fill="none" stroke="#66714A" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

await sharp(Buffer.from(svg)).png().resize(192, 192).toFile("public/icons/icon-192.png");
await sharp(Buffer.from(svg)).png().resize(512, 512).toFile("public/icons/icon-512.png");

console.log("PWA icons generated.");