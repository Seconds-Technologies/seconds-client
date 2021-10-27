import { apiCall, setTokenHeader } from "../../api";
import { addError, removeError } from "./errors";
import {
	CLEAR_ORDERS,
	CLEAR_PRODUCTS,
	SET_ALL_ORDERS,
	SET_PRODUCTS,
	SET_SHOPIFY,
	SET_COMPLETED_ORDERS,
	UPDATE_COMPLETED_ORDERS,
	REMOVE_COMPLETED_ORDER
} from "../actionTypes";

export const setShopify = credentials => ({
	type: SET_SHOPIFY,
	credentials,
});

export const setAllOrders = orders => ({
	type: SET_ALL_ORDERS,
	orders,
});

export const clearAllOrders = () => ({
	type: CLEAR_ORDERS,
});

export const clearAllProducts = () => ({
	type: CLEAR_PRODUCTS,
});

export const setAllProducts = products => ({
	type: SET_PRODUCTS,
	products,
});

export const setCompletedOrders = orders => ({
	type: SET_COMPLETED_ORDERS,
	orders,
});

export const updateCompletedOrders = id => ({
	type: UPDATE_COMPLETED_ORDERS,
	id,
});

export const removeCompletedOrder = id => ({
	type: REMOVE_COMPLETED_ORDER,
	id,
});

export function validateShopify(data) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log("Credentials:", data);
			return apiCall("POST", `/server/shopify/validate`, data)
				.then(shop => {
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

export function fetchProducts(email) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			setTokenHeader(localStorage.getItem("jwt_token"));
			return apiCall("POST", `/server/shopify/fetch-products`, { email })
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

export function updateOrderStatus(id, email, status, prevStatus) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			setTokenHeader(localStorage.getItem("jwt_token"));
			return apiCall("PUT", "/server/shopify/update-order", {
				id,
				email,
				status,
			})
				.then(({ updatedOrders }) => {
					dispatch(setAllOrders(updatedOrders));
					status === "Completed" && dispatch(updateCompletedOrders(id))
					prevStatus === "Completed" && dispatch(removeCompletedOrder(id))
					dispatch(removeError());
					resolve(updatedOrders);
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError("Api endpoint could not be accessed!"));
					reject(err);
				});
		});
	};
}

