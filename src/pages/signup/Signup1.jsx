import React from 'react';
import { authenticateUser } from '../../store/actions/auth';
import { useDispatch, useSelector } from 'react-redux';
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
		<div className='container-fluid d-flex flex-column align-items-center mx-auto my-auto py-4 signupPage'>
			<span className='fs-4 text-primary'>2/3</span>
			<h2 className='display-3 font-medium pb-2'>Choose your product</h2>
			<Products />
		</div>
	);
};

export default Signup1;
