import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

const Branding = props => {
	return (
		<div className='tab-container container-fluid p-5'>
			<div>
				<h1>Please upgrade your plan to be able to change the branding</h1>
			</div>
			<div className="mb-3">
				<span className='fs-1 my-1 font-semibold'>Your business logo</span>
				<p>Your brand logo will be in the dashboard and customer tracking link</p>
				<button
					type='button'
					className='btn btn-outline-secondary btn-sm'
					style={{ width: 130 }}
				>
					Change
				</button>
			</div>
			<div className="mb-3">
				<span className='fs-1 my-1 font-semibold'>Primary brand colour</span>
				<p>Your primary colour will be in the dashboard and customer tracking link</p>
			</div>
			<div className="mb-5">
				<span className='fs-1 my-1 font-semibold'>Customer SMS</span>
				<p>Please contact support@useseconds.com to customize the SMS</p>
			</div>
			<div className='d-flex'>
				<button
					className='btn btn-dark me-5'
					style={{
						height: 50,
						width: 150
					}}
				>
					Cancel
				</button>
				<button
					className='btn btn-primary'
					style={{
						height: 50,
						width: 150
					}}
				>
					Save
				</button>
			</div>
		</div>
	);
};

Branding.propTypes = {};

export default Branding;
