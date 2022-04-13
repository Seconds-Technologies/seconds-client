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
		<div className='container mx-auto my-auto py-4 signupPage'>
			<div className='d-flex flex-grow-1 justify-content-center align-items-center flex-column'>
				<div className='top-0 w-md' role='button' onClick={() => props.history.goBack()}>
					<img src={backArrow} alt='Go back button' width={40} height={40} />
				</div>
				<div className='py-4'>
					<h2 className='signup-header pb-2'>Add your payment details</h2>
					<span className='text-muted'>
						Your card is needed for verification and will <strong>not</strong> be billed
					</span>
				</div>
			</div>
			<PaymentMethod isComponent isValid={cardValid} setCardValid={setCardValid} />
			<div className='d-flex flex-grow-1 justify-content-center align-items-center flex-column'>
				<button disabled={!userData.paymentMethodId} onClick={signup} className='btn btn-dark btn-lg w-sm mt-4'>
					Show My Dashboard
				</button>
			</div>
		</div>
	);
};

export default Signup2;
