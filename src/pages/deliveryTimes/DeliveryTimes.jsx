import React, { useEffect, useMemo, useState } from 'react';
import Switch from 'react-switch';
import './deliveryTimes.css';
import { Formik } from 'formik';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { updateDeliveryTimes } from '../../store/actions/auth';
import { addError } from '../../store/actions/errors';

/*const defaultDeliveryHours = {
	0: {
		open: { h: 10, m: 0, _id: "abhdbhsbkdnasnjndka" },
		close: { h: 16, m: 0, _id: "abhdbhsbkdnasnjndka" },
		canDeliver: false,
	},
	1: {
		open: { h: 7, m: 30, _id: "abhdbhsbkdnasnjndka" },
		close: { h: 18, m: 0, _id: "abhdbhsbkdnasnjndka" },
		canDeliver: true,
	},
	2: {
		open: { h: 7, m: 30, _id: "abhdbhsbkdnasnjndka" },
		close: { h: 18, m: 0, _id: "abhdbhsbkdnasnjndka" },
		canDeliver: true,
	},
	3: {
		open: { h: 7, m: 30, _id: "abhdbhsbkdnasnjndka" },
		close: { h: 18, m: 0, _id: "abhdbhsbkdnasnjndka" },
		canDeliver: true,
	},
	4: {
		open: { h: 7, m: 30, _id: "abhdbhsbkdnasnjndka" },
		close: { h: 18, m: 0, _id: "abhdbhsbkdnasnjndka" },
		canDeliver: true,
	},
	5: {
		open: { h: 7, m: 30, _id: "abhdbhsbkdnasnjndka" },
		close: { h: 18, m: 0, _id: "abhdbhsbkdnasnjndka" },
		canDeliver: true,
	},
	6: {
		open: { h: 10, m: 0, _id: "abhdbhsbkdnasnjndka" },
		close: { h: 17, m: 30, _id: "abhdbhsbkdnasnjndka" },
		canDeliver: true,
	},
};*/

const onIcon = <div className='switch-icon'>On</div>;

const offIcon = <div className='switch-icon'>Off</div>;

