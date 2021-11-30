import { apiCall } from '../../api';
import { addError, removeError } from './errors';
import {
	CLEAR_ORDERS,
	REMOVE_COMPLETED_ORDER,
	SET_ALL_ORDERS,
	SET_COMPLETED_ORDERS,
	SET_SQUARE,
	UPDATE_COMPLETED_ORDERS,
	UPDATE_SQUARE
} from '../actionTypes';

export const setSquare = credentials => ({
	type: SET_SQUARE,
	credentials,
});

export const updateSquare = data => ({
	type: UPDATE_SQUARE,
	data,
});

export const setAllOrders = orders => ({
	type: SET_ALL_ORDERS,
	orders,
});

export const clearAllOrders = () => ({
	type: CLEAR_ORDERS,
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

export function validateSquare(data) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log("Credentials:", data);
			return apiCall("POST", `/server/square/authorize`, data)
				.then(res => {
					console.log(res)
					updateSquare(data)
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError("Api endpoint could not be accessed!"));
					reject(err);
				});
		});
	};
}

export function getSquareCredentials(data){
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log("Credentials:", data);
			return apiCall("GET", `/server/square`)
				.then(shop => {
					/*Mixpanel.track("Successful Square integration")
					Mixpanel.people.setOnce({$square: shop})*/
					/*dispatch(setSquare(shop));
					dispatch(removeError());*/
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

