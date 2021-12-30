import { apiCall } from '../../api';
import { addError, removeError } from './errors';
import { SET_SQUARE, UPDATE_SQUARE } from '../actionTypes';
import { Mixpanel } from '../../config/mixpanel';

export const setSquare = credentials => ({
	type: SET_SQUARE,
	credentials
});

export const updateSquare = data => ({
	type: UPDATE_SQUARE,
	data,
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
			return apiCall('GET', `/server/square`, null, { params: { ...data } })
				.then(shop => {
					Mixpanel.track('Successful Square integration');
					Mixpanel.people.setOnce({ $square: shop });
					dispatch(setSquare(shop));
					dispatch(removeError());
					resolve(shop);
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}

