import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DELIVERY_STRATEGIES, DISPATCH_TYPES, offIcon, onIcon, VEHICLE_TYPES } from '../../../../constants';
import Switch from 'react-switch';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { BsInfoCircle } from 'react-icons/bs';
import { Form, Formik } from 'formik';
import { updateBusinessWorkflow } from '../../../../store/actions/settings';
import SuccessToast from '../../../../modals/SuccessToast';
import VehicleSettings from './components/VehicleSettings';

const DispatchRules = props => {
	const dispatch = useDispatch();
	const [message, setMessage] = useState('');
	const [vehicleOption, showVehicleOption] = useState({
		show: false,
		code: '',
		label: '',
		minDispatchAmount: 0,
		maxDispatchAmount: 100,
		maxTransitTime: 720
	});
	const { email } = useSelector(state => state['currentUser'].user);
	const {
		jobAlerts,
		defaultDispatch,
		autoDispatch,
		driverResponseTime,
		courierSelectionCriteria,
		courierPriceThreshold,
		courierVehicles,
		pickupInstructions
	} = useSelector(state => state['settingsStore']);
	return (
		<div className='tab-container px-3'>
			<SuccessToast toggleShow={setMessage} message={message} delay={2000} position={'bottomRight'} />
			<Formik
				enableReinitialize
				initialValues={{
					jobAlerts,
					defaultDispatch,
					autoDispatch,
					driverResponseTime,
					courierSelectionCriteria,
					courierPriceThreshold,
					courierVehicles,
					pickupInstructions
				}}
				onSubmit={values => {
					console.log(values);
					dispatch(updateBusinessWorkflow(email, values)).then(message => setMessage(message));
				}}
			>
				{({ values, handleSubmit, handleChange, handleBlur, handleReset, setFieldValue }) => (
					<Form className='container-fluid'>
						<VehicleSettings
							open={vehicleOption.show}
							onClose={() => showVehicleOption(prevState => ({ ...prevState, show: false }))}
							code={vehicleOption.code}
							label={vehicleOption.label}
							defaultMinDispatch={vehicleOption.minDispatchAmount}
							defaultMaxDispatch={vehicleOption.maxDispatchAmount}
							defaultMaxTransitTime={vehicleOption.maxTransitTime}
							onChange={handleChange}
						/>
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
										Delivery service providers
									</label>
								</div>
							</div>
							<div className='d-flex my-2'>
								<Switch
									onColor={'#9FEA86'}
									checkedIcon={onIcon}
									uncheckedIcon={offIcon}
									onChange={() => {
										setFieldValue('autoDispatch.enabled', !values.autoDispatch.enabled);
										values.autoDispatch.enabled && setFieldValue('autoBatch.enabled', false);
									}}
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
							<div className='d-flex flex-grow-1 align-items-center mt-4'>
								<Switch
									onColor={'#9FEA86'}
									checkedIcon={onIcon}
									uncheckedIcon={offIcon}
									onChange={() => setFieldValue('jobAlerts.expired', !values.jobAlerts.expired)}
									handleDiameter={19}
									checked={values.jobAlerts.expired}
									className='switch-text'
								/>
								<div className='d-flex align-items-center'>
									<span className='ms-3 me-2 workflow-header fs-6'>Receive alerts for expired jobs</span>
								</div>
							</div>
						</div>
						<div className='row pb-4'>
							<h1 className='workflow-header fs-4'>Delivery Service Provider Preferences</h1>
							<p className='text-muted'>Communicate your selection criteria in case of a quote tie-breaker</p>
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
							</div>
							<div className='mt-4'>
								<span className='me-2 workflow-header fs-6'>Allowed Delivery Vehicles</span>
								<div className='d-flex flex-column mt-2'>
									{VEHICLE_TYPES.map(({ value, label }, index) => (
										<div className='row ms-1 mb-1 d-flex align-items-center'>
											<div key={index} className='form-check col-1'>
												<input
													defaultChecked={values.courierVehicles[value].enabled}
													name={`courierVehicles.${value}.enabled`}
													className='form-check-input'
													type='checkbox'
													onChange={handleChange}
													onBlur={handleBlur}
												/>
												<label className='form-check-label' htmlFor='flexCheckDefault'>
													{label}
												</label>
											</div>
											<div className='col-1'>
												<button
													type='button'
													className='btn btn-sm btn-outline-primary'
													onClick={() =>
														showVehicleOption(prevState => ({
															show: true,
															code: value,
															label,
															minDispatchAmount: values.courierVehicles[value].minDispatchAmount,
															maxDispatchAmount: values.courierVehicles[value].maxDispatchAmount,
															maxTransitTime: values.courierVehicles[value].maxTransitTime
														}))
													}
												>
													customize
												</button>
											</div>
										</div>
									))}
								</div>
							</div>
							<div className='mt-4 col-md-3'>
								<div className='d-flex align-items-center'>
									<span className='me-2 workflow-header fs-6'>Pickup Instructions</span>
									<Tooltip
										title='Instructions presented to the delivery courier through their app (max 125 characters)'
										placement='right-start'
									>
										<IconButton size='small'>
											<BsInfoCircle />
										</IconButton>
									</Tooltip>
								</div>
								<div className='d-flex flex-column mt-2'>
									<input
										defaultValue={values.pickupInstructions}
										type='text'
										className='form-control rounded-3 mb-1'
										name='pickupInstructions'
										maxLength={125}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
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
					</Form>
				)}
			</Formik>
		</div>
	);
};

DispatchRules.propTypes = {};

export default DispatchRules;
