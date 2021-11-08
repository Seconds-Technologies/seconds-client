import { apiCall } from '../../api';
import { addError } from './errors';
import { updateCurrentUser } from './auth';
import { Mixpanel } from '../../config/mixpanel';

export function checkSubscriptionStatus(email) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log(email);
			apiCall('POST', '/server/subscription/fetch-stripe-subscription', { email })
				.then(({ id: subscriptionId, status }) => {
					console.log(subscriptionId, status)
					Mixpanel.people.set({
						subscribed: !!subscriptionId
					})
					dispatch(updateCurrentUser({ subscriptionId }));
					resolve(status === "active");
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}
