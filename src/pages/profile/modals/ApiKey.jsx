import React from 'react';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';

const ApiKey = ({show, onHide, apiKey}) => {
	return (
		<Modal show={show} onHide={onHide} centered size='md' style={{ marginLeft: 100 }}>
			<Modal.Header closeButton>
				<Modal.Title>Your API Key</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='text-center'>
					<span className='fs-5'>{apiKey}</span>
				</div>
			</Modal.Body>
		</Modal>
	);
};

ApiKey.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	apiKey: PropTypes.string.isRequired
}

export default ApiKey;
