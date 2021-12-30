import { apiCall, setTokenHeader } from "../../api";
import { addError, removeError } from "./errors";
import {
	CLEAR_PRODUCTS,
	SET_PRODUCTS,
	SET_SHOPIFY,
} from "../actionTypes";
import { Mixpanel } from '../../config/mixpanel';

export const setShopify = credentials => ({
	type: SET_SHOPIFY,
	credentials,
});

export const clearAllProducts = () => ({
	type: CLEAR_PRODUCTS,
});

export const setAllProducts = products => ({
	type: SET_PRODUCTS,
	products,
});

export function validateShopify(data) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log("Credentials:", data);
			return apiCall("POST", `/server/shopify/validate`, data)
				.then(shop => {
					Mixpanel.track("Successful Shopify integration")
					Mixpanel.people.setOnce({$shopify: shop})
					dispatch(setShopify(shop));
					dispatch(removeError());
					// await axios.get(baseURL, { headers: { "Authorization": base64URL}});
					resolve(shop);
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError("Api endpoint could not be accessed!"));
					reject(err);
				});
		});
	};
}

export function getAllProducts(token, baseURL, email) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			setTokenHeader(localStorage.getItem("jwt_token"));
			return apiCall("POST", `/server/shopify/all-products`, { token, baseURL, email })
				.then(({ products }) => {
					dispatch(setAllProducts(products));
					dispatch(removeError());
					resolve(products);
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError("Api endpoint could not be accessed!"));
					reject(err);
				});
		});
	};
}

