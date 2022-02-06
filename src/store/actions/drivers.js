import { apiCall } from '../../api';
import { addError } from './errors';
import { SET_DRIVERS, ADD_DRIVER, UPDATE_DRIVER } from '../actionTypes';

export const setDrivers = drivers => ({
	type: SET_DRIVERS,
	drivers,
})

const addDriver = (driver) => ({
	type: ADD_DRIVER,
	driver
})

const updateDriver = driver => ({
	type: UPDATE_DRIVER,
	driver
})

export function createDriver(data, email){
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('POST', `/server/main/create-driver`, data, { params: { email }})
				.then(({ message, ...driver }) => {
					dispatch(addDriver(driver))
					resolve(driver)
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Server is down!'));
					reject(err);
				});
		})
	}
}

export function changeDriver(data, email){
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('POST', `/server/main/update-driver`, data, { params: { email }})
				.then(({ message, ...driver }) => {
					dispatch(updateDriver(driver))
					resolve(driver)
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Server is down!'));
					reject(err);
				});
		})
	}
}