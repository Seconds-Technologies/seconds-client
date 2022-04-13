import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import PlanTile from '../components/PlanTile';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import { SUBSCRIPTION_PLANS } from '../../../constants';

const ChangeSubscription = ({ show, onHide, centered, onChange }) => {
	const [selectedPlan, setSelectedPlan] = useState("")
	const { subscriptionPlan } = useSelector(state => state['currentUser'].user);

	return (
		<Modal centered={centered} show={show} onHide={onHide} size='lg' scrollable>
			<Modal.Header closeButton>
				<Modal.Title>Choose Plan</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='ms-3 row gy-3'>
					<div className='col-12'>
						<PlanTile
							selected={selectedPlan === SUBSCRIPTION_PLANS.STARTER.name}
							name={SUBSCRIPTION_PLANS.STARTER.name}
							description={SUBSCRIPTION_PLANS.STARTER.description}
							activePlan={subscriptionPlan === SUBSCRIPTION_PLANS.STARTER.name}
							onSelect={() => setSelectedPlan(SUBSCRIPTION_PLANS.STARTER.name)}
							role={'button'}
						/>
					</div>
					<div className='col-12'>
						<PlanTile
							selected={selectedPlan === SUBSCRIPTION_PLANS.GROWTH.name}
							name={SUBSCRIPTION_PLANS.GROWTH.name}
							description={SUBSCRIPTION_PLANS.GROWTH.description}
							price={49}
							activePlan={subscriptionPlan === SUBSCRIPTION_PLANS.GROWTH.name}
							onSelect={() => setSelectedPlan(SUBSCRIPTION_PLANS.GROWTH.name)}
							role={'button'}
						/>
					</div>
					<div className='col-12'>
						<PlanTile
							selected={selectedPlan === SUBSCRIPTION_PLANS.PRO.name}
							name={SUBSCRIPTION_PLANS.PRO.name}
							description={SUBSCRIPTION_PLANS.PRO.description}
							price={89}
							activePlan={subscriptionPlan === SUBSCRIPTION_PLANS.PRO.name}
							onSelect={() => setSelectedPlan(SUBSCRIPTION_PLANS.PRO.name)}
							role={'button'}
						/>
					</div>
					<div className='col-12'>
						<PlanTile
							selected={selectedPlan === SUBSCRIPTION_PLANS.ENTERPRISE.name}
							name={SUBSCRIPTION_PLANS.ENTERPRISE.name}
							description={SUBSCRIPTION_PLANS.ENTERPRISE.description}
							price={'Book Demo'}
							activePlan={subscriptionPlan === SUBSCRIPTION_PLANS.ENTERPRISE.name}
						/>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={onHide}>
					Cancel
				</Button>
				<Button onClick={onChange} disabled={!selectedPlan}>Upgrade</Button>
			</Modal.Footer>
		</Modal>
	);
};

ChangeSubscription.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired
};

export default ChangeSubscription;
