import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';

interface RemodelSettings {
  activeProvider: 'google' | 'openai' | 'flux' | 'sdxl';
  generationLimit: number;
  promptTemplate: string;
}

interface QuoteRequest {
  id: string;
  projectId: string;
  conceptIndex: number;
  date: string;
  user: { name: string; email: string; phone: string };
  notes: string;
  originalImage: string;
  generatedImage: string;
  designReport: any;
  details: any;
  status: 'Pending' | 'Reviewing' | 'Quoted' | 'Completed';
}

interface UsageLog {
  id: string;
  timestamp: string;
  provider: string;
  category: string;
  area: string;
  style: string;
}

interface RemodelProject {
  id: string;
  date: string;
  category: string;
  area: string;
  style: string;
  palette: string;
  budget: string;
  instructions: string;
  originalImage: string;
  concepts: any[];
  userEmail?: string;
  userName?: string;
}

interface RemodelDataStore {
  settings: RemodelSettings;
  projects: RemodelProject[];
  quoteRequests: QuoteRequest[];
  usageLogs: UsageLog[];
}

const DEFAULT_SETTINGS: RemodelSettings = {
  activeProvider: 'google',
  generationLimit: 10,
  promptTemplate: 'You are Space Pro AI, a luxury architectural and finish consultant based in Ikoyi. Complete the provided shell photograph into a fully finished, high-end, bespoke masterwork. Style: {style}. Colour palette: {palette}. Redesign Area: {area}. Additional Details: {instructions}. Ensure flawless bookmatched finishes, refined lighting layers, and elite materials.'
};

// Lazy load or create store
function getStorePath(publicDir: string): string {
  return path.join(publicDir, 'ai-remodel-data.json');
}

function readStore(publicDir: string): RemodelDataStore {
  const storePath = getStorePath(publicDir);
  if (fs.existsSync(storePath)) {
    try {
      const data = fs.readFileSync(storePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Failed to parse ai-remodel-data.json, returning defaults:', err);
    }
  }
  
  // Return default store structure
  const defaultStore: RemodelDataStore = {
    settings: DEFAULT_SETTINGS,
    projects: [],
    quoteRequests: [],
    usageLogs: []
  };
  writeStore(publicDir, defaultStore);
  return defaultStore;
}

function writeStore(publicDir: string, data: RemodelDataStore) {
  const storePath = getStorePath(publicDir);
  try {
    fs.writeFileSync(storePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write to ai-remodel-data.json:', err);
  }
}

// Map high-fidelity Unsplash mock images based on room and style for seamless preview fallsbacks
const FALLBACK_IMAGES: Record<string, string[]> = {
  'living room': [
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', // modern living room
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', // luxury interior
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'  // scandinavian living
  ],
  'kitchen': [
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80', // contemporary kitchen
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'  // luxury kitchen
  ],
  'bedroom': [
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80', // luxury bedroom
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80'  // modern minimalist bedroom
  ],
  'bathroom': [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80', // marble bathroom
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80'  // modern bath
  ],
  'compound/facade': [
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', // luxury villa exterior
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'  // modern building exterior
  ],
  'private garden': [
    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80', // bespoke garden
    'https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&w=1200&q=80'  // modern pool garden
  ],
  'general': [
    'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80', // luxury interior lobby
    'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80'  // high end design study
  ]
};

function getFallbackImage(area: string, styleId: string, index: number): string {
  const normArea = area.toLowerCase();
  let key = 'general';
  
  if (normArea.includes('living')) key = 'living room';
  else if (normArea.includes('kitchen')) key = 'kitchen';
  else if (normArea.includes('bedroom')) key = 'bedroom';
  else if (normArea.includes('bath')) key = 'bathroom';
  else if (normArea.includes('garden') || normArea.includes('pool') || normArea.includes('compound')) key = 'private garden';
  else if (normArea.includes('facade') || normArea.includes('roofing') || normArea.includes('duplex') || normArea.includes('building')) key = 'compound/facade';

  const list = FALLBACK_IMAGES[key] || FALLBACK_IMAGES['general'];
  return list[index % list.length];
}

interface AIModelAdapter {
  id: string;
  name: string;
  remodelImage(options: {
    imageBase64: string;
    mimeType: string;
    prompt: string;
    area: string;
    style: string;
    palette: string;
    budget: string;
    instructions: string;
    apiKey?: string;
    uploadsDir: string;
  }): Promise<{ imageUrl: string; reportPrompt: string; isFallback?: boolean; errorDetails?: string }>;
}

function saveBase64Image(base64Data: string, uploadsDir: string, prefix: string): string {
  let base64Clean = base64Data;
  let ext = 'jpg';
  
  if (base64Data.startsWith('data:image')) {
    const matches = base64Data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      ext = matches[1];
      if (ext.includes('+')) {
        ext = ext.split('+')[0];
      }
      base64Clean = matches[2];
    }
  }
  
  const buffer = Buffer.from(base64Clean, 'base64');
  const fileName = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}.${ext}`;
  const filePath = path.join(uploadsDir, fileName);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${fileName}`;
}

