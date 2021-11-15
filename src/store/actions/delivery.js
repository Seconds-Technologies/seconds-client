import { addError, removeError } from './errors';
import { apiCall, setTokenHeader } from '../../api';
import {
	CLEAR_JOBS,
	NEW_DELIVERY_JOB,
	SET_ALL_JOBS,
	SET_COMPLETED_JOBS,
	UPDATE_COMPLETED_JOBS,
	TIMER_START,
	TIMER_STOP,
	ADD_DROPOFF,
	REMOVE_DROPOFF, CLEAR_DROPOFFS
} from '../actionTypes';
import { STATUS } from '../../constants';
import { Mixpanel } from '../../config/mixpanel';

export const addDropoff = dropoff => ({
	type: ADD_DROPOFF,
	dropoff
})

export const removeDropoff = index => ({
	type: REMOVE_DROPOFF,
	index
})

export const clearDropoffs = () => ({
	type: CLEAR_DROPOFFS
})

export const setAllJobs = jobs => ({
	type: SET_ALL_JOBS,
	jobs,
});

export const setCompletedJobs = jobs => ({
	type: SET_COMPLETED_JOBS,
	jobs,
});

export const addCompletedJob = job => ({
	type: UPDATE_COMPLETED_JOBS,
	job,
});

export const newDeliveryJob = job => ({
	type: NEW_DELIVERY_JOB,
	job,
});

export const clearAllJobs = () => ({
	type: CLEAR_JOBS,
});

let timer = null;

export const subscribe = (apiKey, email) => dispatch => {
	clearInterval(timer);
	dispatch(getAllJobs(apiKey, email))
	timer = setInterval(() => dispatch(getAllJobs(apiKey, email)), 5000);
	dispatch({ type: TIMER_START, timer });
};

export const unsubscribe = () => dispatch => {
	clearInterval(timer);
	dispatch({ type: TIMER_STOP });
};

export function createDeliveryJob(deliveryParams, apiKey, providerId = undefined) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.table(deliveryParams);
			return apiCall('POST', `/api/v1/jobs/create`, deliveryParams, {
				headers: {
					'X-Seconds-Api-Key': apiKey,
					...(providerId && { 'X-Seconds-Provider-Id': providerId }),
				},
			})
				.then(job => {
					Mixpanel.track('Successful Delivery job creation')
					dispatch(newDeliveryJob(job));
					dispatch(removeError());
					resolve(job);
				})
				.catch(err => {
					Mixpanel.track('Unsuccessful Delivery job creation')
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}

export function createMultiDropJob(deliveryParams, apiKey, providerId=undefined){
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.table(deliveryParams);
			return apiCall('POST', `/api/v1/jobs/multi-drop`, deliveryParams, {
				headers: { 'X-Seconds-Api-Key': apiKey	},
				...(providerId &&  { params: { 'provider': providerId }})
			})
				.then(job => {
					Mixpanel.track('Successful Multi-drop job creation')
					dispatch(newDeliveryJob(job));
					dispatch(removeError());
					resolve(job);
				})
				.catch(err => {
					Mixpanel.track('Unsuccessful Multi-drop job creation')
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	}
}

export function getAllJobs(apiKey, email) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			setTokenHeader(localStorage.getItem('jwt_token'));
			return apiCall('GET', `/api/v1/jobs`, null, {
				headers: { 'X-Seconds-Api-Key': apiKey },
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
								status,
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

export function updateJobsStatus(apiKey, jobId, status, stripeCustomerId) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			setTokenHeader(localStorage.getItem('jwt_token'));
			return apiCall(
				'POST',
				`/api/v1/jobs/${jobId}`,
				{
					stripeCustomerId,
					status,
				},
				{ headers: { 'X-Seconds-Api-Key': apiKey } }
			)
				.then(({ updatedJobs, message }) => {
					console.log(message);
					dispatch(setAllJobs(updatedJobs));
					const {
						_id: id,
						createdAt,
						selectedConfiguration: { deliveryFee },
						status,
					} = updatedJobs.find(item => item._id === jobId);
					status === STATUS.COMPLETED && dispatch(addCompletedJob({ id, createdAt, deliveryFee, status }));
					dispatch(removeError());
					resolve(updatedJobs);
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
					Mixpanel.track('Successful fetch of delivery quotes')
					dispatch(removeError());
					resolve({ quotes, bestQuote });
				})
				.catch(err => {
					Mixpanel.track('Unsuccessful fetch of delivery quotes')
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}