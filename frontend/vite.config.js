import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    // Local dev: /api requests backend (port 3000) par jaayengi
    server: { port: 5173, proxy: { "/api": "http://localhost:3000" } },
});
