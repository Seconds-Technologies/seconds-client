import axios from "axios";

export function setTokenHeader(token) {
	if (token) {
		axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	} else {
		delete axios.defaults.headers.common["Authorization"];
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
export function apiCall(method, path, data, config={}) {
	return new Promise((resolve, reject) => {
		return axios[method.toLowerCase()](path, data, config)
			.then(res => {
				console.log(res.data)
				resolve(res.data)
			})
			.catch(err => {
				console.error(err)
				reject(err.response.data.error);
			})
	});
}