import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // or "./" if you still get a blank screen
  plugins: [react()],
});
