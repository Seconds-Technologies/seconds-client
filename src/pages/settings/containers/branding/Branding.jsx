import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

const Branding = props => {
	return (
		<div className="tab-container container-fluid p-5">
			<div>
				<h1>Please upgrade your plan to be able to change the branding</h1>
			</div>
			<div>
				<span className="fs-1 my-1 font-medium">Your business logo</span>
				<p>Your brand logo will be in the dashboard and customer tracking link</p>
				<Button variant="outlined">Change</Button>
			</div>
			<div>
				<span className="fs-1 my-1 font-medium">Primary brand colour</span>
				<p>Your primary colour will be in the dashboard and customer tracking link</p>
			</div>
			<div></div>
			<div></div>
		</div>
	);
};

Branding.propTypes = {

};

export default Branding;
