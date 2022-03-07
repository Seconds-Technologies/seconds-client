import { addError, removeError } from './errors';
import { apiCall, setTokenHeader } from '../../api';
import {
	ADD_DROPOFF,
	CLEAR_DROPOFFS,
	CLEAR_JOBS,
	NEW_DELIVERY_JOB,
	REMOVE_DROPOFF,
	SET_ALL_JOBS,
	SET_COMPLETED_JOBS,
	SET_DROPOFFS,
	TIMER_START,
	TIMER_STOP,
	UPDATE_COMPLETED_JOBS, UPDATE_DELIVERY_JOB
} from '../actionTypes';
import { Mixpanel } from '../../config/mixpanel';

export const setDropoffs = dropoffs => ({
	type: SET_DROPOFFS,
	dropoffs
});

export const addDropoff = dropoff => ({
	type: ADD_DROPOFF,
	dropoff
});

export const removeDropoff = index => ({
	type: REMOVE_DROPOFF,
	index
});

export const clearDropoffs = () => ({
	type: CLEAR_DROPOFFS
});

export const setAllJobs = jobs => ({
	type: SET_ALL_JOBS,
	jobs
});

export const setCompletedJobs = jobs => ({
	type: SET_COMPLETED_JOBS,
	jobs
});

export const addCompletedJob = job => ({
	type: UPDATE_COMPLETED_JOBS,
	job
});

export const newDeliveryJob = job => ({
	type: NEW_DELIVERY_JOB,
	job
});

export const updateDeliveryJob = job => ({
	type: UPDATE_DELIVERY_JOB,
	job
})

export const clearAllJobs = () => ({
	type: CLEAR_JOBS
});

let timer = null;

export const subscribe = (apiKey, email) => dispatch => {
	clearInterval(timer);
	dispatch(getAllJobs(apiKey, email));
	timer = setInterval(() => dispatch(getAllJobs(apiKey, email)), 5000);
	dispatch({ type: TIMER_START, timer });
};

export const unsubscribe = () => dispatch => {
	clearInterval(timer);
	dispatch({ type: TIMER_STOP });
};

export function assignDriver(deliveryParams, apiKey, driverId){
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.table(deliveryParams);
			return apiCall('POST', `/api/v1/jobs/assign`, deliveryParams, {
				headers: { 'X-Seconds-Api-Key': apiKey	},
				params: { driverId }
			})
				.then(job => {
					Mixpanel.track('Successful Job Assignment');
					dispatch(newDeliveryJob(job));
					dispatch(removeError());
					resolve(job);
				})
				.catch(err => {
					Mixpanel.track('Successful job assignment');
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}

export function createDeliveryJob(deliveryParams, apiKey, providerId = undefined) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('POST', `/api/v1/jobs/create`, deliveryParams, {
				headers: {
					'X-Seconds-Api-Key': apiKey,
					...(providerId && { 'X-Seconds-Provider-Id': providerId })
				}
			})
				.then(job => {
					Mixpanel.track('Successful Delivery job creation');
					dispatch(newDeliveryJob(job));
					dispatch(removeError());
					resolve(job);
				})
				.catch(err => {
					Mixpanel.track('Unsuccessful Delivery job creation');
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}

export function createMultiDropJob(deliveryParams, apiKey, providerId = undefined) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.table(deliveryParams);
			return apiCall('POST', `/api/v1/jobs/multi-drop`, deliveryParams, {
				headers: { 'X-Seconds-Api-Key': apiKey },
				...(providerId && { params: { provider: providerId } })
			})
				.then(job => {
					Mixpanel.track('Successful Multi-drop job creation');
					dispatch(newDeliveryJob(job));
					dispatch(removeError());
					resolve(job);
				})
				.catch(err => {
					Mixpanel.track('Unsuccessful Multi-drop job creation');
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}

export function manuallyDispatchJob(apiKey, driverId, orderNumber) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log(driverId, orderNumber)
			return apiCall(
				'PATCH',
				`/api/v1/jobs/dispatch`,
				{ driverId, orderNumber },
				{headers: { 'X-Seconds-Api-Key': apiKey}}
			)
				.then(job => {
					Mixpanel.track('Successful manual dispatch');
					dispatch(updateDeliveryJob(job));
					dispatch(removeError());
					resolve(job);
				})
				.catch(err => {
					Mixpanel.track('Unsuccessful Delivery job creation');
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}

export function getAllJobs(apiKey, email) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			setTokenHeader(localStorage.getItem('jwt_token'));
			return apiCall('GET', `/api/v1/jobs`, null, {
				headers: {
					'Cache-Control': "private",
					'X-Seconds-Api-Key': apiKey
				},
				params: { email }
			})
				.then(jobs => {
					dispatch(setAllJobs(jobs));
					dispatch(
						setCompletedJobs(
							jobs.map(({ _id: id, createdAt, selectedConfiguration: { deliveryFee }, status }) => ({
								id,
								createdAt,
								deliveryFee,
								status
							}))
						)
					);
					dispatch(removeError());
					resolve(jobs);
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}

export function getAllQuotes(apiKey, data) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			setTokenHeader(localStorage.getItem('jwt_token'));
			return apiCall('POST', `/api/v1/quotes`, { ...data }, { headers: { 'X-Seconds-Api-Key': apiKey } })
				.then(({ quotes, bestQuote }) => {
					console.log(quotes);
					Mixpanel.track('Successful fetch of delivery quotes');
					dispatch(removeError());
					resolve({ quotes, bestQuote });
				})
				.catch(err => {
					Mixpanel.track('Unsuccessful fetch of delivery quotes');
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}

export function cancelDelivery(apiKey, jobId) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('DELETE', `/api/v1/jobs/${jobId}`, null, { headers: { 'X-Seconds-Api-Key': apiKey } })
				.then(({ message }) => {
					Mixpanel.track('Successful job cancellation');
					resolve(message);
				})
				.catch(err => {
					Mixpanel.track('Unsuccessful job cancellation');
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}
