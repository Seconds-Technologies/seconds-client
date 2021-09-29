import { apiCall, setTokenHeader } from '../../api';
import { addError, removeError } from './errors';

export function setupIntent(user) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log('stripeCustomerId:', user.stripeCustomerId);
			return apiCall('POST', `/api/v1/payments/setup-intent`, { stripeCustomerId: user.stripeCustomerId }, {
                headers: {
					'X-Seconds-Api-Key': user.apiKey,
				},
            })
            .then((intent) => {
                resolve(intent);
            })
            .catch(err => {
                if (err) dispatch(addError(err.message));
                else dispatch(addError('Api endpoint could not be accessed!'));
                reject(err);
            });
            
		});
	};
}