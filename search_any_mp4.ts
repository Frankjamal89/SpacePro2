import fs from 'fs';

function searchFile(filename: string) {
  console.log(`=== SEARCHING IN ${filename} ===`);
  const content = fs.readFileSync(filename, 'utf8');
  
  // Let's search for "mp4" anywhere
  const regex = /[^"'\s]*mp4[^"'\s]*/gi;
  const matches = content.match(regex) || [];
  console.log(`Found ${matches.length} rough matches for "mp4":`);
  Array.from(new Set(matches)).slice(0, 30).forEach(m => console.log(m));

  // Let's search for any string matching a URL structure starting with http and having .mp4 or .webm or similar
  const urlRegex = /https?:\/\/[^"'\s]+/gi;
  const urls = content.match(urlRegex) || [];
  console.log(`Found ${urls.length} URLs in total.`);
  urls.forEach(url => {
    if (url.toLowerCase().includes('video') || url.toLowerCase().includes('mp4') || url.toLowerCase().includes('static') || url.toLowerCase().includes('media')) {
      console.log("Candidate URL:", url);
    }
  });

  // Let's search for json blocks or scripts containing video URLs or stream URLs
  // Let's print occurrences of word "src"
  const srcMatches = content.match(/src\s*=\s*["'][^"']+["']/g) || [];
  console.log(`Found ${srcMatches.length} src attributes:`);
  srcMatches.forEach(m => console.log(m));
}

searchFile('flexclip.html');
searchFile('embed.html');
