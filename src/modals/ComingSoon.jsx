import React from 'react';
import PropTypes from 'prop-types';
import ToastFade from 'react-bootstrap/Toast';
import secondsLogo from '../assets/img/logo.svg';
import ToastContainer from 'react-bootstrap/ToastContainer';

const ComingSoon = ({ message, toggleMessage }) => {
	return (
		<ToastContainer className='topRight'>
			<ToastFade onClose={() => toggleMessage('')} show={!!message} animation={true} delay={3000} autohide>
				<ToastFade.Header closeButton={false}>
					<img src={secondsLogo} className='rounded me-2' alt='' />
					<strong className='me-auto'>Seconds</strong>
				</ToastFade.Header>
				<ToastFade.Body className='fs-5'>{message}</ToastFade.Body>
			</ToastFade>
		</ToastContainer>
	);
};

ComingSoon.propTypes = {
	message: PropTypes.string.isRequired,
	toggleMessage: PropTypes.func.isRequired
};

export default ComingSoon;
