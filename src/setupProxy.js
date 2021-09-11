const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	app.use(
		'/server',
		createProxyMiddleware({
			target: 'http://localhost:8081', // Client app server
			changeOrigin: true,
			headers: {
				Connection: "keep-alive"
			}
		})
	);
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'http://localhost:3001', // Seconds API
			changeOrigin: true,
			headers: {
				Connection: "keep-alive"
			}
		})
	);
}