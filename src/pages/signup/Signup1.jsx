import React, { useContext } from 'react';
import Products from './components/Products';
import { ProductContext } from '../../context/ProductContext';

const Signup1 = props => {
	return (
		<div className='container-fluid d-flex flex-column align-items-center mx-auto my-auto py-4 signupPage'>
			<span className='fs-4 text-primary'>2/3</span>
			<h2 className='display-3 font-medium pb-2'>Choose your product</h2>
			<Products />
		</div>
	);
};

export default Signup1;
