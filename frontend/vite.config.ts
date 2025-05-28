import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true,
		allowedHosts: 'all',
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true
			}
		}
	},
	preview: {
		host: '0.0.0.0',
		allowedHosts: 'all',
		port: 4173,
		strictPort: true,
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	}
});