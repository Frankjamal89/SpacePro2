import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { setupRemodelRoutes } from './src/remodelServer';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload size limit to accommodate large video and image uploads
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // --- REMODEL ROUTES ---
  setupRemodelRoutes(app, publicDir);

  // --- API ROUTES ---

  // Get Custom Site Data saved on the server
  app.get('/api/custom-site-data', (req, res) => {
    const dataPath = path.join(publicDir, 'custom-site-data.json');
    if (fs.existsSync(dataPath)) {
      try {
        const raw = fs.readFileSync(dataPath, 'utf8');
        return res.json(JSON.parse(raw));
      } catch (err) {
        console.error('Failed to parse custom-site-data.json:', err);
        return res.status(500).json({ error: 'Failed to read custom site data' });
      }
    }
    return res.json(null);
  });

  // Save Custom Site Data & Extract large media assets (Video, Logo Image) into files
  app.post('/api/save-site-data', (req, res) => {
    try {
      const { siteData } = req.body;
      if (!siteData) {
        return res.status(400).json({ error: 'No site data provided' });
      }

      const updatedData = { ...siteData };

      // 1. Process Hero Video if it's base64 data
      if (updatedData.hero && updatedData.hero.video && updatedData.hero.video.startsWith('data:video')) {
        const videoData = updatedData.hero.video;
        const matches = videoData.match(/^data:video\/([a-zA-Z0-9]+);base64,(.+)$/);
        
        if (matches && matches.length === 3) {
          const ext = matches[1];
          const base64Content = matches[2];
          const buffer = Buffer.from(base64Content, 'base64');
          
          // Write to file /public/hero-video.mp4 (or appropriate extension)
          const fileName = `hero-video.${ext}`;
          const videoPath = path.join(publicDir, fileName);
          fs.writeFileSync(videoPath, buffer);
          
          console.log(`Saved hero video to ${videoPath}`);
          // Replace base64 in JSON with local static file URL
          updatedData.hero.video = `/${fileName}`;
        }
      }

      // 2. Process Logo Image if it's base64 data
      if (updatedData.logoImage && updatedData.logoImage.startsWith('data:image')) {
        const imageData = updatedData.logoImage;
        const matches = imageData.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        
        if (matches && matches.length === 3) {
          let ext = matches[1];
          if (ext.includes('+')) {
            ext = ext.split('+')[0]; // clean svg+xml, etc.
          }
          const base64Content = matches[2];
          const buffer = Buffer.from(base64Content, 'base64');
          
          const fileName = `logo-image.${ext}`;
          const imagePath = path.join(publicDir, fileName);
          fs.writeFileSync(imagePath, buffer);
          
          console.log(`Saved logo image to ${imagePath}`);
          // Replace base64 in JSON with local static file URL
          updatedData.logoImage = `/${fileName}`;
        }
      }

      // Save custom site data JSON
      const dataPath = path.join(publicDir, 'custom-site-data.json');
      fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2), 'utf8');
      console.log('Successfully saved custom site data config to', dataPath);

      res.json({ success: true, siteData: updatedData });
    } catch (err: any) {
      console.error('Error in /api/save-site-data:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // Reset custom site data back to default (delete files)
  app.post('/api/reset-site-data', (req, res) => {
    try {
      const filesToDelete = [
        'custom-site-data.json',
        'hero-video.mp4',
        'hero-video.webm',
        'hero-video.mov',
        'logo-image.png',
        'logo-image.jpg',
        'logo-image.jpeg',
        'logo-image.svg',
        'logo-image.webp'
      ];

      filesToDelete.forEach(file => {
        const filePath = path.join(publicDir, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted custom file: ${file}`);
        }
      });

      res.json({ success: true });
    } catch (err: any) {
      console.error('Error in /api/reset-site-data:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // Serve custom public directory statically
  app.use(express.static(publicDir));

  // --- VITE MIDDLEWARE / STATIC ASSETS ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
