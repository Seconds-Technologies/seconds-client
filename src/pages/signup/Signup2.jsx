import React, { useState } from 'react';
import PaymentMethod from '../paymentMethod/PaymentMethod';
import { useDispatch, useSelector } from 'react-redux';
import backArrow from '../../assets/img/noun-go-back-vector.svg';
import { PATHS } from '../../constants';
import { authenticateUser } from '../../store/actions/auth';

const Signup2 = props => {
	const [cardValid, setCardValid] = useState(false);
	const { user: userData } = useSelector(state => state['currentUser']);
	const dispatch = useDispatch();

	const signup = async () => {
		try {
			dispatch(authenticateUser());
			props.history.push(PATHS.HOME);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className='container-fluid mx-auto my-auto py-5 signupPage bg-light'>
			<div className='top-0 w-md p-5 position-absolute' role='button' onClick={() => props.history.goBack()}>
				<img src={backArrow} alt='Go back button' width={40} height={40} />
			</div>
			<div className='d-flex flex-column flex-grow-1 align-items-center w-100'>
				<div className='payment-wrapper bg-white py-4 px-3'>
					<div className='d-flex flex-column px-5'>
						<div className='py-4'>
							<h2 className='signup-header pb-2'>Payment details</h2>
							<span className='text-muted'>You will be charged an invoice every month based on your number of deliveries</span>
						</div>
						<div>
							<form action=''>
								<div className='row'>
									<div className='col-12 mb-4'>
										<input type='text' className='form-control' />
									</div>
									<div className='col-12'>
										<input type='text' className='form-control' />
									</div>
								</div>
							</form>
						</div>
						<div className='d-flex flex-column justify-content-center align-items-end '>
							<button disabled={!userData.paymentMethodId} onClick={signup} className='btn btn-dark btn-lg w-sm mt-4 rounded-0'>
								Complete
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Signup2;
