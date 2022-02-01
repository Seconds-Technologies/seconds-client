import React from 'react';
import PropTypes from 'prop-types';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ToastFade from 'react-bootstrap/Toast';
import secondsLogo from '../assets/img/logo.svg';

const SuccessToast = ({message, toggleShow})  => {
	return (
		<ToastContainer className='topRight'>
			<ToastFade onClose={() => toggleShow('')} show={!!message} animation={true} delay={3000} autohide>
				<ToastFade.Header closeButton={false}>
					<img src={secondsLogo} className='rounded me-2' alt='' />
					<strong className='me-auto'>Seconds</strong>
				</ToastFade.Header>
				<ToastFade.Body>{message}</ToastFade.Body>
			</ToastFade>
		</ToastContainer>
	);
};

SuccessToast.propTypes = {
	toggleShow: PropTypes.func.isRequired,
	message: PropTypes.string.isRequired
};

export default SuccessToast;
