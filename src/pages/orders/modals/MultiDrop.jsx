import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { Formik } from 'formik';
import dayjs from 'dayjs';
import Button from 'react-bootstrap/Button';
import Select, { components } from 'react-select';
import { VEHICLE_TYPES } from '../../../constants';
import bicycle from '../../../assets/img/bicycle.svg';
import motorbike from '../../../assets/img/motorbike.svg';
import cargobike from '../../../assets/img/cargobike.svg';
import car from '../../../assets/img/car.svg';
import van from '../../../assets/img/van.svg';

const Deliveries = ({ index, dropoffLocation }) => (
	<div key={index} className='list-group-item list-group-item-action' aria-current='true'>
		<span className='fs-5'>
			<span className='font-bold'>{index + 1}.&nbsp;</span>
			{dropoffLocation.fullAddress}
		</span>
		<div className='align-items-center' />
	</div>
);

const Option = props => {
	return (
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
};

const MultiDrop = ({ show, onHide, orders, orderNumbers, windowStartTime, windowEndTime, onSubmit, onUpdate }) => {
	return (
		<Modal show={show} onHide={onHide} centered size='lg'>
			<div className='p-4 mt-2'>
				<Formik
					enableReinitialize
					initialValues={{
						windowStartTime,
						windowEndTime,
						vehicleType: '',
						orderNumbers
					}}
					onSubmit={onSubmit}
				>
					{({ errors, values, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
						<form onSubmit={handleSubmit} className='container-fluid'>
							<div className='d-flex justify-content-between mb-3'>
								<h1 className='fs-4 font-header'>New Multi-Drop Order</h1>
								<button type='button' className='btn-close shadow-none' aria-label='Close' onClick={onHide} />
							</div>
							<div className='row gy-2 mb-4'>
								<div className='col-12'>
									<h1 className='fs-5 font-header'>Time Window</h1>
								</div>
								<div className='col-6'>
									<label htmlFor=''>Start from</label>
									<input
										defaultValue={values.windowStartTime}
										id='start-time'
										name='windowStartTime'
										type='datetime-local'
										aria-label='start-time'
										className='form-control form-border rounded-3'
										onChange={handleChange}
										onBlur={handleBlur}
										min={dayjs().add(20, 'm').format('YYYY-MM-DDTHH:mm')}
										required
									/>
								</div>
								<div className='col-6'>
									<label htmlFor=''>End at</label>
									<input
										defaultValue={values.windowEndTime}
										name='windowEndTime'
										id='end-time'
										type='datetime-local'
										className='form-control form-border rounded-3'
										aria-label='end-time'
										onChange={handleChange}
										onBlur={handleBlur}
										min={dayjs(values.windowStartTime).format('YYYY-MM-DDTHH:mm')}
										max={dayjs(values.windowStartTime).set('h', 21).set('m', 0).format('YYYY-MM-DDTHH:mm')}
										required
									/>
								</div>
							</div>
							<div className="mb-3">
								<h2 className='fs-5 font-header'>Choose Your Vehicle</h2>
								<div className="w-50 my-2">
									<Select
										menuPlacement='top'
										id='vehicle-type'
										name='vehicleType'
										className='my-2'
										options={VEHICLE_TYPES}
										components={{ Option }}
										onChange={({ value }) => setFieldValue('vehicleType', value)}
										aria-label='vehicle type selection'
									/>
								</div>
							</div>
							<header className='mb-3'>
								<h1 className='fs-5 font-header'>Selected Orders</h1>
							</header>
							<div className='list-group mb-3'>
								{orders.map(({ _id: jobId, jobSpecification: { orderNumber, pickupStartTime, deliveries } }, index) => {
									const { dropoffLocation, dropoffStartTime, dropoffEndTime } = deliveries[0];
									return (
										<Deliveries
											onUpdate={onUpdate}
											orderNumber={orderNumber}
											dropoffLocation={dropoffLocation}
											dropoffStartTime={dropoffStartTime}
											dropoffEndTime={dropoffEndTime}
											index={index}
										/>
									);
								})}
							</div>
							<div className='d-flex justify-content-end'>
								<Button type='submit' variant='primary' size='lg'>
									Create Multi Drop
								</Button>
							</div>
						</form>
					)}
				</Formik>
			</div>
		</Modal>
	);
};

MultiDrop.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	orders: PropTypes.array.isRequired,
	orderNumbers: PropTypes.array.isRequired,
	onSubmit: PropTypes.func.isRequired
};

export default MultiDrop;
