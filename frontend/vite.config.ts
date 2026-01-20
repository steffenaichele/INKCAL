import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		// Enable source maps for production debugging (optional)
		sourcemap: false,
		// Optimize chunk size
		rollupOptions: {
			output: {
				manualChunks: {
					// Separate vendor chunks for better caching
					"react-vendor": [
						"react",
						"react-dom",
						"react-router",
						"react-router-dom",
					],
					"query-vendor": ["@tanstack/react-query"],
				},
			},
		},
		// Target modern browsers for smaller bundles
		target: "esnext",
		minify: "esbuild",
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
		},
	},
	// Preview mode configuration for Vercel
	preview: {
		port: 4173,
		strictPort: true,
	},
});
