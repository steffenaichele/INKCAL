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
				manualChunks: (id) => {
					// Split large vendor libraries into separate chunks
					if (id.includes("node_modules")) {
						// Check more specific packages first before general react check

						// Router (check before react to avoid matching "react-router")
						if (id.includes("react-router")) {
							return "router-vendor";
						}
						// React Query
						if (id.includes("@tanstack/react-query")) {
							return "query-vendor";
						}
						// Base UI components (can be large)
						if (id.includes("@base-ui")) {
							return "base-ui-vendor";
						}
						// Icons - DON'T chunk separately, keep in main bundle
						// (Removed to avoid bundling issues with explicit imports)

						// Date utilities
						if (id.includes("date-fns")) {
							return "date-vendor";
						}
						// React core (after more specific react-* checks)
						if (id.includes("react") || id.includes("react-dom")) {
							return "react-vendor";
						}
						// All other node_modules
						return "vendor";
					}
				},
			},
		},
		// Optimize dependencies
		commonjsOptions: {
			include: [/node_modules/],
			transformMixedEsModules: true,
		},
		// Target modern browsers for smaller bundles
		target: "esnext",
		minify: "esbuild",
		// Increase chunk size warning limit to 600 kB
		chunkSizeWarningLimit: 600,
	},
	// No external icon library dependencies
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
