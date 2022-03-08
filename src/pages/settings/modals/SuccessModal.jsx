import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const SuccessModal = React.forwardRef(({ show, onHide, message }, ref) => {
	return (
		<Modal show={show} container={ref} onHide={onHide} size={'lg'} centered aria-labelledby='example-custom-modal-styling-title'>
			<div className='alert alert-success mb-0'>
				<h2 className='text-center fs-4'>{message}</h2>
			</div>
		</Modal>
	);
});


SuccessModal.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	message: PropTypes.string.isRequired
}
export default SuccessModal;