async function saveRemoteImage(url: string, uploadsDir: string, prefix: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch remote image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = 'jpg';
  const fileName = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}.${ext}`;
  const filePath = path.join(uploadsDir, fileName);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${fileName}`;
}

// Set up routes on Express app
export function setupRemodelRoutes(app: any, publicDir: string) {
  
  // 1. GET Remodel configurations, settings, usage summaries
  app.get('/api/remodel/data', (req: Request, res: Response) => {
    try {
      const store = readStore(publicDir);
      return res.json({
        settings: store.settings,
        quoteRequests: store.quoteRequests,
        projectsCount: store.projects.length,
        usageLogs: store.usageLogs,
        projects: store.projects.map(p => ({
          id: p.id,
          date: p.date,
          category: p.category,
          area: p.area,
          style: p.style,
          palette: p.palette,
          userEmail: p.userEmail,
          userName: p.userName,
          conceptsCount: p.concepts.length
        }))
      });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  });

  // 2. POST Save Admin settings
  app.post('/api/remodel/settings', (req: Request, res: Response) => {
    try {
      const { settings } = req.body;
      if (!settings) {
        return res.status(400).json({ error: 'Settings object is required' });
      }

      const store = readStore(publicDir);
      store.settings = {
        ...store.settings,
        ...settings
      };
      writeStore(publicDir, store);
      
      return res.json({ success: true, settings: store.settings });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  });

  // 3. GET user's saved projects
  app.get('/api/remodel/user-projects', (req: Request, res: Response) => {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ error: 'Email parameter is required' });
      }

      const store = readStore(publicDir);
      const userProjects = store.projects.filter(p => p.userEmail && p.userEmail.toLowerCase() === (email as string).toLowerCase());
      
      return res.json(userProjects);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  });

  // 4. POST submit a quotation request
  app.post('/api/remodel/request-quote', (req: Request, res: Response) => {
    try {
      const { projectId, conceptIndex, user, notes, originalImage, generatedImage, designReport, details } = req.body;
      
      if (!user || !user.email) {
        return res.status(400).json({ error: 'User contact details are required' });
      }

      const store = readStore(publicDir);
      
      const newRequest: QuoteRequest = {
        id: 'quote-' + Date.now(),
        projectId: projectId || 'guest-project',
        conceptIndex: conceptIndex ?? 0,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        user,
        notes: notes || '',
        originalImage: originalImage || '',
        generatedImage: generatedImage || '',
        designReport: designReport || null,
        details: details || null,
        status: 'Pending'
      };

      store.quoteRequests.unshift(newRequest);
      writeStore(publicDir, store);

      return res.json({ success: true, quoteId: newRequest.id });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  });

  // 5. POST Save direct projects / admin portal viewing
  app.get('/api/remodel/quote-requests', (req: Request, res: Response) => {
    try {
      const store = readStore(publicDir);
      return res.json(store.quoteRequests);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  });

  app.post('/api/remodel/update-quote-status', (req: Request, res: Response) => {
    try {
      const { quoteId, status } = req.body;
      if (!quoteId || !status) {
        return res.status(400).json({ error: 'QuoteId and status are required' });
      }

      const store = readStore(publicDir);
      store.quoteRequests = store.quoteRequests.map(q => q.id === quoteId ? { ...q, status } : q);
      writeStore(publicDir, store);

      return res.json({ success: true });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  });

  // 6. POST core AI Remodeling Concept generation (Real Gemini + fallback)
  app.post('/api/remodel/generate', async (req: Request, res: Response) => {
    try {
      const { image, mimeType, category, area, style, palette, budget, instructions, numConcepts, user } = req.body;
      
      if (!image) {
        return res.status(400).json({ error: 'Room photograph image is required' });
      }

      const store = readStore(publicDir);
      const activeProvider = store.settings.activeProvider;
      const apiKey = process.env.GEMINI_API_KEY;

      const uploadsDir = path.join(publicDir, 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Securely upload and temporarily store the original image
      let originalImageUrl = '';
      try {
        originalImageUrl = saveBase64Image(image, uploadsDir, 'original');
      } catch (saveErr) {
        console.error('Failed to save original image to disk:', saveErr);
        originalImageUrl = image; // fallback to base64 if save fails
      }

      // 1. Log Usage
      const usage: UsageLog = {
        id: 'usage-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        timestamp: new Date().toISOString(),
        provider: activeProvider,
        category,
        area,
        style
      };
      store.usageLogs.push(usage);

      const concepts: any[] = [];
      const projectId = 'remodel-' + Date.now();

      // Implement robust adapters for multiple AI image-editing providers
      const providers: Record<string, AIModelAdapter> = {
        google: {
          id: 'google',
          name: 'Google Gemini',
          async remodelImage({ imageBase64, mimeType, prompt, area, style, palette, budget, instructions, apiKey, uploadsDir }) {
            if (!apiKey) {
              throw new Error('Google Gemini API Key is missing in workspace settings.');
            }
            const ai = new GoogleGenAI({
              apiKey: apiKey,
              httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
            });

            console.log(`[Google Gemini Adapter] Stage 1: Spatial layout analysis with gemini-3.5-flash...`);
            const analysisResponse = await ai.models.generateContent({
              model: 'gemini-3.5-flash',
              contents: {
                parts: [
                  {
                    inlineData: {
                      data: imageBase64,
                      mimeType: mimeType || 'image/jpeg'
                    }
                  },
                  {
                    text: 'Analyze this room or architectural space shell. Describe its exact structural dimensions, window and door placements, columns, ceiling beams, and architectural perspective. Do not mention any construction mess, bare concrete, or unfinished state. Focus on the raw spatial volume so that an AI image generator can perfectly rebuild it.'
                  }
                ]
              }
            });

            const spatialLayout = analysisResponse.text || `${area} with clean modern lines.`;

            const refinedPrompt = `A premium luxury, professional, publication-ready architectural photograph of the remodeled ${area}. Layout structural basis: ${spatialLayout}. Design Style: ${style}. Colour Palette preset: ${palette}. Remodeling instructions: ${instructions || 'Bespoke finishing with high-end premium finishes.'} Quality Details: Impeccably clean, photorealistic, elegant warm layered architectural lighting, flawless materials, tailored crown moldings, high-end marble or hardwood. No people, no construction dust, perfect professional staging.`;

            console.log(`[Google Gemini Adapter] Stage 2: Synthesis with gemini-3.1-flash-lite-image...`);
            const imageResponse = await ai.models.generateContent({
              model: 'gemini-3.1-flash-lite-image',
              contents: {
                parts: [
                  {
                    inlineData: {
                      data: imageBase64,
                      mimeType: mimeType || 'image/jpeg'
                    }
                  },
                  {
                    text: `Based on this room's structural layout: ${spatialLayout}. Redesign and remodel it following these instructions: ${refinedPrompt}. Make it photorealistic, clean, with perfect professional staging.`
                  }
                ]
              },
              config: {
                imageConfig: {
                  aspectRatio: "16:9"
                }
              }
            });

            let base64Data = '';
            for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
              if (part.inlineData?.data) {
                base64Data = part.inlineData.data;
                break;
              }
            }

            if (!base64Data) {
              throw new Error('Gemini image model did not return any image bytes.');
            }

            const savedUrl = saveBase64Image(base64Data, uploadsDir, 'remodel-google');
            return {
              imageUrl: savedUrl,
              reportPrompt: refinedPrompt
            };
          }
        },
        openai: {
          id: 'openai',
          name: 'OpenAI DALL-E',
          async remodelImage({ imageBase64, mimeType, prompt, area, style, palette, budget, instructions, uploadsDir }) {
            const openAiKey = process.env.OPENAI_API_KEY;
            if (!openAiKey) {
              throw new Error('OpenAI API Key is missing. Configure OPENAI_API_KEY in the server settings.');
            }

            console.log(`[OpenAI Adapter] Stage 1: Spatial analysis with GPT-4o-mini...`);
            let spatialLayout = '';
            try {
              const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${openAiKey}`
                },
                body: JSON.stringify({
                  model: 'gpt-4o-mini',
                  messages: [
                    {
                      role: 'user',
                      content: [
                        { type: 'text', text: 'Describe the precise geometric layout, windows, doors, perspective and furniture boundaries of this room/space so we can remodel it in the same layout. Be extremely descriptive of boundaries and perspective.' },
                        { type: 'image_url', image_url: { url: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}` } }
                      ]
                    }
                  ],
                  max_tokens: 300
                })
              });

              if (!visionResponse.ok) {
                const errText = await visionResponse.text();
                throw new Error(`OpenAI Vision failed: ${errText}`);
              }

              const visionData = await visionResponse.json();
              spatialLayout = visionData.choices?.[0]?.message?.content || `${area} raw structure.`;
            } catch (visionErr: any) {
              console.log('[OpenAI Adapter] GPT-4o-mini Vision was unavailable. Attempting Gemini 3.5-flash spatial analysis instead.');
              const geminiApiKey = process.env.GEMINI_API_KEY;
              if (geminiApiKey) {
                try {
                  const ai = new GoogleGenAI({
                    apiKey: geminiApiKey,
                    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
                  });
                  const analysisResponse = await ai.models.generateContent({
                    model: 'gemini-3.5-flash',
                    contents: {
                      parts: [
                        {
                          inlineData: {
                            data: imageBase64,
                            mimeType: mimeType || 'image/jpeg'
                          }
                        },
                        {
                          text: 'Analyze this room or architectural space shell. Describe its exact structural dimensions, window and door placements, columns, ceiling beams, and architectural perspective. Do not mention construction mess or bare concrete. Focus on raw spatial volume.'
                        }
                      ]
                    }
                  });
                  spatialLayout = analysisResponse.text || `${area} raw structure.`;
                  console.log('[OpenAI Adapter] Gemini 3.5-flash spatial analysis successfully handled layout mapping!');
                } catch (geminiErr: any) {
                  console.log('[OpenAI Adapter] Gemini spatial analysis was also unavailable, moving forward with default parameters.');
                  spatialLayout = `${area} with clean modern lines.`;
                }
              } else {
                spatialLayout = `${area} with clean modern lines.`;
              }
            }

            const refinedPrompt = `A high-end luxury architectural photograph of the remodeled ${area}. Structural layout: ${spatialLayout}. Architectural style: ${style}. Palette: ${palette}. Client details: ${instructions || 'None'}. Exquisite, publication-grade, no distortion, highly realistic.`;

            console.log(`[OpenAI Adapter] Stage 2: Generation with DALL-E 3...`);
            const dalleResponse = await fetch('https://api.openai.com/v1/images/generations', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openAiKey}`
              },
              body: JSON.stringify({
                model: 'dall-e-3',
                prompt: refinedPrompt,
                n: 1,
                size: '1024x1024',
                response_format: 'url'
              })
            });

            if (!dalleResponse.ok) {
              const errText = await dalleResponse.text();
              throw new Error(`DALL-E 3 Generation failed: ${errText}`);
            }

            const dalleData = await dalleResponse.json();
            const remoteUrl = dalleData.data?.[0]?.url;
            if (!remoteUrl) {
              throw new Error('DALL-E 3 did not return an image URL.');
            }

            const savedUrl = await saveRemoteImage(remoteUrl, uploadsDir, 'remodel-openai');
            return {
              imageUrl: savedUrl,
              reportPrompt: refinedPrompt
            };
          }
        },
        flux: {
          id: 'flux',
          name: 'FLUX.1 Pro',
          async remodelImage({ imageBase64, mimeType, prompt, area, style, palette, budget, instructions, uploadsDir }) {
            const fluxKey = process.env.FLUX_API_KEY || process.env.REPLICATE_API_TOKEN;
            if (!fluxKey) {
              throw new Error('FLUX API Key / Replicate Token is missing. Configure FLUX_API_KEY or REPLICATE_API_TOKEN in server settings.');
            }

            console.log(`[FLUX Adapter] Initiating FLUX.1 Pro image synthesis via Replicate...`);
            const refinedPrompt = `A premium, award-winning luxury interior design photograph of ${area}, remodeled in ${style} style, featuring a ${palette} palette. Custom requirements: ${instructions || 'None'}. Flawless materials and warm layered lighting.`;

            const response = await fetch('https://api.replicate.com/v1/predictions', {
              method: 'POST',
              headers: {
                'Authorization': `Token ${fluxKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                version: "2b017d0b67edd2ee1401238df956b9c1fe0e12de108728d116fc539dfb83088b",
                input: {
                  prompt: refinedPrompt,
                  image: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`,
                  prompt_strength: 0.85,
                  num_outputs: 1,
                  aspect_ratio: "16:9"
                }
              })
            });

            if (!response.ok) {
              const errText = await response.text();
              throw new Error(`FLUX.1 API request failed: ${errText}`);
            }

            let prediction = await response.json();
            let predictionId = prediction.id;
            let status = prediction.status;
            let finalOutput = '';

            console.log(`[FLUX Adapter] Polling prediction ${predictionId} for completion...`);
            for (let attempt = 0; attempt < 15; attempt++) {
              if (status === 'succeeded') {
                finalOutput = prediction.output?.[0] || '';
                break;
              } else if (status === 'failed' || status === 'canceled') {
                throw new Error('FLUX synthesis was canceled or failed on Replicate.');
              }
              await new Promise(resolve => setTimeout(resolve, 1500));
              const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
                headers: { 'Authorization': `Token ${fluxKey}` }
              });
              if (pollRes.ok) {
                const polled = await pollRes.json();
                status = polled.status;
                prediction = polled;
              }
            }

            if (!finalOutput) {
              throw new Error('FLUX prediction timed out or did not return output.');
            }

            const savedUrl = await saveRemoteImage(finalOutput, uploadsDir, 'remodel-flux');
            return {
              imageUrl: savedUrl,
              reportPrompt: refinedPrompt
            };
          }
        },
        sdxl: {
          id: 'sdxl',
          name: 'Stable Diffusion XL',
          async remodelImage({ imageBase64, mimeType, prompt, area, style, palette, budget, instructions, uploadsDir }) {
            const sdKey = process.env.STABILITY_API_KEY || process.env.SDXL_API_KEY;
            if (!sdKey) {
              throw new Error('Stability AI API Key is missing. Configure STABILITY_API_KEY or SDXL_API_KEY in server settings.');
            }

            console.log(`[SDXL Adapter] Initiating SDXL image-to-image synthesis...`);
            const refinedPrompt = `Exquisite luxury architectural photograph, fully finished remodeled ${area}, style is ${style}, colour palette is ${palette}, client wishes: ${instructions || 'none'}. Highly realistic, photorealistic interior, flawless, award-winning, 8k resolution.`;

            const buffer = Buffer.from(imageBase64, 'base64');
            const boundary = '----WebKitFormBoundarySDXL' + Math.random().toString(36).substring(2);
            
            const payloadBuffer = Buffer.concat([
              Buffer.from(`--${boundary}\r\n`),
              Buffer.from(`Content-Disposition: form-data; name="init_image"; filename="init.jpg"\r\n`),
              Buffer.from(`Content-Type: ${mimeType || 'image/jpeg'}\r\n\r\n`),
              buffer,
              Buffer.from(`\r\n--${boundary}\r\n`),
              Buffer.from(`Content-Disposition: form-data; name="text_prompts[0][text]"\r\n\r\n`),
              Buffer.from(refinedPrompt),
              Buffer.from(`\r\n--${boundary}\r\n`),
              Buffer.from(`Content-Disposition: form-data; name="text_prompts[0][weight]"\r\n\r\n`),
              Buffer.from('1.0'),
              Buffer.from(`\r\n--${boundary}\r\n`),
              Buffer.from(`Content-Disposition: form-data; name="init_image_mode"\r\n\r\n`),
              Buffer.from('IMAGE_STRENGTH'),
              Buffer.from(`\r\n--${boundary}\r\n`),
              Buffer.from(`Content-Disposition: form-data; name="image_strength"\r\n\r\n`),
              Buffer.from('0.35'),
              Buffer.from(`\r\n--${boundary}--\r\n`)
            ]);

            const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${sdKey}`,
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Accept': 'application/json'
              },
              body: payloadBuffer
            });

            if (!response.ok) {
              const errText = await response.text();
              throw new Error(`SDXL API error: ${errText}`);
            }

            const resJson = await response.json();
            const base64Out = resJson.artifacts?.[0]?.base64;
            if (!base64Out) {
              throw new Error('Stability AI did not return any image artifacts.');
            }

            const savedUrl = saveBase64Image(base64Out, uploadsDir, 'remodel-sdxl');
            return {
              imageUrl: savedUrl,
              reportPrompt: refinedPrompt
            };
          }
        }
      };

      const activeAdapter = providers[activeProvider] || providers['google'];
      console.log(`[Remodel Server] Active AI Adapter pipeline: ${activeAdapter.name}`);

      const base64Clean = image.startsWith('data:image') ? image.split(',')[1] : image;
      const cleanMime = mimeType || 'image/jpeg';

      const conceptPromises = Array.from({ length: numConcepts || 1 }).map(async (_, index) => {
        let generatedImageUrl = '';
        let isFallback = false;
        let errorDetails = '';
        let reportPrompt = '';

        try {
          const remodelResult = await activeAdapter.remodelImage({
            imageBase64: base64Clean,
            mimeType: cleanMime,
            prompt: store.settings.promptTemplate,
            area,
            style,
            palette,
            budget,
            instructions,
            apiKey: apiKey,
            uploadsDir
          });

          generatedImageUrl = remodelResult.imageUrl;
          reportPrompt = remodelResult.reportPrompt;
        } catch (apiErr: any) {
          console.log(`[Remodel Server] ${activeAdapter.name} adapter initiated matching curated mockup design.`);
          errorDetails = apiErr?.message || String(apiErr);
          isFallback = true;
          
          const fallbackMockUrl = getFallbackImage(area, style, index);
          try {
            if (fallbackMockUrl.startsWith('http')) {
              generatedImageUrl = await saveRemoteImage(fallbackMockUrl, uploadsDir, 'fallback-mock');
            } else {
              generatedImageUrl = fallbackMockUrl;
            }
          } catch (dlErr: any) {
            console.log('Using direct fallback path:', dlErr?.message || dlErr);
            generatedImageUrl = fallbackMockUrl;
          }
        }

        // Generate Structured Design Report with Gemini 3.5 Flash
        let report: any = null;
        if (apiKey) {
          try {
            const ai = new GoogleGenAI({
              apiKey: apiKey,
              httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
            });
            
            console.log(`[Remodel Server] Drafting structured Design Report for Concept ${index + 1} with gemini-3.5-flash...`);
            const reportResponse = await ai.models.generateContent({
              model: 'gemini-3.5-flash',
              contents: `Generate a structured, professional, extremely detailed interior design and finish report in JSON format for the following project parameters:
Area: ${area}
Category: ${category}
Design Style: ${style}
Colour Palette Preset: ${palette}
Budget Class: ${budget}
Client instructions: ${instructions || 'None'}
Conceptual focus prompt: ${reportPrompt || 'Bespoke finishing'}.`,
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  required: ['summary', 'materials', 'colourPalette', 'flooring', 'lighting', 'estimatedCost', 'timeline', 'sustainability'],
                  properties: {
                    summary: { type: Type.STRING, description: 'Detailed narrative design report summary.' },
                    materials: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of 4 recommended premium high-end materials.' },
                    colourPalette: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        required: ['name', 'hex'],
                        properties: {
                          name: { type: Type.STRING, description: 'Color description name.' },
                          hex: { type: Type.STRING, description: 'Hex code starting with #.' }
                        }
                      },
                      description: 'List of exactly 4 color chips matching the palette.'
                    },
                    flooring: { type: Type.STRING, description: 'Recommended premium flooring option.' },
                    lighting: { type: Type.STRING, description: 'Bespoke layered lighting suggestions.' },
                    estimatedCost: { type: Type.STRING, description: 'Estimated budget range in Naira.' },
                    timeline: { type: Type.STRING, description: 'Estimated schedule, e.g., 4-6 Weeks.' },
                    sustainability: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of 2 green building or sustainability tips.' }
                  }
                }
              }
            });

            if (reportResponse.text) {
              report = JSON.parse(reportResponse.text.trim());
            }
          } catch (repErr: any) {
            console.log(`Gemini Report Generation failed for Concept ${index + 1}:`, repErr?.message || repErr);
          }
        }

        if (!report) {
          report = getFallbackReport(area, style, palette, budget);
        }

        return {
          imageUrl: generatedImageUrl,
          report,
          isFallback,
          errorDetails
        };
      });

      const conceptsResults = await Promise.all(conceptPromises);

      // Save generated project to Store (using locally stored images to protect database size)
      const newProject: RemodelProject = {
        id: projectId,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        category,
        area,
        style,
        palette,
        budget,
        instructions: instructions || '',
        originalImage: originalImageUrl,
        concepts: conceptsResults,
        userEmail: user?.email,
        userName: user?.name
      };

      store.projects.unshift(newProject);
      writeStore(publicDir, store);

      return res.json({
        projectId,
        concepts: conceptsResults,
        originalImageUrl
      });

    } catch (err: any) {
      console.log('Generation API endpoint exception handling:', err?.message || err);
      return res.status(500).json({ error: err.message || 'Conceptualization failed.' });
    }
  });

  console.log('[Remodel Server] Custom SpacePro AI Remodel Studio API routes loaded.');
}

