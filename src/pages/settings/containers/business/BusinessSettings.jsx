import './workflows.css';
import React, { useState } from 'react';
import DeliveryTimes from '../deliveryTimes/DeliveryTimes';
import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { updateBusinessWorkflow } from '../../../../store/actions/settings';
import SuccessToast from '../../../../modals/SuccessToast';

const BusinessSettings = props => {
	const dispatch = useDispatch();
	const [showModal, setShowModal] = useState(false);
	const [message, setMessage] = useState('');
	const { email } = useSelector(state => state['currentUser'].user);
	const { driverDeliveryFee, dispatchSupportTeam } = useSelector(state => state['settingsStore']);

	return (
		<div className='tab-container px-3'>
			<SuccessToast toggleShow={setMessage} message={message} delay={2000} position={'bottomRight'} />
			<DeliveryTimes show={showModal} onHide={() => setShowModal(false)} />
			<Formik
				enableReinitialize
				initialValues={{
					driverDeliveryFee,
					dispatchSupportTeam
				}}
				onSubmit={values => {
					console.log(values);
					values.dispatchSupportTeam = values.dispatchSupportTeam.split(",")
					dispatch(updateBusinessWorkflow(email, values)).then(message => setMessage(message));
				}}
			>
				{({ values, handleSubmit, handleChange, handleBlur, handleReset, setFieldValue }) => (
					<Form className='container-fluid'>
						<div className='row pb-4'>
							<div>
								<h1 className='workflow-header fs-4'>Set Delivery Time</h1>
								<p className='text-muted'> Update your opening times</p>
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
						<div className='row pb-4'>
							<h1 className='workflow-header fs-4'>Dispatch Support Team</h1>
							<p className='text-muted'>Use this setting to cc specific email addresses on every order dispatch</p>
							<div className="d-flex flex-column col-sm-12 col-md-4">
								<label htmlFor='' className="workflow-header fs-6 mb-1">Please enter a comma separated list</label>
								<input type='text' className="form-control rounded-3" name="dispatchSupportTeam"/>
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

BusinessSettings.propTypes = {};

export default BusinessSettings;
