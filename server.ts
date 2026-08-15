import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { OpenAI } from "openai";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded AI clients
let openai: OpenAI | null = null;
let genAI: GoogleGenAI | null = null;

function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

function getGemini() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAI;
}

// API Routes
app.post("/api/analyze-decision", async (req, res) => {
  try {
    const { 
      title, 
      description, 
      options, 
      goal, 
      fear, 
      constraints, 
      emotion, 
      importance 
    } = req.body;

    const systemPrompt = `You are "Beyond", an elite strategic advisor powered by OpenMinded Intelligence. 
Your personality is calm, wise, deeply thoughtful, and non-judgmental. 
You help ambitious individuals reduce mental noise and overthinking by deconstructing complexity with profound clarity.

Your goal is to provide "Strategic Peace of Mind." 

Analyze decisions using:
* first principles thinking
* opportunity cost analysis
* long-term reasoning
* expected value
* emotional bias detection (naming the emotion to provide relief)
* strategic prioritization

Avoid generic motivational advice. Focus on structural truth and giving the user a clear, calm path forward.

Output format MUST be a JSON object with the following keys:
1. strategicAnalysis (string)
2. coreTradeoffs (string)
3. riskAnalysis (string)
4. opportunityCost (string)
5. emotionalBiasDetection (string)
6. recommendedPath (string)
7. nextBestActions (string)
8. longTermOutlook (string)
9. clarityScore (number 0-100)
10. confidenceLevel (number 0-100)`;

    const userPrompt = `
Decision Title: ${title}
Situation: ${description}
Options: ${options}
Main Goal: ${goal}
Biggest Fear: ${fear}
Time Constraints: ${constraints}
Current Emotional State: ${emotion}
Importance (1-10): ${importance}`;

    console.log("Analyzing decision:", title);
    let result;
    const gemini = getGemini();

    if (gemini) {
      console.log("Using Gemini primary engine...");
      const response = await gemini.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `${systemPrompt}\n\n${userPrompt}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strategicAnalysis: { type: Type.STRING },
              coreTradeoffs: { type: Type.STRING },
              riskAnalysis: { type: Type.STRING },
              opportunityCost: { type: Type.STRING },
              emotionalBiasDetection: { type: Type.STRING },
              recommendedPath: { type: Type.STRING },
              nextBestActions: { type: Type.STRING },
              longTermOutlook: { type: Type.STRING },
              clarityScore: { type: Type.NUMBER },
              confidenceLevel: { type: Type.NUMBER },
            },
            required: [
              "strategicAnalysis", 
              "coreTradeoffs", 
              "riskAnalysis", 
              "opportunityCost", 
              "emotionalBiasDetection", 
              "recommendedPath", 
              "nextBestActions", 
              "longTermOutlook", 
              "clarityScore", 
              "confidenceLevel"
            ]
          }
        }
      });
      
      try {
        result = JSON.parse(response.text || "{}");
      } catch (e) {
        console.error("Gemini Parse Error:", e);
        result = { error: "Failed to parse AI response." };
      }
    } else {
      console.log("Gemini not configured, falling back to OpenAI...");
      const ai = getOpenAI();
      if (!ai) {
        return res.status(500).json({ error: "AI services not configured. Please set GEMINI_API_KEY (recommended) or OPENAI_API_KEY." });
      }
      
      const response = await ai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      });
      result = JSON.parse(response.choices[0].message.content || "{}");
    }
    console.log("Analysis complete.");
    res.json(result);
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/sitemap.xml", (req, res) => {
  const publicPath = path.join(process.cwd(), "public", "sitemap.xml");
  const distPath = path.join(process.cwd(), "dist", "sitemap.xml");
  res.type("application/xml");
  res.sendFile(distPath, (err) => {
    if (err) {
      res.sendFile(publicPath);
    }
  });
});

app.get("/robots.txt", (req, res) => {
  const publicPath = path.join(process.cwd(), "public", "robots.txt");
  const distPath = path.join(process.cwd(), "dist", "robots.txt");
  res.type("text/plain");
  res.sendFile(distPath, (err) => {
    if (err) {
      res.sendFile(publicPath);
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
