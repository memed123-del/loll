import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

let providersCache: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

const MOCK_PROVIDERS = {
  status: "success",
  data: [
    { provider_name: "Pragmatic Play" },
    { provider_name: "PG Soft" },
    { provider_name: "Habanero" },
    { provider_name: "Joker Gaming" },
    { provider_name: "Microgaming" },
    { provider_name: "Spadegaming" },
    { provider_name: "Evolution Gaming" },
    { provider_name: "Playtech" },
    { provider_name: "JILI" },
    { provider_name: "CQ9" },
    { provider_name: "Red Tiger" },
    { provider_name: "NetEnt" }
  ]
};

// API Routes
app.get("/api/providers", async (req, res) => {
  const now = Date.now();
  if (providersCache && (now - lastFetchTime < CACHE_DURATION)) {
    return res.json(providersCache);
  }

  const host = process.env.RAPIDAPI_HOST || "live-casino-slots-evolution-jili-and-50-plus-provider.p.rapidapi.com";
  const key = process.env.RAPIDAPI_KEY || "f63c48ae45msh98c9628f20c2ebfp194441jsn7dae61278bff";

  if (!host || host === "undefined") {
    return res.json(MOCK_PROVIDERS);
  }

  try {
    const response = await axios.get(
      `https://${host}/getallproviders`,
      {
        headers: {
          "x-rapidapi-key": key,
          "x-rapidapi-host": host,
        },
        timeout: 5000
      }
    );
    
    providersCache = response.data;
    lastFetchTime = now;
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status;
    if (status === 403 || status === 429) {
      console.warn(`API Limit/Auth Issue (${status}): Serving high-quality mock data instead.`);
    } else {
      console.error("API Error:", error.message);
    }
    // Return mock data if API fails (403/429/etc)
    res.json(MOCK_PROVIDERS);
  }
});

app.post("/api/get-game-url", async (req, res) => {
  const host = process.env.RAPIDAPI_HOST || "live-casino-slots-evolution-jili-and-50-plus-provider.p.rapidapi.com";
  const key = process.env.RAPIDAPI_KEY || "f63c48ae45msh98c9628f20c2ebfp194441jsn7dae61278bff";
  
  // Generate a unique username if not provided to avoid "Username already used" errors
  // MUST be alphanumeric (no underscores) as per API requirements
  const { gameId, username = `user${Math.random().toString(36).substring(2, 10)}` } = req.body;

  try {
    const homeUrl = process.env.APP_URL || "https://betnex.co";
    const absoluteHomeUrl = homeUrl.startsWith('http') ? homeUrl : `https://${homeUrl}`;

    const response = await axios.post(
      `https://${host}/getgameurl`,
      {
        username,
        gameId: gameId || "874c49d5d915de9b82f66088f9794789",
        lang: "en",
        money: 0,
        home_url: absoluteHomeUrl,
        platform: 1,
        currency: "INR"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-key": key,
          "x-rapidapi-host": host,
        }
      }
    );
    console.log(`Game URL generated for ${username}: ${response.data.data}`);
    res.json({ ...response.data, usedUsername: username });
  } catch (error: any) {
    if (error.response) {
      console.error("API Error (Game URL) - Status:", error.response.status);
      console.error("API Error (Game URL) - Data:", JSON.stringify(error.response.data));
    } else {
      console.error("API Error (Game URL):", error.message);
    }
    
    res.status(error.response?.status || 500).json({ 
      error: "Failed to get game URL",
      message: error.response?.data?.message || error.message,
      details: error.response?.data
    });
  }
});

  // Vite middleware for development
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
    console.log(`NagaEmas Server running on http://localhost:${PORT}`);
  });
}

startServer();
