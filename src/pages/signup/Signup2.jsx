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
		<div className='mx-auto my-auto py-5 signupPage bg-light'>
			<div className='top-0 w-md p-5 position-absolute' role='button' onClick={() => props.history.goBack()}>
				<img src={backArrow} alt='Go back button' width={40} height={40} />
			</div>
			<div className='d-flex flex-grow-1 justify-content-center align-items-center flex-column'>

				<div className='py-4'>
					<h2 className='signup-header pb-2'>Add your payment details</h2>
					<span className='text-muted'>
						Your card is needed for verification and will <strong>not</strong> be billed
					</span>
				</div>
			</div>
			<div className='d-flex flex-column justify-content-center align-items-center'>
				<button disabled={!userData.paymentMethodId} onClick={signup} className='btn btn-dark btn-lg w-sm mt-4'>
					Complete
				</button>
			</div>
		</div>
	);
};

export default Signup2;
