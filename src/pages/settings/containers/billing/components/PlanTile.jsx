import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import { SUBSCRIPTION_PLANS } from '../../../../../constants';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { BsInfoCircle } from 'react-icons/bs';
import { styled } from '@mui/material/styles';

const PlanTile = ({ selected, name, price, description, features, activePlan, onSelect, role }) => {
	const CustomWidthTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)({
		[`& .${tooltipClasses.tooltip}`]: {
			maxWidth: 500
		}
	});

	return (
		<div className={`row w-100 rounded-3 p-3 ${selected && 'border-2 border-primary'} plan-tile`} role={role} onClick={onSelect}>
			<div className='col-9'>
				<div className='d-flex align-items-center'>
					<span className='fs-3 text-capitalize me-1 font-semibold'>{name}</span>
					<CustomWidthTooltip
						className='me-2'
						title={
							<pre>
								<span className='font-medium fw-bold fs-6'>
									What is included in<span className='text-capitalize'>&nbsp;{name} Plan?</span>
								</span>
								<span className="font-normal" style={{fontSize: "1.25em"}}>
								{`\n${features}`}
								</span>
							</pre>
						}
						placement='right-start'
					>
						<IconButton size='small'>
							<BsInfoCircle />
						</IconButton>
					</CustomWidthTooltip>
					{activePlan && <Chip label='Your Current Plan' size='small' color='secondary' />}
				</div>
				<div>
					<span>{description}</span>
				</div>
			</div>
			<div className='col-3'>
				{name === SUBSCRIPTION_PLANS.ENTERPRISE.name ? (
					<div className='d-flex justify-content-center align-items-center h-100'>
						<a
							href='https://calendly.com/seconds-demo/30min?month=2022-04'
							target='_blank'
							className='btn btn-outline-dark'
							style={{ width: 150 }}
						>
							<span>{price}</span>
						</a>
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
	onSelect: PropTypes.func
};

export default PlanTile;
