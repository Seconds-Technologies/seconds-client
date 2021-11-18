import React, { useEffect } from 'react';
import telephone from '../../assets/img/telephone.svg';
import mail from '../../assets/img/mail.svg';
import { Mixpanel } from '../../config/mixpanel';
import { ChatWidget } from '@papercups-io/chat-widget';
import { useSelector } from 'react-redux';

const CustomerSupport = props => {
	const { id, firstname, lastname, email, subscriptionPlan } = useSelector(state => state['currentUser'].user);
	const token = "8d14f8d9-7027-4af7-8fb2-14ca0712e633"
	const inbox = "3793e40e-c090-4412-acd0-7e20a7dc9f8a"

	useEffect(() => {
		Mixpanel.people.increment('page_views');
	}, [props.location]);

	return (
		<div className='help py-lg-5 py-md-5 py-4'>
			<div className='container-fluid py-5'>
				<div className='row pb-3 text-center'>
					<div className='col'>
						<p className='display-4 fw-bold fw-bolder'>Need help with an order?</p>
					</div>
				</div>
				<div className='row pb-3 text-center'>
					<div className='col'>
						<p className='text-muted h3'>Chat with us via telephone or email</p>
					</div>
				</div>
				<hr className='my-5 mx-5' />
				<div className='d-flex justify-content-center align-items-center'>
					<div>
						<table className='table table-borderless align-middle'>
							<tbody className=''>
							<tr className='d-flex my-3'>
								<td>
									<div>
										<img src={telephone} alt='' />
									</div>
								</td>
								<td>
									<span className='h3 help-text'>+447895254476</span>
								</td>
							</tr>
							<tr className='d-flex my-3'>
								<td>
									<img src={mail} alt='' />
								</td>
								<td>
									<span className='h3 help-text'>secondsdelivery@gmail.com</span>
								</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<ChatWidget
				// `accountId` is used instead of `token` in older versions
				// of the @papercups-io/chat-widget package (before v1.2.x).
				// You can delete this line if you are on the latest version.
				// accountId="8d14f8d9-7027-4af7-8fb2-14ca0712e633"
				token={token}
				inbox={inbox}
				title='Welcome to Seconds'
				subtitle='Ask us anything in the chat window below 😊'
				primaryColor='#9400d3'
				greeting="Hi there! How can I help you?"
				newMessagePlaceholder='Start typing...'
				showAgentAvailability={false}
				agentAvailableText="We're online right now!"
				agentUnavailableText="We're away at the moment."
				requireEmailUpfront={false}
				iconVariant='outlined'
				baseUrl='https://app.papercups.io'
				styles={{
					toggleButton: {
						width: 75,
						height: 75
					}
				}}
				// Optionally include data about your customer here to identify them
				customer={{
					name: `${firstname} ${lastname}`,
					email: email,
					external_id: id,
					metadata: {
						plan: subscriptionPlan
					},
					current_url: `https://app.ususeconds.com${props.location.pathname}`
				}}
			/>
		</div>
	);
};

CustomerSupport.propTypes = {};

export default CustomerSupport;
