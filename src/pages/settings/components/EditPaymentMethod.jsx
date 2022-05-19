import React from 'react';
import PropTypes from 'prop-types';
import { updatePaymentMethod } from '../../../store/actions/stripe';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

const EditPaymentMethod = ({ onSuccess, paymentDetails, paymentMethod, cancel, updatePaymentDetails }) => {
	const { user } = useSelector(state => state['currentUser']);
	const dispatch = useDispatch();
	return (
		<div>
			<h1>Edit payment method</h1>
			<div>
				<div className='py-3'>
					<form
						onSubmit={e => {
							e.preventDefault();
							dispatch(
								updatePaymentMethod(user, {
									name: paymentDetails.name,
									month: paymentDetails.month,
									year: paymentDetails.year
								})
							).then(onSuccess)
						}}
					>
						<div className='row'>
							<div className='col'>
								<div className='form-group'>
									<label htmlFor='cardNumber' className='h5'>
										Payment method
									</label>
									<div className='mt-2'>
										<span className='text-capitalize fw-bold'>💳 {paymentMethod.brand}&nbsp;</span>
										ending in {paymentMethod.last4}
									</div>
								</div>
							</div>
							<div className='col'>
								<label htmlFor='card-holder-name' className='h5'>
									Cardholder Name
								</label>
								<input
									autoComplete='given-name'
									id='card-holder-name'
									name='CardHolderName'
									type='text'
									className='form-control rounded-3 mt-2'
									aria-label='card-holder-name'
									value={paymentDetails.name}
									onChange={e =>
										updatePaymentDetails(prevState => ({
											...prevState,
											name: e.target.value
										}))
									}
								/>
							</div>
							<div className='col'>
								<label htmlFor='expiryMM' className='h5'>
									Expiry Date
								</label>
								<div className='row mt-2'>
									<div className='col'>
										<select
											className='form-select'
											name='expiryMM'
											id='expiryMM'
											value={paymentDetails.month}
											onChange={e =>
												updatePaymentDetails(prevState => ({
													...prevState,
													month: e.target.value
												}))
											}
										>
											<option value='1'>Jan</option>
											<option value='2'>Feb</option>
											<option value='3'>Mar</option>
											<option value='4'>Apr</option>
											<option value='5'>May</option>
											<option value='6'>Jun</option>
											<option value='7'>Jul</option>
											<option value='8'>Aug</option>
											<option value='9'>Sep</option>
											<option value='10'>Oct</option>
											<option value='11'>Nov</option>
											<option value='12'>Dec</option>
										</select>
									</div>
									<div className='col'>
										<select
											className='form-select'
											name='expireYYYY'
											value={paymentDetails.year}
											onChange={e =>
												updatePaymentDetails(prevState => ({
													...prevState,
													year: e.target.value
												}))
											}
										>
											<option value={dayjs().format('YYYY')}>{dayjs().format('YYYY')}</option>
											<option value={dayjs().add(1, 'years').format('YYYY')}>{dayjs().add(1, 'years').format('YYYY')}</option>
											<option value={dayjs().add(2, 'years').format('YYYY')}>{dayjs().add(2, 'years').format('YYYY')}</option>
											<option value={dayjs().add(3, 'years').format('YYYY')}>{dayjs().add(3, 'years').format('YYYY')}</option>
											<option value={dayjs().add(4, 'years').format('YYYY')}>{dayjs().add(4, 'years').format('YYYY')}</option>
											<option value={dayjs().add(5, 'years').format('YYYY')}>{dayjs().add(5, 'years').format('YYYY')}</option>
											<option value={dayjs().add(6, 'years').format('YYYY')}>{dayjs().add(6, 'years').format('YYYY')}</option>
										</select>
									</div>
								</div>
							</div>
						</div>
						<div className='d-flex justify-content-end pt-5'>
							<button type="button" className='btn btn-secondary mx-3 rounded-3' style={{ width: '15%' }} onClick={cancel}>
								Cancel
							</button>
							<button className='btn btn-primary mx-3 rounded-3' type='submit' style={{ width: '15%' }}>
								Save
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

EditPaymentMethod.propTypes = {
	onSuccess: PropTypes.func.isRequired,
	paymentDetails: PropTypes.object,
	paymentMethod: PropTypes.object,
	cancel: PropTypes.func.isRequired,
	updatePaymentDetails: PropTypes.func.isRequired
};

export default EditPaymentMethod;
