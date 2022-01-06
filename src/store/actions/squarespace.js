import { apiCall } from '../../api';
import { Mixpanel } from '../../config/mixpanel';
import { addError, removeError } from './errors';
import { SET_SQUARESPACE } from '../actionTypes';

export const setSquareSpace = credentials => ({
	type: SET_SQUARESPACE,
	credentials,
});

/*export function authorizeSquarespace(email, values){
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('POST', `/server/squarespace/connect`, values, { params: { "email": email } })
				.then(shop => {
					Mixpanel.track("Successful Squarespace integration")
					Mixpanel.people.setOnce({$squarespace: shop})
					dispatch(setSquareSpace(shop))
					resolve(shop);
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError("Server is down!"));
					reject(err);
				});
		});
	};
}*/

export function getSquarespaceCredentials(data){
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('GET', `/server/squarespace`, null, { params: { ...data } })
				.then(shop => {
					Mixpanel.track('Successful Squarespace integration');
					Mixpanel.people.setOnce({ $squarespace: shop });
					//dispatch(setSquareSpace(shop));
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