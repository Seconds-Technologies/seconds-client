import './workflows.css';
import React, { useState } from 'react';
import Switch from 'react-switch';
import Slider from '@mui/material/Slider';
import DeliveryTimes from '../../deliveryTimes/DeliveryTimes';
import { Formik } from 'formik';
import { BsInfoCircle } from 'react-icons/bs';
import { DELIVERY_STRATEGIES, DISPATCH_TYPES } from '../../../../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { updateBusinessWorkflow } from '../../../../../store/actions/settings';
import SuccessToast from '../../../../../modals/SuccessToast';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

const onIcon = <div className='switch-icon'>On</div>;
const offIcon = <div className='switch-icon'>Off</div>;

const BusinessWorkflows = props => {
	const dispatch = useDispatch();
	const [showModal, setShowModal] = useState(false);
	const [message, setMessage] = useState('');
	const { email } = useSelector(state => state['currentUser'].user);
	const { sms, defaultDispatch, autoDispatch, driverResponseTime, driverDeliveryFee, courierSelectionCriteria, courierPriceThreshold } =
		useSelector(state => state['settingsStore']);

	return (
		<div className='tab-container px-3'>
			<SuccessToast toggleShow={setMessage} message={message} delay={2000} position={'bottomRight'} />
			<DeliveryTimes show={showModal} onHide={() => setShowModal(false)} />
			<Formik
				enableReinitialize
				initialValues={{
					sms,
					defaultDispatch,
					autoDispatch,
					driverResponseTime,
					courierSelectionCriteria,
					courierPriceThreshold,
					driverDeliveryFee
				}}
				onSubmit={values => {
					console.log(values);
					dispatch(updateBusinessWorkflow(email, values)).then(message => setMessage(message));
				}}
			>
				{({ values, handleSubmit, handleChange, handleBlur, handleReset, setFieldValue }) => (
					<form onSubmit={handleSubmit} className='container-fluid'>
						<div className='row pb-4'>
							<div>
								<h1 className='workflow-header fs-4'>Set Delivery Time</h1>
								<p className='text-muted'>Let us know the times you want to provide Same Day Delivery</p>
								<div className=''>
									<button
										type='button'
										className='btn btn-outline-secondary btn-sm'
										style={{ width: 130 }}
										onClick={() => setShowModal(true)}
									>
										Change
									</button>
								</div>
							</div>
						</div>
						<div className='row pb-4'>
							<h1 className='workflow-header fs-4'>Customer ETA</h1>
							<p className='text-muted'>Turn on customer tracking will send customers real time delivery tracking page with live ETA</p>
							<div className='d-flex flex-grow-1 align-items-center'>
								<Switch
									onColor={'#9FEA86'}
									checkedIcon={onIcon}
									uncheckedIcon={offIcon}
									onChange={() => setFieldValue('sms', !values.sms)}
									handleDiameter={19}
									checked={values.sms}
									className='switch-text'
								/>
								<div className='d-flex align-items-center'>
									<span className='ms-3 me-2 workflow-header fs-6'>SMS notification</span>
									<Tooltip title='We charge £0.05 per sms notification' placement="right-start">
										<IconButton size="small">
											<BsInfoCircle />
										</IconButton>
									</Tooltip>
								</div>
							</div>
						</div>
						<div className='row pb-4 w-75'>
							<h1 className='workflow-header fs-4'>Auto dispatch</h1>
							<p className='text-muted'>Decide who we should prioritise to carry out your deliveries</p>
							<div className='mb-3'>
								<div className='form-check'>
									<input
										className='form-check-input'
										type='radio'
										name='defaultDispatch'
										id='dispatch-radio-1'
										onChange={e => setFieldValue('defaultDispatch', DISPATCH_TYPES.DRIVER)}
										checked={values.defaultDispatch === DISPATCH_TYPES.DRIVER}
									/>
									<label className='form-check-label' htmlFor='dispatch-radio-1'>
										Your drivers
									</label>
								</div>
								<div className='form-check'>
									<input
										className='form-check-input'
										type='radio'
										name='defaultDispatch'
										id='dispatch-radio-2'
										onChange={e => setFieldValue('defaultDispatch', DISPATCH_TYPES.COURIER)}
										checked={values.defaultDispatch === DISPATCH_TYPES.COURIER}
									/>
									<label className='form-check-label' htmlFor='dispatch-radio-2'>
										Third party couriers
									</label>
								</div>
							</div>
							<div className='d-flex my-2'>
								<Switch
									onColor={'#9FEA86'}
									checkedIcon={onIcon}
									uncheckedIcon={offIcon}
									onChange={() => setFieldValue('autoDispatch.enabled', !values.autoDispatch.enabled)}
									handleDiameter={19}
									checked={values.autoDispatch.enabled}
								/>
								<div className='ms-3 d-flex flex-column flex-wrap'>
									<span className='workflow-header fs-6'>Auto-dispatching</span>
									<p className='text-muted'>
										Turning on this feature will automatically dispatch any incoming delivery request to the earliest available
										driver or a third-party courier
									</p>
									<div>
										<span>Assign to</span>
										<div className='input-group mb-3 w-75'>
											<label className='input-group-text' htmlFor='inputGroupSelect01'>
												Driver with
											</label>
											<select
												className='form-select'
												id='inputGroupSelect01'
												name='autoDispatch.maxOrders'
												value={values.autoDispatch.maxOrders}
												onChange={handleChange}
												onBlur={handleBlur}
											>
												<option value={1}>1 maximum order</option>
												<option value={2}>2 maximum orders</option>
												<option value={3}>3 maximum orders</option>
												<option value={4}>4 maximum orders</option>
												<option value={5}>5 maximum orders</option>
												<option value={6}>6 maximum orders</option>
												<option value={7}>7 maximum orders</option>
												<option value={8}>8 maximum orders</option>
												<option value={9}>9 maximum orders</option>
												<option value={10}>10 maximum orders</option>
											</select>
										</div>
									</div>
								</div>
							</div>
							<div className='d-flex my-2'>
								<Switch
									onColor={'#9FEA86'}
									checkedIcon={onIcon}
									uncheckedIcon={offIcon}
									onChange={() => setFieldValue('autoDispatch.onlineOnly', !values.autoDispatch.onlineOnly)}
									handleDiameter={19}
									checked={values.autoDispatch.onlineOnly}
								/>
								<div className='ms-3 d-flex flex-column flex-wrap'>
									<span className='workflow-header fs-6'>Dispatch to online drivers only</span>
									<p className='text-muted'>This will only show drivers active now when manually assigning a driver</p>
								</div>
							</div>
						</div>
						<div className='row pb-4'>
							<h1 className='workflow-header fs-4'>Drivers response time</h1>
							<p className='text-muted'>This is the maximum time allowed for a driver to accept the order</p>
							<div className='input-group' style={{ width: 200 }}>
								<input
									defaultValue={values.driverResponseTime}
									type='number'
									min={0}
									max={60}
									name='driverResponseTime'
									className='form-control'
									aria-label='drivers-response-time'
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<span className='input-group-text'>mins</span>
							</div>
						</div>
						<div className='row pb-4'>
							<h1 className='workflow-header fs-4'>Third Party Provider Preferences</h1>
							<p className='text-muted'>Communicate your selection criteria</p>
							<div>
								<div className='form-check'>
									<input
										defaultChecked={values.courierSelectionCriteria === DELIVERY_STRATEGIES.PRICE}
										className='form-check-input'
										type='radio'
										name='courierSelectionCriteria'
										id='criteria-radio-1'
										onChange={() => setFieldValue('courierSelectionCriteria', DELIVERY_STRATEGIES.PRICE)}
										onBlur={handleBlur}
									/>
									<label className='form-check-label' htmlFor='exampleRadios1'>
										Lowest price
									</label>
								</div>
								<div className='form-check'>
									<input
										defaultChecked={values.courierSelectionCriteria === DELIVERY_STRATEGIES.ETA}
										className='form-check-input'
										type='radio'
										name='courierSelectionCriteria'
										id='criteria-radio-2'
										onChange={() => setFieldValue('courierSelectionCriteria', DELIVERY_STRATEGIES.ETA)}
										onBlur={handleBlur}
									/>
									<label className='form-check-label' htmlFor='exampleRadios2'>
										Fastest delivery time
									</label>
								</div>
								<div className='form-check'>
									<input
										defaultChecked={values.courierSelectionCriteria === DELIVERY_STRATEGIES.RATING}
										className='form-check-input'
										type='radio'
										name='courierSelectionCriteria'
										id='criteria-radio-3'
										onChange={() => setFieldValue('courierSelectionCriteria', DELIVERY_STRATEGIES.RATING)}
										onBlur={handleBlur}
									/>
									<label className='form-check-label' htmlFor='exampleRadios3'>
										Highest courier rating
									</label>
								</div>
							</div>
							<div className='mt-4'>
								<div className='d-flex align-items-center mb-2'>
									<label htmlFor='customRange2' className='d-flex me-2'>
										Price Threshold
									</label>
									<Tooltip title='Set this price to receive alerts whenever third party couriers charge you more' placement="right-start">
										<IconButton size="small">
											<BsInfoCircle />
										</IconButton>
									</Tooltip>
								</div>
								<div className='d-flex w-50'>
									<span className='px-4'>£5</span>
									<Slider
										name='courierPriceThreshold'
										color='secondary'
										aria-label='courier-price-threshold'
										defaultValue={values.courierPriceThreshold}
										valueLabelDisplay='auto'
										step={1}
										marks
										min={5}
										max={15}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<span className='px-4'>£15</span>
								</div>
							</div>
						</div>
						<div className='row pb-4'>
							<h1 className='workflow-header fs-4'>Delivery fee</h1>
							<p className='text-muted'>How much do you charge your customers for delivery</p>
							<div className='input-group' style={{ width: 200 }}>
								<span className='input-group-text'>£</span>
								<input
									name='driverDeliveryFee'
									className='form-control'
									defaultValue={values.driverDeliveryFee}
									type='number'
									min={0}
									max={60}
									onChange={handleChange}
									onBlur={handleBlur}
									aria-label='Amount in pounds (with dot and two decimal places)'
								/>
							</div>
						</div>
						<div className='row py-4'>
							<div className='d-flex'>
								<button onClick={handleReset} className='btn btn-dark me-5' style={{ height: 45, width: 150 }}>
									Reset
								</button>
								<button type='submit' className='btn btn-primary' style={{ height: 45, width: 150 }}>
									Save
								</button>
							</div>
						</div>
					</form>
				)}
			</Formik>
		</div>
	);
};

BusinessWorkflows.propTypes = {};

export default BusinessWorkflows;
