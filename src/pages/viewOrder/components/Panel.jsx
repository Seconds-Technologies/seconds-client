import React from 'react';
import PropTypes from 'prop-types';

const Panel = ({ label, value, styles }) => {
	return (
		<div className={`${styles} d-flex flex-grow-1 flex-column align-items-center bg-light py-3`} style={{borderRadius: 10}}>
			<span className='panel-label text-primary'>{label}</span>
			<span className='panel-value'>{value}</span>
		</div>
	);
};

Panel.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired
};

export default Panel;
