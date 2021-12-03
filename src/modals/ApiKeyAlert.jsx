import React from 'react';
import PropTypes from 'prop-types';
import ToastFade from 'react-bootstrap/Toast';
import secondsLogo from '../assets/img/logo.svg';
import ToastContainer from 'react-bootstrap/ToastContainer';

const ApiKeyAlert = ({ message, onClose }) => {
	return (
		<ToastContainer className='bottomRight'>
			<ToastFade onClose={() => onClose('')} show={!!message} animation={true} delay={3000} autohide>
				<ToastFade.Header closeButton={false}>
					<img src={secondsLogo} className='rounded me-2' alt='' />
					<strong className='me-auto'>Seconds</strong>
				</ToastFade.Header>
				<ToastFade.Body>{message}</ToastFade.Body>
			</ToastFade>
		</ToastContainer>
	);
};

ApiKeyAlert.propTypes = {
	message: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired
};

export default ApiKeyAlert;
