import React from 'react';
import PropTypes from 'prop-types';
import { components } from 'react-select';
import bicycle from '../assets/img/bicycle.svg';
import motorbike from '../assets/img/motorbike.svg';
import cargobike from '../assets/img/cargobike.svg';
import car from '../assets/img/car.svg';
import van from '../assets/img/van.svg';

const VehicleOptions = props => (
	<components.Option {...props}>
		<div className='d-flex align-items-center'>
			<div className='me-3'>
				<img
					src={
						props.value === 'BIC'
							? bicycle
							: props.value === 'MTB'
							? motorbike
							: props.value === 'CGB'
							? cargobike
							: props.value === 'CAR'
							? car
							: van
					}
					className='img-fluid'
					alt=''
					width={50}
					height={50}
				/>
			</div>
			<div className='right'>
				<strong className='title'>{props.data.label}</strong>
				<div>{props.data.description}</div>
			</div>
		</div>
	</components.Option>
);

VehicleOptions.propTypes = {};

export default VehicleOptions;
