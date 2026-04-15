import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase limit for base64 images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API to get site data from Supabase
  app.get("/api/data", async (req, res) => {
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        error: "Supabase configuration missing", 
        details: "Please set SUPABASE_URL and SUPABASE_ANON_KEY in your environment variables." 
      });
    }
    try {
      const { data, error } = await supabase
        .from("site_config")
        .select("content")
        .eq("id", 1)
        .single();

      if (error) throw error;
      res.json(data.content);
    } catch (error) {
      console.error("Supabase read error:", error);
      res.status(500).json({ error: "Failed to fetch data from Supabase" });
    }
  });

  // API to update site data in Supabase
  app.post("/api/data", async (req, res) => {
    try {
      const { error } = await supabase
        .from("site_config")
        .upsert({ id: 1, content: req.body }, { onConflict: 'id' });

      if (error) {
        console.error("Supabase upsert error details:", JSON.stringify(error, null, 2));
        throw error;
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error("Supabase write error:", error?.message || error);
      res.status(500).json({ 
        error: "Failed to save data to Supabase", 
        details: error?.message || "Unknown error" 
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only listen if not running as a serverless function (e.g., on Vercel)
  if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  return app;
}

const appPromise = startServer();

export default async (req: any, res: any) => {
  const app = await appPromise;
  return app(req, res);
};
