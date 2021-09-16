import { addError, removeError } from './errors';
import { apiCall, setTokenHeader } from '../../api';
import { CLEAR_JOBS, SET_ALL_JOBS, SET_COMPLETED_JOBS } from '../actionTypes';

export const setAllJobs = jobs => ({
	type: SET_ALL_JOBS,
	jobs,
});

export const setCompletedJobs = jobs => ({
	type: SET_COMPLETED_JOBS,
	jobs,
});

export const clearAllJobs = () => ({
	type: CLEAR_JOBS
})

export function createDeliveryJob(deliveryParams, apiKey) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log('Data:', deliveryParams);
			return apiCall('POST', `/api/v1/jobs/create`, deliveryParams, { headers: { 'X-Seconds-Api-Key': apiKey } })
				.then(
					({
						createdAt,
						 id,
						 jobSpecification: {
							 packages
						 },
						 status,
						 winnerQuote
					 }) => {
						dispatch(removeError());
						resolve({ createdAt, id, packages, status, winnerQuote });
					}
				)
				.catch(err => {
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
			setTokenHeader(localStorage.getItem("jwt_token"));
			return apiCall("POST", `/api/v1/jobs`, { email }, { headers: { 'X-Seconds-Api-Key': apiKey } })
				.then(({ jobs }) => {
					console.log(jobs)
					dispatch(setAllJobs(jobs));
					dispatch(setCompletedJobs(jobs.map(({jobId, status}) => ({jobId, status}))))
					dispatch(removeError());
					resolve(jobs);
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError("Api endpoint could not be accessed!"));
					reject(err);
				});
		});
	};
}