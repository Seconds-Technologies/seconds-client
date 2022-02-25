import { apiCall } from '../../api';
import { addError } from './errors';
import { SET_DRIVERS, ADD_DRIVER, UPDATE_DRIVER, TIMER_START, TIMER_STOP } from '../actionTypes';

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

let timer;
export const subscribe = (email) => dispatch => {
	clearInterval(timer);
	dispatch(getAllDrivers(email));
	timer = setInterval(() => dispatch(getAllDrivers(email)), 5000);
	dispatch({ type: TIMER_START, timer });
};

export const unsubscribe = () => dispatch => {
	clearInterval(timer);
	dispatch({ type: TIMER_STOP });
};

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

export function getAllDrivers(email){
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('GET', `/server/main/drivers`, null, { params: { email }})
				.then(drivers => {
					dispatch(setDrivers(drivers))
					resolve(drivers)
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Server is down!'));
					reject(err);
				})
		})
	}
}