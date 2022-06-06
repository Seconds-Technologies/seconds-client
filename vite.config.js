import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
	return defineConfig({
		plugins: [react()],
		define: {
			"process.env.NODE_ENV": `"${mode}"`,
		},
		server: {
			proxy: {
				'/server': {
					target: "http://localhost:8081",
					changeOrigin: true,
					secure: false
				},
				'/api': {
					target: "http://localhost:3001",
					changeOrigin: true,
					secure: false
				}
			}
		},
		esbuild: {
			loader: "jsx",
			include: /src\/.*\.jsx?$/,
			// loader: "tsx",
			// include: /src\/.*\.[tj]sx?$/,
			exclude: [],
		},
		optimizeDeps: {
			esbuildOptions: {
				plugins: [
					{
						name: "load-js-files-as-jsx",
						setup(build) {
							build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
								loader: "jsx",
								contents: await fs.readFile(args.path, "utf8"),
							}));
						},
					},
				],
			}
		},
		resolve: {
			alias: [
				{
					find: './runtimeConfig',
					replacement: './runtimeConfig.browser',
				},
			]
		},
		build: {
			outDir: "build",
			chunkSizeWarningLimit: 5000
		}
	})
}