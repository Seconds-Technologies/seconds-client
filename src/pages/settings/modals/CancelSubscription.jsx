import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { cancelSubscription } from '../../../store/actions/stripe';

const CancelSubscription = ({ show, onHide, centered, onComplete }) => {
	const dispatch = useDispatch();
	const { email } = useSelector(state => state['currentUser'].user);

	return (
		<Modal show={show} onHide={onHide} centered={!!centered}>
			<Modal.Header closeButton>
				<Modal.Title>Cancel Subscription</Modal.Title>
			</Modal.Header>
			<Modal.Body className='d-flex justify-content-center align-items-center border-0'>
				<span className='fs-6'>Are you sure you want to cancel your subscription? Your plan will remain active until the end of the billing period</span>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={onHide}>
					Cancel
				</Button>
				<Button
					onClick={() => {
						onHide()
						dispatch(cancelSubscription(email)).then((cancelDate) => onComplete(cancelDate));
					}}
				>
					Confirm
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

CancelSubscription.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	centered: PropTypes.bool,
	onComplete: PropTypes.func.isRequired
};

export default CancelSubscription;
