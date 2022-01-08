import axios from 'axios';

export function setTokenHeader(token) {
	if (token) {
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	} else {
		delete axios.defaults.headers.common['Authorization'];
	}
}

/**
 * A wrapper around axios APIs that formats errors, etc
 * @param method the HTTP verb being used
 * @param path the route path / endpoint
 * @param data (optional) payload in JSON form for POST requests
 * @param config (optional) extra configurations for the request e.g. headers, query params, etc.
 * @returns {Promise<JSON>}
 */
export function apiCall(method, path, data = null, config = {}) {
	return new Promise((resolve, reject) => {
		return !data
			? axios[method.toLowerCase()](path, config)
					.then(res => {
						process.env.REACT_APP_ENV_MODE !== "production" && console.log(res.data);
						resolve(res.data);
					})
					.catch(err => {
						process.env.REACT_APP_ENV_MODE !== "production" && console.error(err);
						err.response.data.error ? reject(err.response.data.error) : reject(err.response.data);
					})
			: axios[method.toLowerCase()](path, data, config)
					.then(res => {
						process.env.REACT_APP_ENV_MODE !== "production" && console.log(res.data);
						resolve(res.data);
					})
					.catch(err => {
						process.env.REACT_APP_ENV_MODE !== "production" && console.error(err);
						err.response.data.error ? reject(err.response.data.error) : reject(err.response.data);
					});
	});
}