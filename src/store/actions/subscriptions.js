import { apiCall } from '../../api';
import { addError } from './errors';

export function createCheckoutSession(user, lookupKey) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log('stripeCustomerId:', user.stripeCustomerId, lookupKey);
			apiCall(
				'POST',
				'/api/v1/subscription/create-checkout-session',
				{ lookupKey },
				{
					headers: {
						'X-Seconds-Api-Key': user.apiKey,
					},
				}
			).then((res) => {
				resolve(res);
			}).catch(err => {
				if (err) dispatch(addError(err.message));
				else dispatch(addError('Api endpoint could not be accessed!'));
				reject(err);
			});
		});
	};
}
