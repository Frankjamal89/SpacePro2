import fs from 'fs';

async function main() {
  const url = 'https://www.flexclip.com/embed/16200747S8RofJV3pHEjB3QoM0ILsgshaFfqerFV.html';
  console.log(`Fetching embed URL: ${url}`);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.flexclip.com/share/16200747S8RofJV3pHEjB3QoM0ILsgshaFfqerFV.html'
      }
    });
    const html = await res.text();
    console.log(`Embed HTML Length: ${html.length}`);
    fs.writeFileSync('embed.html', html);
    
    // Find any urls containing mp4 or video or play or files
    const urls = html.match(/https?:\/\/[^\s'"]+/g) || [];
    console.log(`Found ${urls.length} URLs in embed HTML.`);
    
    // Filter out .mp4 files
    const mp4s = urls.filter(u => u.toLowerCase().includes('.mp4') || u.toLowerCase().includes('video') || u.toLowerCase().includes('storage'));
    console.log("Filtered URLs in embed:");
    Array.from(new Set(mp4s)).forEach(u => console.log(u));
    
    // Search for video tags
    const videoRegex = /<video[^>]*src="([^"]+)"/g;
    let match;
    while ((match = videoRegex.exec(html)) !== null) {
      console.log('Video tag:', match[0]);
    }
    
    const sourceRegex = /<source[^>]*src="([^"]+)"/g;
    while ((match = sourceRegex.exec(html)) !== null) {
      console.log('Source tag:', match[0]);
    }

    // Sometimes the video URL is inside a window.config or window.__INITIAL_STATE__ or similar JSON script
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    while ((match = scriptRegex.exec(html)) !== null) {
      const text = match[1];
      if (text.includes('mp4') || text.includes('videoUrl') || text.includes('playUrl') || text.includes('video_url')) {
        console.log("Found script tag containing video URLs!");
        // let's print matches of strings in quotes ending in .mp4 or containing .mp4
        const strRegex = /"([^"]*\.mp4[^"]*)"/g;
        let strMatch;
        while ((strMatch = strRegex.exec(text)) !== null) {
          console.log("Found mp4 string in script:", strMatch[1]);
        }
        
        // Also look for JSON objects like "video_url": ...
        const jsonUrlRegex = /"video_url"\s*:\s*"([^"]+)"/g;
        while ((strMatch = jsonUrlRegex.exec(text)) !== null) {
          console.log("video_url property:", strMatch[1]);
        }

        const previewRegex = /"previewUrl"\s*:\s*"([^"]+)"/g;
        while ((strMatch = previewRegex.exec(text)) !== null) {
          console.log("previewUrl property:", strMatch[1]);
        }
      }
    }
  } catch (err) {
    console.error('Error fetching embed URL:', err);
  }
}

main();
