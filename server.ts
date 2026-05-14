import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded AI clients
let openai: OpenAI | null = null;
let genAI: GoogleGenerativeAI | null = null;

function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

function getGemini() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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
You help ambitious individuals make high-quality life decisions by deconstructing complexity with cold logical precision tempered by profound human wisdom.

Analyze decisions using:
* first principles thinking
* opportunity cost analysis
* long-term reasoning
* expected value
* emotional bias detection
* strategic prioritization

Avoid generic motivational advice. Focus on structural truth and asymmetric upside.

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
    const ai = getOpenAI();

    if (ai) {
      const response = await ai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      });
      result = JSON.parse(response.choices[0].message.content || "{}");
    } else {
      console.log("Using Gemini fallback...");
      const gemini = getGemini();
      if (!gemini) {
        return res.status(500).json({ error: "AI services not configured. Please set OPENAI_API_KEY or GEMINI_API_KEY." });
      }
      const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `${systemPrompt}\n\n${userPrompt}\n\nIMPORTANT: You must return ONLY valid JSON.`;
      const response = await model.generateContent(prompt);
      const text = response.response.text();
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (e) {
        console.error("Gemini Parse Error:", e, text);
        result = { error: "Failed to parse AI response. Raw response logged." };
      }
    }
    console.log("Analysis complete.");
    res.json(result);
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: error.message });
  }
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