// Fallback architectural report generator
function getFallbackReport(area: string, style: string, palette: string, budget: string): any {
  const normBudget = budget.toLowerCase();
  let costRange = '₦6,500,000 - ₦9,000,000';
  let timeline = '4 - 6 Weeks';

  if (normBudget.includes('under5m')) {
    costRange = '₦3,800,000 - ₦4,900,000';
    timeline = '3 - 4 Weeks';
  } else if (normBudget.includes('5m-15m')) {
    costRange = '₦7,500,000 - ₦11,500,000';
    timeline = '5 - 7 Weeks';
  } else if (normBudget.includes('15m-50m')) {
    costRange = '₦22,000,000 - ₦35,000,000';
    timeline = '8 - 12 Weeks';
  } else if (normBudget.includes('50m+')) {
    costRange = '₦65,000,000 - ₦95,000,000+';
    timeline = '16 - 24 Weeks';
  }

  // Pre-curated high-end palette codes
  let paletteColors = [
    { name: 'Warm Travertine', hex: '#EAE6DF' },
    { name: 'Pure Gypsum', hex: '#F5F5F0' },
    { name: 'Raw Travertine', hex: '#D2C9BD' },
    { name: 'Walnut Stain', hex: '#3E3A36' }
  ];

  if (palette.includes('Slate')) {
    paletteColors = [
      { name: 'Cement Polish', hex: '#E1E4E6' },
      { name: 'Satin Matte White', hex: '#FFFFFF' },
      { name: 'Charcoal Slats', hex: '#8E959A' },
      { name: 'Midnight Trim', hex: '#1C2022' }
    ];
  } else if (palette.includes('Emerald')) {
    paletteColors = [
      { name: 'Alabaster Plaster', hex: '#F2F1ED' },
      { name: 'Imperial Emerald', hex: '#0E3A2F' },
      { name: 'Brushed Brass', hex: '#D4AF37' },
      { name: 'Gold Trim', hex: '#E3D7C5' }
    ];
  } else if (palette.includes('Clay')) {
    paletteColors = [
      { name: 'Terracotta Plaster', hex: '#C87D55' },
      { name: 'Sanded Travertine', hex: '#FDFBF7' },
      { name: 'Warm Clay', hex: '#EBD2BE' },
      { name: 'Ebony Wood', hex: '#4A3325' }
    ];
  }

  return {
    summary: `A majestic architectural remodel of the ${area}, synthesized perfectly under the ${style} design blueprint. The concept prioritizes spatial breathing ratios, pristine hand-applied plastering panels, and seamless recessed linear lighting. Every volume has been re-balanced to maximize negative space, keeping structural additions hidden and elegant.`,
    materials: [
      'Bespoke hand-applied Carrara Micro-cement',
      'Solid bookmatched titanium travertine slabs',
      'Satin brushed architectural brass trims',
      'Imported zero-VOC acoustic wood panel slats'
    ],
    colourPalette: paletteColors,
    flooring: 'Seamless matte-finish premium Venetian Terrazzo or large-format Italian travertine.',
    lighting: 'Recessed dual-tone 2700K warm LED profile strips paired with fluted brass pendants.',
    estimatedCost: costRange,
    timeline: timeline,
    sustainability: [
      'Integrate locally sourced eco-cement overlays to cut down transport carbon footprints.',
      'Incorporate intelligent, low-voltage Warm LED profiles with smart motion sensing triggers.'
    ]
  };
}
