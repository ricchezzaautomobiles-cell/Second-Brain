import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Direct sitemap routes
  app.get(['/sitemap.xml', '/sitemap'], (req, res) => {
    const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      return res.sendFile(sitemapPath);
    }
    const distSitemap = path.resolve(process.cwd(), 'dist', 'sitemap.xml');
    if (fs.existsSync(distSitemap)) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      return res.sendFile(distSitemap);
    }
    res.status(404).send('Sitemap not found');
  });

  // Direct robots.txt route
  app.get('/robots.txt', (req, res) => {
    const robotsPath = path.resolve(process.cwd(), 'public', 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.sendFile(robotsPath);
    }
    res.status(404).send('Not found');
  });

  // AI Analysis route (Server-side Gemini API)
  app.post('/api/ai/analyze', async (req, res) => {
    try {
      const { content, recipientCategory } = req.body;

      if (!content || typeof content !== 'string' || content.trim().length < 5) {
        return res.status(400).json({ message: 'Message content is required and must be at least 5 characters.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          message: 'GEMINI_API_KEY is not configured on the server. Please check Settings > Secrets.',
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `Analyze the emotional tone and underlying subtext of this unsent message written to "${recipientCategory || 'someone'}":

"${content}"

Provide a compassionate, empathetic analysis formatted as JSON.
Guidelines:
1. Identify 2 to 4 primary emotions present in the text with intensity percentages adding up to 100%.
2. Describe the underlying intention using gentle, tentative wording (e.g. "may suggest", "might indicate", "appears to reflect").
3. Provide a thoughtful reflection or insight (e.g. "one possible interpretation is...").
4. Provide a supportive writing prompt to help the author process their feelings.
5. NEVER state psychological or psychiatric diagnoses as facts. Do not give medical or clinical advice.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an empathetic, emotionally intelligent assistant for UNSENT, a private journal app. Your task is to offer compassionate, cautious subtext analysis of unsent messages without diagnosing mental health or judging the writer.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              emotions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    emotion: { type: Type.STRING, description: 'Name of emotion (e.g. Longing, Regret, Hope, Fear, Love, Anger)' },
                    intensityPercentage: { type: Type.NUMBER, description: 'Percentage score from 0 to 100' },
                  },
                  required: ['emotion', 'intensityPercentage'],
                },
              },
              underlyingIntention: {
                type: Type.STRING,
                description: 'Underlying intention using cautious wording like "may suggest" or "might indicate"',
              },
              reflection: {
                type: Type.STRING,
                description: 'Reflective insight into the subtext',
              },
              writingPrompt: {
                type: Type.STRING,
                description: 'Supportive journaling prompt for self-reflection',
              },
            },
            required: ['emotions', 'underlyingIntention', 'reflection', 'writingPrompt'],
          },
        },
      });

      const responseText = response.text || '{}';
      const parsedAnalysis = JSON.parse(responseText);

      res.json({ analysis: parsedAnalysis });
    } catch (error: any) {
      console.error('Error in /api/ai/analyze:', error);
      res.status(500).json({
        message: error?.message || 'Failed to analyze text. Please try again.',
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        const templatePath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UNSENT Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
