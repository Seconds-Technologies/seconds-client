import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';

const Error = React.forwardRef(({ show, onHide, message }, ref) => {
	return (
		<Modal
			show={show}
			container={ref}
			onHide={onHide}
			size='lg'
			aria-labelledby='example-custom-modal-styling-title'
		>
			<div className='alert alert-danger mb-0' role='alert'>
				<h3 className='text-center'>{message}</h3>
			</div>
		</Modal>
	);
});

Error.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	message: PropTypes.string
};

export default Error;
