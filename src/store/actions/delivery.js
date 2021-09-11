import { addError, removeError } from './errors';
import { apiCall } from '../../api';

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
};