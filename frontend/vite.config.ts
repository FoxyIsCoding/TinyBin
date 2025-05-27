import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true
			}
		},
		host: true, // allows access from external hosts
		origin: 'https://tinybin.fun' // sets the origin for HMR & stuff (optional but nice)
	},
	preview: {
		host: "0.0.0.0",
		port: 4173,
		strictPort: true,
		headers: {
			'Access-Control-Allow-Origin': 'https://tinybin.fun'
		}
	}
});