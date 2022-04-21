import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { cancelSubscription } from '../../../../../store/actions/stripe';

const CancelPlan = ({ show, onHide, centered, onComplete }) => {
	const dispatch = useDispatch();
	const [reason, setReason] = useState("");
	const { email } = useSelector(state => state['currentUser'].user);

	return (
		<Modal show={show} onHide={onHide} centered={!!centered}>
			<Modal.Header closeButton>
				<Modal.Title>Cancel Subscription</Modal.Title>
			</Modal.Header>
				<Modal.Body className='px-3 d-flex flex-column justify-content-center align-items-center border-0'>
				<span className='fs-6'>
					Are you sure you want to cancel your subscription? Your plan will remain active until the end of the billing period.{' '}
					<strong>This operation may stop your activated workflows.</strong>
				</span>
				{/*<h2>Please tell us why you are cancelling your subscription?&nbsp;<span className="text-danger">*</span></h2>*/}
				<div className="my-4">
					<label htmlFor='' className="form-label mb-2">Please tell us why you are cancelling your subscription?&nbsp;<span className="text-danger">*</span></label>
					<textarea className="form-control fs-6" name='' id='' cols='30' rows='6' onChange={(e) => setReason(e.target.value)}></textarea>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='outline-secondary' onClick={onHide}>
					Cancel
				</Button>
				<Button
					disabled={reason.length < 3}
					variant="danger"
					onClick={() => {
						onHide();
						dispatch(cancelSubscription(email, reason)).then(cancelDate => onComplete(cancelDate));
					}}
				>
					Cancel Subscription
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

CancelPlan.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	centered: PropTypes.bool,
	onComplete: PropTypes.func.isRequired
};

export default CancelPlan;
