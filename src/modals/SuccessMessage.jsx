import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';

const SuccessMessage = React.forwardRef(({ show, onHide, message, centered }, ref) => {
	return (
		<Modal
			centered
			show={show}
			container={ref}
			onHide={onHide}
			size='lg'
			aria-labelledby='example-custom-modal-styling-title'
			// className='alert alert-success' //Add class name here
		>
			<div className='alert alert-success mb-0'>
				<h2 className='text-center'>{message}</h2>
			</div>
		</Modal>
	);
});

SuccessMessage.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	message: PropTypes.string.isRequired,
	centered: PropTypes.bool
};

export default SuccessMessage;
