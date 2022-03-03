import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

const SuccessMessage = React.forwardRef(({ show, onHide }, ref) => {
	return (
		<Modal show={show} container={ref} onHide={onHide} size={'lg'} centered aria-labelledby='example-custom-modal-styling-title'>
			<div className='alert alert-success mb-0'>
				<h2 className='text-center fs-4'>Profile Updated!</h2>
			</div>
		</Modal>
	);
});

SuccessMessage.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired
};

export default SuccessMessage;
