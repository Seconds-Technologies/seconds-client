import React from 'react';
import PropTypes from 'prop-types';
import '../../App.css';

const Counter = ({ value }) => {
	return (
		<div className='counter-wrapper rounded-circle d-flex align-items-center justify-content-center'>
			<span className='display-6 fw-bold'>{value}</span>
		</div>
	);
};

Counter.propTypes = {
	value: PropTypes.number.isRequired,
};

export default Counter;
