import React, { useState } from 'react';
import { authenticateUser } from '../../store/actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
import Subscription from '../settings/containers/subscription/Subscription';
import backArrow from '../../assets/img/noun-go-back-vector.svg';

const Signup3 = props => {
	const dispatch = useDispatch();
	const [isLoading, setLoading] = useState(false);
	const { user } = useSelector(state => state['currentUser']);

	const signup = async () => {
		try {
			dispatch(authenticateUser());
			props.history.push('/home');
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<LoadingOverlay active={isLoading} spinner text='Hold tight, signing you up...'>
			<div className='container mx-auto my-auto py-4 signupPage'>
				<div className='top-0 w-md' role='button' onClick={() => props.history.goBack()}>
					<img src={backArrow} alt='Go back button' width={40} height={40} />
				</div>
				<div className='d-flex flex-grow-1 justify-content-center align-items-center flex-column mb-3'>
					<h2 className='signup-header pb-2'>Choose a subscription plan</h2>
					<span className='text-muted'>You must be <strong>subscribed</strong> before you can create orders</span>
				</div>
				<Subscription isComponent {...props} />
				<div className='d-flex flex-grow-1 justify-content-center align-items-center flex-column'>
					<button disabled={!user.subscriptionId} onClick={signup} className='btn btn-dark btn-lg w-sm mt-4'>
						Show My Dashboard
					</button>
				</div>
			</div>
		</LoadingOverlay>
	);
};

export default Signup3;
