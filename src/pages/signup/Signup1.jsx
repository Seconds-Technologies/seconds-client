import React, { useState } from 'react';
import { authenticateUser } from '../../store/actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
import Subscription from '../settings/containers/billing/Subscription';
import backArrow from '../../assets/img/noun-go-back-vector.svg';
import Products from './components/Products';

const Signup1 = props => {
	const dispatch = useDispatch();
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
		<LoadingOverlay active={false} spinner text='Hold tight, signing you up...'>
			<div className='container mx-auto my-auto py-4 signupPage'>
				<div className='text-center mx-auto w-100'>
					<span className="fs-4 text-primary">2/3</span>
				</div>
				<div className='d-flex flex-grow-1 justify-content-center align-items-center flex-column mb-3'>
					<h2 className='display-3 font-medium pb-2'>Choose your product</h2>
				</div>
				<Products/>
				<div className='d-flex flex-grow-1 justify-content-center align-items-center flex-column'>
					<button type='submit' className='btn btn-dark btn-lg w-sm mt-4'>
						Continue
					</button>
				</div>
			</div>
		</LoadingOverlay>
	);
};

export default Signup1;
