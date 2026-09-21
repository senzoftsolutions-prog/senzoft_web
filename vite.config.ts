import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes('node_modules')) return

					if (
						id.includes('/react/') ||
						id.includes('/react-dom/') ||
						id.includes('/scheduler/')
					) {
						return 'react-vendor'
					}

					if (id.includes('/react-router') || id.includes('/@remix-run/')) {
						return 'router-vendor'
					}

					if (
						id.includes('/framer-motion/') ||
						id.includes('/motion-dom/') ||
						id.includes('/motion-utils/')
					) {
						return 'motion-vendor'
					}
				},
			},
		},
	},
	server: {
		watch: {
			usePolling: true,
			interval: 1000,
		},
	},
})
