import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import { SUBSCRIPTION_PLANS } from '../../../constants';

const PlanTile = ({ selected, name, price = 'Free', description, activePlan, onSelect }) => {
	return (
		<div className={`row w-100 rounded-3 p-3 ${selected && 'border-2 border-primary'} plan-tile`} role="button" onClick={onSelect}>
			<div className='col-9'>
				<div className='d-flex align-items-center'>
					<span className='fs-3 text-capitalize me-3 font-semibold'>{name}</span>
					{activePlan && <Chip label='Your Current Plan' size='small' color='secondary' />}
				</div>
				<div>
					<span>{description}</span>
				</div>
			</div>
			<div className='col-3'>
				{name === SUBSCRIPTION_PLANS.ENTERPRISE.name ? (
					<div className='d-flex justify-content-center align-items-center h-100'>
						<button className='btn btn-outline-dark' style={{width: 150}}>
							<span>{price}</span>
						</button>
					</div>
				) : (
					<div className='d-flex justify-content-center align-items-center border h-100'>
						{typeof price === 'number' ? (
							<span className='fs-4'>
								£{price}
								<small className='text-muted fs-6'>/Month</small>
							</span>
						) : (
							<span className='fs-5'>{price}</span>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

PlanTile.propTypes = {
	name: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	price: PropTypes.any,
	activePlan: PropTypes.bool.isRequired,
	selected: PropTypes.bool.isRequired,
	onSelect: PropTypes.func.isRequired
};

export default PlanTile;
