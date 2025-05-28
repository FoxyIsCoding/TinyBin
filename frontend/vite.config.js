import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true,
		allowedHosts: ['tinybin.fun'], 
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true
			}
		}
	},
	preview: {
		host: '0.0.0.0',
		allowedHosts: ['tinybin.fun'],
		port: 4173,
		strictPort: true,
		headers: {
			'Access-Control-Allow-Origin': 'https://tinybin.fun'
		}
	}
});