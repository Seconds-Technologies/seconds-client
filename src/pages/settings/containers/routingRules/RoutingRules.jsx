import React, { useState } from 'react';
import { updateBusinessWorkflow } from '../../../../store/actions/settings';
import { Form, Formik } from 'formik';
import Switch from 'react-switch';
import { BATCH_TYPES, offIcon, onIcon, VEHICLE_TYPES } from '../../../../constants';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { BsInfoCircle } from 'react-icons/bs';
import dayjs from 'dayjs';
import Slider from '@mui/material/Slider';
import SuccessToast from '../../../../modals/SuccessToast';
import { useDispatch, useSelector } from 'react-redux';

const RoutingRules = props => {
	const dispatch = useDispatch();
	const [message, setMessage] = useState('');
	const { email, deliveryHours } = useSelector(state => state['currentUser'].user);
	const {
		autoDispatch,
		defaultBatchMode,
		autoBatch,
		routeOptimization
	} = useSelector(state => state['settingsStore']);
	return (
		<div className="tab-container px-3">
			<SuccessToast toggleShow={setMessage} message={message} delay={2000} position={'bottomRight'} />
			<Formik
				enableReinitialize
				initialValues={{
					autoDispatch,
					defaultBatchMode,
					autoBatch,
					routeOptimization
				}}
				onSubmit={values => {
					console.log(values);
					dispatch(updateBusinessWorkflow(email, values)).then(message => setMessage(message));
				}}
			>
				{({ values, handleSubmit, handleChange, handleBlur, handleReset, setFieldValue }) => (
					<Form className='container-fluid'>
						<div className='row pb-4 w-75'>
							<h1 className='workflow-header fs-4'>Auto Batching</h1>
							<p className='text-muted'>Configure rules to automate batching for incoming orders</p>
							<div className='d-flex flex-row'>
								<Switch
									disabled={!values.autoDispatch.enabled}
									onColor={'#9FEA86'}
									checkedIcon={onIcon}
									uncheckedIcon={offIcon}
									onChange={() => setFieldValue('autoBatch.enabled', !values.autoBatch.enabled)}
									handleDiameter={19}
									checked={values.autoBatch.enabled}
								/>
								<div className='ms-3 d-flex flex-column flex-wrap'>
									<span className='workflow-header fs-6'>Auto-batching</span>
									<p className='text-muted'>
										Turning on this feature will automatically batch any incoming orders until your desired time, <br />
										before performing route optimization and assigning routes to your drivers
									</p>
								</div>
							</div>
							<div>
								<div className='form-check'>
									<input
										className='form-check-input'
										type='radio'
										name='defaultBatchMode'
										id='dispatch-radio-3'
										onChange={e => setFieldValue('defaultBatchMode', BATCH_TYPES.DAILY)}
										checked={values.defaultBatchMode === BATCH_TYPES.DAILY}
									/>
									<label className='form-check-label' htmlFor='dispatch-radio-3'>
										Daily
									</label>
								</div>
								<div className='form-check'>
									<input
										className='form-check-input'
										type='radio'
										name='defaultBatchMode'
										id='dispatch-radio-4'
										onChange={e => setFieldValue('defaultBatchMode', BATCH_TYPES.INCREMENTAL)}
										checked={values.defaultBatchMode === BATCH_TYPES.INCREMENTAL}
									/>
									<label className='form-check-label' htmlFor='dispatch-radio-4'>
										Hourly
									</label>
								</div>
							</div>
							{values.defaultBatchMode === BATCH_TYPES.DAILY ? (
								<div className='row gy-3'>
									<div className='col-sm-12 col-md-4'>
										<label htmlFor='daily-batch-deadline' className='mb-1'>
											Same day batch deadline
										</label>
										<input
											id='daily-batch-deadline'
											defaultValue={values.autoBatch.daily.deadline}
											type='time'
											min={dayjs(deliveryHours[dayjs().day()].open).format('HH:mm')}
											max={dayjs(deliveryHours[dayjs().day()].close).format('HH:mm')}
											name='autoBatch.daily.deadline'
											className='form-control rounded-3 mb-2'
											aria-label='drivers-response-time'
											onChange={handleChange}
											onBlur={handleBlur}
											required={values.defaultBatchMode === BATCH_TYPES.DAILY}
										/>
										<div id='' className='form-text'>
											Any orders placed before this time, will be batched for <strong>SAME DAY</strong> delivery. <br />
											Orders placed after this time will be batched for <strong>NEXT DAY</strong> delivery (depending on your
											delivery hours)
										</div>
									</div>
									<div className='col-sm-12 col-md-4'>
										<label htmlFor='daily-pickup-time' className='mb-1'>
											Driver pickup time
										</label>
										<input
											id='daily-pickup-time'
											defaultValue={values.autoBatch.daily.pickupTime}
											type='time'
											min={values.autoBatch.daily.deadline}
											max={dayjs(deliveryHours[dayjs().day()].close).format('HH:mm')}
											name='autoBatch.daily.pickupTime'
											className='form-control rounded-3 mb-2'
											aria-label='drivers-response-time'
											onChange={handleChange}
											onBlur={handleBlur}
											required={values.defaultBatchMode === BATCH_TYPES.DAILY}
										/>
										<div id='' className='form-text'>
											Set the time that orders should be optimized and assigned to your drivers
										</div>
									</div>
								</div>
							) : (
								<div className='row gy-3'>
									<div className='col-sm-12 mb-1'>
										<div className='d-flex align-items-center mb-2'>
											<label htmlFor='daily-batch-deadline' className='me-1'>
												Batching interval (hours)
											</label>
											<Tooltip title='Choose how often we should batch orders during the day' placement='right-start'>
												<IconButton size='small'>
													<BsInfoCircle />
												</IconButton>
											</Tooltip>
										</div>
										<div className='d-flex' style={{ width: 500 }}>
											<span className='px-4'>2&nbsp;hrs</span>
											<Slider
												name='autoBatch.incremental.batchInterval'
												color='secondary'
												aria-label='courier-price-threshold'
												defaultValue={values.autoBatch.incremental.batchInterval}
												valueLabelDisplay='auto'
												step={1}
												marks
												min={2}
												max={12}
												onChange={handleChange}
												onBlur={handleBlur}
											/>
											<span className='px-4'>12&nbsp;hrs</span>
										</div>
									</div>
									<div className='col-sm-12'>
										<div className='d-flex align-items-center mb-2'>
											<label htmlFor='daily-batch-deadline' className='me-1'>
												Wait period (minutes)
											</label>
											<Tooltip title='Set how long to wait before assigning batches to drivers' placement='right-start'>
												<IconButton size='small'>
													<BsInfoCircle />
												</IconButton>
											</Tooltip>
										</div>
										<div className='input-group' style={{ width: 200 }}>
											<input
												defaultValue={values.autoBatch.incremental.waitTime}
												type='number'
												min={0}
												max={60}
												name='autoBatch.incremental.waitTime'
												className='form-control'
												aria-label='autoBatch-incremental-wait-time'
												onChange={handleChange}
												onBlur={handleBlur}
												required={values.defaultBatchMode === BATCH_TYPES.INCREMENTAL}
											/>
											<span className='input-group-text'>mins</span>
										</div>
									</div>
								</div>
							)}
						</div>
						<div className='row pb-4 gx-3'>
							<h1 className='workflow-header fs-4'>Automated Route Optimization</h1>
							<p className='text-muted'>Control how order batches should be optimized and assigned to your drivers</p>
							<div className='col-sm-12 col-md-3'>
								<span className='workflow-header fs-6'>Select vehicle types</span>
								<div className='d-flex flex-column mt-2'>
									{VEHICLE_TYPES.map(({ value, label }, index) => (
										<div key={index} className='form-check'>
											<input
												defaultChecked={values.routeOptimization.vehicleTypes[value]}
												name={`routeOptimization.vehicleTypes[${value}]`}
												className='form-check-input'
												type='checkbox'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
											<label className='form-check-label' htmlFor='flexCheckDefault'>
												{label}
											</label>
										</div>
									))}
								</div>
							</div>
							<div className='col-sm-12 col-md-3'>
								<span className='workflow-header fs-6'>Optimisation objectives</span>
								<div className='d-flex flex-column mt-2'>
									<div className='form-check'>
										<input
											defaultChecked={values.routeOptimization.objectives.mileage}
											name='routeOptimization.objectives.mileage'
											className='form-check-input'
											type='checkbox'
											id='criteria-radio-1'
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										<label className='form-check-label' htmlFor='exampleRadios1'>
											Minimise drive time
										</label>
									</div>
									<div className='form-check'>
										<input
											defaultChecked={values.routeOptimization.objectives.duration}
											className='form-check-input'
											type='checkbox'
											name='routeOptimization.objectives.duration'
											id='criteria-radio-2'
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										<label className='form-check-label' htmlFor='exampleRadios2'>
											Arrive on time
										</label>
									</div>
									<div className='form-check'>
										<input
											defaultChecked={values.routeOptimization.objectives.cost}
											className='form-check-input'
											type='checkbox'
											name='routeOptimization.objectives.cost'
											id='criteria-radio-3'
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										<label className='form-check-label' htmlFor='exampleRadios3'>
											Minimise cost
										</label>
									</div>
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

RoutingRules.propTypes = {
	
};

export default RoutingRules;
