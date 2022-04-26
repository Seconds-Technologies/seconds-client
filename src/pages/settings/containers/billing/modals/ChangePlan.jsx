import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import PlanTile from '../components/PlanTile';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import { SUBSCRIPTION_PLANS } from '../../../../../constants';

const ChangePlan = ({ show, onHide, centered, onChange }) => {
	const [selectedPlan, setSelectedPlan] = useState('');
	const { subscriptionPlan } = useSelector(state => state['currentUser'].user);

	const confirmText = useMemo(() => {
		console.log(selectedPlan)
		const currentPrice = subscriptionPlan ? SUBSCRIPTION_PLANS[subscriptionPlan.toUpperCase()].price : -1
		if (selectedPlan && SUBSCRIPTION_PLANS[selectedPlan.toUpperCase()].price <= currentPrice) {
			return 'Downgrade';
		}
		return "Upgrade"
	}, [subscriptionPlan, selectedPlan])

	useEffect(() => {
		console.log(confirmText)
	}, [confirmText]);

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
							price={SUBSCRIPTION_PLANS.STARTER.price}
							onSelect={() =>
								subscriptionPlan === SUBSCRIPTION_PLANS.STARTER.name ? undefined : setSelectedPlan(SUBSCRIPTION_PLANS.STARTER.name)
							}
							features={SUBSCRIPTION_PLANS.STARTER.features.join('\n')}
							role={'button'}
						/>
					</div>
					<div className='col-12'>
						<PlanTile
							selected={selectedPlan === SUBSCRIPTION_PLANS.GROWTH.name}
							name={SUBSCRIPTION_PLANS.GROWTH.name}
							description={SUBSCRIPTION_PLANS.GROWTH.description}
							price={SUBSCRIPTION_PLANS.GROWTH.price}
							activePlan={subscriptionPlan === SUBSCRIPTION_PLANS.GROWTH.name}
							onSelect={() =>
								subscriptionPlan === SUBSCRIPTION_PLANS.GROWTH.name ? undefined : setSelectedPlan(SUBSCRIPTION_PLANS.GROWTH.name)
							}
							features={SUBSCRIPTION_PLANS.GROWTH.features.join('\n')}
							role={'button'}
						/>
					</div>
					<div className='col-12'>
						<PlanTile
							selected={selectedPlan === SUBSCRIPTION_PLANS.PRO.name}
							name={SUBSCRIPTION_PLANS.PRO.name}
							description={SUBSCRIPTION_PLANS.PRO.description}
							price={SUBSCRIPTION_PLANS.PRO.price}
							activePlan={subscriptionPlan === SUBSCRIPTION_PLANS.PRO.name}
							onSelect={() =>
								subscriptionPlan === SUBSCRIPTION_PLANS.PRO.name ? undefined : setSelectedPlan(SUBSCRIPTION_PLANS.PRO.name)
							}
							features={SUBSCRIPTION_PLANS.PRO.features.join('\n')}
							role={'button'}
						/>
					</div>
					<div className='col-12'>
						<PlanTile
							selected={selectedPlan === SUBSCRIPTION_PLANS.ENTERPRISE.name}
							name={SUBSCRIPTION_PLANS.ENTERPRISE.name}
							description={SUBSCRIPTION_PLANS.ENTERPRISE.description}
							price={'Book Demo'}
							features={SUBSCRIPTION_PLANS.ENTERPRISE.features.join('\n')}
							activePlan={subscriptionPlan === SUBSCRIPTION_PLANS.ENTERPRISE.name}
						/>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={onHide}>
					Cancel
				</Button>
				<Button onClick={() => onChange(selectedPlan)} disabled={!selectedPlan}>
					<span>{confirmText}</span>
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

ChangePlan.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired
};

export default ChangePlan;