const DeliveryTimes = () => {
	const dispatch = useDispatch();
	const { email, deliveryHours } = useSelector(state => state['currentUser'].user);
	const [message, setMessage] = useState('');

	/*const parsedDeliveryHours = useMemo(() => {
		let hours = Object.assign({}, deliveryHours);
		Object.entries(deliveryHours).forEach(([key, value]) => {
			const { open, close, canDeliver } = value;
			hours[key] = {
				canDeliver,
				open: moment(open).format('HH:mm'),
				close: moment(close).format('HH:mm'),
			};
		});
		return hours;
	}, []);*/

	useEffect(() => {
		console.log(deliveryHours);
	}, []);

	return (
		<div className='bg-light delivery-times py-4 d-flex justify-content-center'>
			<div className='bg-white border border-2 times-wrapper h-100 py-3'>
				<div className='d-flex flex-column align-items-center mt-2 mb-4'>
					<h1 className='fs-2'>Set Times</h1>
					<span>Let us know the times you want to provide Same Day Delivery</span>
				</div>
				<Formik
					enableReinitialize
					initialValues={deliveryHours}
					onSubmit={values => {
						console.log(values);
						dispatch(updateDeliveryTimes(email, values))
							.then(message => setMessage(message))
							.catch(err => dispatch(addError(err.message)));
					}}
				>
					{({ values, handleBlur, handleSubmit, setFieldValue }) => (
						<form className='table-responsive px-3' onSubmit={handleSubmit}>
							<table className='table table-borderless align-middle'>
								<thead>
									<tr>
										<th scope='col' className='col-1' />
										<th scope='col' className='col-1' />
										<th scope='col' className='col-4'>
											From
										</th>
										<th scope='col' className='col-4'>
											To
										</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<th scope='row'>Monday</th>
										<td>
											<label>
												<Switch
													onColor={'#9FEA86'}
													checkedIcon={onIcon}
													uncheckedIcon={offIcon}
													onChange={() =>
														setFieldValue('1.canDeliver', !values[1].canDeliver)
													}
													handleDiameter={20}
													checked={values[1].canDeliver}
												/>
											</label>
										</td>
										<td>
											<input
												disabled={!values[1].canDeliver}
												defaultValue={moment(values[1].open).format('HH:mm')}
												name='1.open'
												id='monday-open-time'
												type='time'
												className='form-control form-border rounded-3'
												aria-label='monday-open-time'
												onChange={({ target: { value } }) =>
													setFieldValue('1.open', {
														h: Number(value.split(':')[0]),
														m: Number(value.split(':')[1]),
													})
												}
												onBlur={handleBlur}
											/>
										</td>
										<td>
											<input
												disabled={!values[1].canDeliver}
												defaultValue={moment(values[1].close).format('HH:mm')}
												name='1.close'
												type='time'
												className='form-control form-border rounded-3'
												aria-label='pickup-datetime'
												onChange={({ target: { value } }) =>
													setFieldValue('1.close', {
														h: Number(value.split(':')[0]),
														m: Number(value.split(':')[1]),
													})
												}
												onBlur={handleBlur}
											/>
										</td>
									</tr>
									<tr>
										<th scope='row'>Tuesday</th>
										<td>
											<label>
												<Switch
													onColor={'#9FEA86'}
													checkedIcon={onIcon}
													uncheckedIcon={offIcon}
													onChange={() =>
														setFieldValue('2.canDeliver', !values[2].canDeliver)
													}
													handleDiameter={20}
													checked={values[2].canDeliver}
												/>
											</label>
										</td>
										<td>
											<input
												disabled={!values[2].canDeliver}
												defaultValue={moment(values[2].open).format('HH:mm')}
												name='2.open'
												type='time'
												className='form-control form-border rounded-3'
												aria-label='pickup-datetime'
												onChange={({ target: { value } }) =>
													setFieldValue('2.open', {
														h: Number(value.split(':')[0]),
														m: Number(value.split(':')[1]),
													})
												}
												onBlur={handleBlur}
											/>
										</td>
										<td>
											<input
												disabled={!values[2].canDeliver}
												defaultValue={moment(values[2].close).format('HH:mm')}
												name='2.close'
												type='time'
												className='form-control form-border rounded-3'
												aria-label='pickup-datetime'
												onChange={({ target: { value } }) =>
													setFieldValue('2.close', {
														h: Number(value.split(':')[0]),
														m: Number(value.split(':')[1]),
													})
												}
												onBlur={handleBlur}
											/>
										</td>
									</tr>
									<tr>
										<th scope='row'>Wednesday</th>
										<td>
											<label>
												<Switch
													onColor={'#9FEA86'}
													checkedIcon={onIcon}
													uncheckedIcon={offIcon}
													onChange={() =>
														setFieldValue('3.canDeliver', !values[3].canDeliver)
													}
													handleDiameter={20}
													checked={values[3].canDeliver}
												/>
											</label>
										</td>
										<td>
											<input
												disabled={!values[3].canDeliver}
												defaultValue={moment(values[3].open).format('HH:mm')}
												name='3.open'
												type='time'
												className='form-control form-border rounded-3'
												aria-label='3-open-time'
												onChange={({ target: { value } }) =>
													setFieldValue('3.open', {
														h: Number(value.split(':')[0]),
														m: Number(value.split(':')[1]),
													})
												}
												onBlur={handleBlur}
											/>
										</td>
										<td>
											<input
												disabled={!values[3].canDeliver}
												defaultValue={moment(values[3].close).format('HH:mm')}
												name='3.close'
												type='time'
												className='form-control form-border rounded-3'
												aria-label='3-close-time'
												onChange={({ target: { value } }) =>
													setFieldValue('3.close', {
														h: Number(value.split(':')[0]),
														m: Number(value.split(':')[1]),
													})
												}
												onBlur={handleBlur}
											/>
										</td>
									</tr>
									<tr>
										<th scope='row'>Thursday</th>
										<td>
											<label>
												<Switch
													onColor={'#9FEA86'}
													checkedIcon={onIcon}
													uncheckedIcon={offIcon}
													onChange={() =>
														setFieldValue('4.canDeliver', !values[4].canDeliver)
													}
													handleDiameter={20}
													checked={values[4].canDeliver}
												/>
											</label>
										</td>
										<td>
											<input
												disabled={!values[4].canDeliver}
												defaultValue={moment(values[4].open).format('HH:mm')}
												name='4.open'
												type='time'
												className='form-control form-border rounded-3'
												aria-label='pickup-datetime'
												onChange={({ target: { value } }) =>
													setFieldValue('4.open', {
														h: Number(value.split(':')[0]),
														m: Number(value.split(':')[1]),
													})
												}
												onBlur={handleBlur}
											/>
										</td>
										<td>
											<input
												disabled={!values[4].canDeliver}
												defaultValue={moment(values[4].close).format('HH:mm')}
												name='4.close'
												type='time'
												className='form-control form-border rounded-3'
												aria-label='pickup-datetime'
												onChange={({ target: { value } }) =>
													setFieldValue('4.close', {
														h: Number(value.split(':')[0]),
														m: Number(value.split(':')[1]),
													})
												}
												onBlur={handleBlur}
											/>
										</td>
									</tr>
									<tr>
										<th scope='row'>Friday</th>
										<td>
											<label>
												<Switch
													onColor={'#9FEA86'}
													checkedIcon={onIcon}
													uncheckedIcon={offIcon}
													onChange={() =>
														setFieldValue('5.canDeliver', !values[5].canDeliver)
													}
													handleDiameter={20}
													checked={values[5].canDeliver}
												/>
											</label>
										</td>
										<td>
											<input
												disabled={!values[5].canDeliver}
												defaultValue={moment(values[5].open).format('HH:mm')}
												name='5.open'
												type='time'
												className='form-control form-border rounded-3'
												aria-label='pickup-datetime'
												onChange={({ target: { value } }) =>
													setFieldValue('5.open', {
														h: Number(value.split(':')[0]),
														m: Number(value.split(':')[1]),
													})
												}
												onBlur={handleBlur}
											/>
										</td>
										<td>
											<input
												disabled={!values[5].canDeliver}
												defaultValue={moment(values[5].close).format('HH:mm')}
												name='5.close'
												type='time'
												className='form-control form-border rounded-3'
												aria-label='pickup-datetime'
												onChange={({ target: { value } }) =>
													setFieldValue('5.close', {
														h: Number(value.split(':')[0]),
														m: Number(value.split(':')[1]),
													})
												}
												onBlur={handleBlur}
											/>
										</td>
									</tr>
									<tr>
										<th scope='row'>Saturday</th>
										<td>
											<label>
												<Switch
													onColor={'#9FEA86'}
													checkedIcon={onIcon}
													uncheckedIcon={offIcon}
													onChange={() =>
														setFieldValue('6.canDeliver', !values[6].canDeliver)
													}
													handleDiameter={20}
													checked={values[6].canDeliver}
												/>
											</label>
										</td>
										<td>
											<input
												disabled={!values[6].canDeliver}
												defaultValue={moment(values[6].open).format('HH:mm')}
												name='6.open'
												type='time'
												className='form-control form-border rounded-3'
												aria-label='pickup-datetime'
												onChange={({ target: { value } }) =>
													setFieldValue('6.open', {
														h: Number(value.split(':')[0]),
														m: Number(value.split(':')[1]),
													})
												}
												onBlur={handleBlur}
											/>
										</td>
										<td>
											<input
												disabled={!values[6].canDeliver}
												defaultValue={moment(values[6].close).format('HH:mm')}
												name='6.close'
												type='time'
												className='form-control form-border rounded-3'
												aria-label='pickup-datetime'
												onChange={({ target: { value } }) =>
													setFieldValue('6.close', {
														h: Number(value.split(':')[0]),
														m: Number(value.split(':')[1]),
													})
												}
												onBlur={handleBlur}
											/>
										</td>
									</tr>
									<tr>
										<th scope='row'>Sunday</th>
										<td>
											<label>
												<Switch
													onColor={'#9FEA86'}
													checkedIcon={onIcon}
													uncheckedIcon={offIcon}
													onChange={() =>
														setFieldValue('0.canDeliver', !values[0].canDeliver)
													}
													handleDiameter={20}
													checked={values[0].canDeliver}
												/>
											</label>
										</td>
										<td>
											<input
												disabled={!values[0].canDeliver}
												defaultValue={moment(values[0].open).format('HH:mm')}
												name='0.open'
												type='time'
												className='form-control form-border rounded-3'
												aria-label='pickup-datetime'
												onChange={({ target: { value } }) =>
													setFieldValue('0.open', {
														h: Number(value.split(':')[0]),
														m: Number(value.split(':')[1]),
													})
												}
												onBlur={handleBlur}
											/>
										</td>
										<td>
											<input
												disabled={!values[0].canDeliver}
												defaultValue={moment(values[0].close).format('HH:mm')}
												name='0.open'
												id='pickup-datetime'
												type='time'
												className='form-control form-border rounded-3'
												aria-label='pickup-datetime'
												onChange={({ target: { value } }) =>
													setFieldValue('0.close', {
														h: Number(value.split(':')[0]),
														m: Number(value.split(':')[1]),
													})
												}
												onBlur={handleBlur}
											/>
										</td>
									</tr>
								</tbody>
							</table>
							<div className='d-flex justify-content-center'>
								<button className='btn btn-primary btn-lg w-25' type='submit'>
									Save
								</button>
							</div>
						</form>
					)}
				</Formik>
			</div>
		</div>
	);
};

export default DeliveryTimes;
