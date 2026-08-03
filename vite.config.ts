// @ts-nocheck
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "site-data-api-server",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/api/save-site-data") {
            if (req.method === "OPTIONS") {
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
              res.setHeader("Access-Control-Allow-Headers", "Content-Type");
              res.statusCode = 200;
              res.end();
              return;
            }
            if (req.method === "POST") {
              let body = "";
              req.on("data", (chunk) => { body += chunk; });
              req.on("end", () => {
                try {
                  const parsed = JSON.parse(body);
                  const filePath = path.resolve(process.cwd(), "src/data/siteData.json");
                  fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), "utf-8");
                  console.log("Successfully saved siteData.json to disk!");
                  res.setHeader("Access-Control-Allow-Origin", "*");
                  res.setHeader("Content-Type", "application/json");
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true, message: "Site data saved permanently to disk!" }));
                } catch (err) {
                  console.error("Error writing siteData.json:", err);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ success: false, message: "Failed to write site data" }));
                }
              });
              return;
            }
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three', 'three-stdlib'],
          'react-three': ['@react-three/fiber', '@react-three/drei'],
          'gsap': ['gsap'],
          'vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: ['three', 'gsap', 'lenis']
  }
});
