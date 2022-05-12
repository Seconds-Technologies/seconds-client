import { apiCall } from "../../api";
import { addError, removeError } from "./errors";
import {
	CLEAR_PRODUCTS,
	SET_PRODUCTS,
	SET_SHOPIFY, UPDATE_SHOPIFY
} from '../actionTypes';
import { Mixpanel } from '../../config/mixpanel';

export const setShopify = credentials => ({
	type: SET_SHOPIFY,
	credentials,
});

export const updateShopify = data => ({
	type: UPDATE_SHOPIFY,
	data,
});

export const clearAllProducts = () => ({
	type: CLEAR_PRODUCTS,
});

export const setAllProducts = products => ({
	type: SET_PRODUCTS,
	products,
});

export function connectShopify(data) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall("POST", `/server/shopify/connect`, data)
				.then(shop => {
					Mixpanel.track("Successful Shopify integration")
					Mixpanel.people.setOnce({$shopify: shop})
					dispatch(setShopify(shop));
					dispatch(removeError());
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

