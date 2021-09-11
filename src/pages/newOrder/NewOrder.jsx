import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Formik } from 'formik';
import './NewOrder.css';
import '../../App.css';
import { useDispatch, useSelector } from 'react-redux';
import { createDeliveryJob } from '../../store/actions/delivery';
import CurrencyInput from 'react-currency-input-field';
import moment from 'moment';

const NewOrder = props => {
	const [deliveryJob, setJob] = useState({});
	const [modal, showModal] = useState(false);
	const handleClose = () => showModal(false);
	const handleOpen = () => showModal(true);
	const { apiKey } = useSelector(state => state['currentUser'].user);
	const dispatch = useDispatch();

	const columns = [
		{ field: 'id', headerName: 'Job ID', width: 100 },
		{ field: 'pickupAddress', headerName: 'pickup address', width: 150 },
		{ field: 'dropoffAddress', headerName: 'dropoff Address', width: 150 },
		{ field: 'pickupStartTime', type: "dateTime", headerName: 'pickup time', width: 150 },
		{ field: 'dropoffStartTime', type: "dateTime", headerName: 'dropoff time', width: 150 },
		{ field: 'description', headerName: 'Description', width: 150 },
		{ field: 'quoteID', headerName: 'Quote ID', width: 150 },
	];

	return (
		<div className='newOrder container py-4'>
			<Modal show={modal} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Your delivery Job!</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						{Object.entries(deliveryJob).map(([key, value]) => (
							<div className="row p-3">
								<div className="col">{key}</div>
								<div className="col">{value}</div>
							</div>
						))}
					</div>
				</Modal.Body>
			</Modal>
			<Formik
				initialValues={{
					orderId: '',
					pickupFirstName: '',
					pickupLastName: '',
					pickupBusinessName: '',
					pickupAddress: '',
					pickupEmailAddress: 'N/A',
					pickupPhoneNumber: '',
					packagePickupStartTime: '',
					pickupInstructions: '',
					dropoffFirstName: '',
					dropoffLastName: '',
					dropoffBusinessName: '',
					dropoffAddress: '',
					dropoffEmailAddress: 'N/A',
					dropoffPhoneNumber: '',
					packageDropoffStartTime: '',
					dropoffInstructions: '',
					packageValue: 0,
					packageDescription: '',
					itemsCount: null,
				}}
				onSubmit={(values, actions) => {
					console.log(values)
					apiKey
						? dispatch(createDeliveryJob(values, apiKey)).then(
								({ createdAt, id, packages, status, winnerQuote }) => {
									let {
										description,
										pickupLocation: { address: pickupAddress },
										dropoffLocation: { address: dropoffAddress },
										pickupStartTime,
										dropoffStartTime,
									} = packages[0];
									let newJob = {
										id,
										description,
										pickupAddress,
										dropoffAddress,
										pickupStartTime: moment(pickupStartTime).format("DD-MM-YYYY HH:MM:ss"),
										dropoffStartTime: moment(dropoffStartTime).format("DD-MM-YYYY HH:MM:ss"),
										status,
										quoteId: winnerQuote,
									};
									setJob(newJob);
									handleOpen();
								}
						  )
						: alert(
								'Your account does not have an API' +
									' key associated with it. Please generate one from the integrations page'
						  );
				}}
			>
				{({ values, handleBlur, handleChange, handleSubmit, errors, setFieldValue }) => (
					<form onSubmit={handleSubmit} autoComplete='on'>
						<div className='row mx-3 align-items-center'>
							<div className='col-6 d-flex flex-column'>
								<h4>Pickup</h4>
								<div className='border border-2 rounded-3 p-4'>
									<div className='row'>
										<div className='col-6'>
											<input
												autoComplete='given-name'
												name='pickupFirstName'
												type='text'
												className='form-control form-border my-2'
												placeholder='First Name'
												aria-label='pickup-first-name'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
										<div className='col-6'>
											<input
												autoComplete='family-name'
												name='pickupLastName'
												type='text'
												className='form-control form-border my-2'
												placeholder='Last Name'
												aria-label='pickup-last-name'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									</div>
									<div className='row'>
										<div className='col-6'>
											<input
												autoComplete='email'
												name='pickupEmailAddress'
												type='email'
												className='form-control form-border my-2'
												placeholder='Email Address'
												aria-label='pickup-email-address'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
										<div className='col-6'>
											<input
												autoComplete='tel'
												name='businessPhoneNumber'
												type='text'
												className='form-control form-border my-2'
												placeholder='Phone Number'
												aria-label='pickup-phone-number'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									</div>
									<input
										autoComplete='organization'
										name='pickupBusinessName'
										type='text'
										className='form-control form-border my-3'
										placeholder='Business Name'
										aria-label='pickup-business-name'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<input
										autoComplete='street-address'
										name='pickupAddress'
										type='text'
										className='form-control form-border my-3'
										placeholder='Pickup Address'
										aria-label='pickup-address'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<input
										name='packagePickupStartTime'
										type='datetime-local'
										className='form-control form-border my-3'
										placeholder='Pickup At'
										aria-label='pickup-datetime'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<textarea
										name='pickupInstructions'
										className='form-control form-border my-3'
										placeholder='Pickup Instructions'
										aria-label='pickup-instructions'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
							</div>
							<div className='col-6 d-flex flex-column'>
								<h4>Dropoff</h4>
								<div className='border border-2 rounded-3 p-4'>
									<div className='row'>
										<div className='col-6'>
											<input
												autoComplete='given-name'
												name='dropoffFirstName'
												type='text'
												className='form-control form-border my-2'
												placeholder='First Name'
												aria-label='dropoff-first-name'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
										<div className='col-6'>
											<input
												autoComplete='family-name'
												name='dropoffLastName'
												type='text'
												className='form-control form-border my-2'
												placeholder='Last Name'
												aria-label='dropoff-last-name'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									</div>
									<div className='row'>
										<div className='col-6'>
											<input
												autoComplete='email'
												name='dropoffEmailAddress'
												type='email'
												className='form-control form-border my-2'
												placeholder='Email Address'
												aria-label='dropoff-email-address'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
										<div className='col-6'>
											<input
												autoComplete='tel'
												name='dropoffPhoneNumber'
												type='text'
												className='form-control form-border my-2'
												placeholder='Phone Number'
												aria-label='dropoff-phone-number'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									</div>
									<input
										autoComplete='organization'
										name='dropoffBusinessName'
										type='text'
										className='form-control form-border my-3'
										placeholder='Business Name'
										aria-label='dropoff-business-name'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<input
										autoComplete='street-address'
										name='dropoffAddress'
										type='text'
										className='form-control form-border my-3'
										placeholder='Dropoff Address'
										aria-label='dropoff-address'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<input
										name='packageDropoffStartTime'
										type='datetime-local'
										className='form-control form-border my-3'
										placeholder='Dropoff At'
										aria-label='dropoff-datetime'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<textarea
										name='dropoffInstructions'
										className='form-control form-border my-3'
										placeholder='Dropoff Instructions'
										aria-label='dropoff-instructions'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
							</div>
							<div className='row my-3 align-items-center'>
								<div className='col-12 d-flex flex-column'>
									<h4>Order Details</h4>
									<input
										name='orderId'
										type='text'
										className='form-control form-border my-3'
										placeholder='Order ID'
										aria-label='order-id'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<div className='row'>
										<div className='col-6'>
											<input
												name='itemsCount'
												type='number'
												className='form-control form-border my-2'
												placeholder='Number of Items'
												aria-label='items-count'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
										<div className='col-6'>
											<CurrencyInput
												prefix='£'
												defaultValue={values.packageValue}
												className='form-control form-border my-2'
												name='packageValue'
												placeholder='Package Price'
												aria-label='package-value'
												fixedDecimalLength={2}
												decimalsLimit={2}
												decimalScale={2}
												onValueChange={value => setFieldValue('packageValue', Number(value))}
												onBlur={handleBlur}
												step={1}
											/>
										</div>
									</div>
									<textarea
										name='packageDescription'
										className='form-control form-border my-2'
										placeholder='Package Description'
										aria-label='package-description'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
							</div>
							<div className='d-flex pt-5 justify-content-end'>
								<style type='text/css'>
									{`
									.btn-submit {
			                            background-color: #9400d3;
									}
									.btn-xl {
										padding: 1rem 1rem
									}
								`}
								</style>
								<Button variant='dark' size='lg' className='mx-3'>
									Get Quote
								</Button>
								<Button className='text-light' variant='submit' type='submit' size='lg'>
									Confirm
								</Button>
							</div>
						</div>
					</form>
				)}
			</Formik>
		</div>
	);
};

export default NewOrder;
