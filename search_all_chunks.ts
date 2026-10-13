import fs from 'fs';

const chunks = [
  '/next_share/_next/static/chunks/515-b8ba7c3cef0d231e.js',
  '/next_share/_next/static/chunks/832-9dc2b071473b0eba.js',
  '/next_share/_next/static/chunks/479-a9f21830a8804a19.js',
  '/next_share/_next/static/chunks/pages/_app-77b7749fc949540d.js',
  '/next_share/_next/static/chunks/webpack-c0cd07f7c0181823.js',
  '/next_share/_next/static/chunks/framework-dc33c0b5493501f0.js',
  '/next_share/_next/static/chunks/main-7bbc92fef68f51a5.js'
];

async function main() {
  for (const chunk of chunks) {
    const url = `https://www.flexclip.com${chunk}`;
    console.log(`Fetching: ${url}`);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`Failed to fetch ${chunk}: ${res.status}`);
        continue;
      }
      const text = await res.text();
      console.log(`Length of ${chunk}: ${text.length}`);
      
      // Let's search for "initAction" or "videoUrl" or "project_key" or "shareData" or ".mp4" or "https://"
      const keywords = ['initAction', 'videoUrl', 'project_key', 'shareData', '.mp4', 'cloudfront', 's3', 'googleapis'];
      keywords.forEach(kw => {
        const idx = text.indexOf(kw);
        if (idx !== -1) {
          console.log(`[${chunk}] Found "${kw}" at ${idx}:`);
          console.log(text.substring(Math.max(0, idx - 150), Math.min(text.length, idx + 250)));
        }
      });
    } catch (e) {
      console.error(`Error fetching ${chunk}:`, e);
    }
  }
}

main();
