import React, { useState } from 'react';
import { updateBusinessWorkflow } from '../../../../store/actions/settings';
import { Form, Formik } from 'formik';
import Switch from 'react-switch';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { BsInfoCircle } from 'react-icons/bs';
import SuccessToast from '../../../../modals/SuccessToast';
import { useDispatch, useSelector } from 'react-redux';
import { offIcon, onIcon } from '../../../../constants/elements';

const Notifications = props => {
	const dispatch = useDispatch();
	const [message, setMessage] = useState('');
	const { email } = useSelector(state => state['currentUser'].user);
	const {
		sms,
		jobAlerts
	} = useSelector(state => state['settingsStore']);

	return (
		<div className="tab-container px-3">
			<SuccessToast toggleShow={setMessage} message={message} delay={2000} position={'bottomRight'} />
			<Formik
				enableReinitialize
				initialValues={{
					sms,
					jobAlerts
				}}
				onSubmit={values => {
					console.log(values);
					dispatch(updateBusinessWorkflow(email, values)).then(message => setMessage(message));
				}}
			>
				{({ values, handleSubmit, handleChange, handleBlur, handleReset, setFieldValue }) => (
					<Form className='container-fluid'>
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
									<Tooltip title='We charge £0.05 per sms notification' placement='right-start'>
										<IconButton size='small'>
											<BsInfoCircle />
										</IconButton>
									</Tooltip>
								</div>
							</div>
						</div>
						<div className='row pb-4'>
							<h1 className='workflow-header fs-4'>New Job Alerts</h1>
							<p className='text-muted'>Turn on emails for new delivery jobs</p>
							<div className='d-flex flex-grow-1 align-items-center'>
								<Switch
									onColor={'#9FEA86'}
									checkedIcon={onIcon}
									uncheckedIcon={offIcon}
									onChange={() => setFieldValue('jobAlerts.new', !values.jobAlerts.new)}
									handleDiameter={19}
									checked={values.jobAlerts.new}
									className='switch-text'
								/>
								<div className='d-flex align-items-center'>
									<span className='ms-3 me-2 workflow-header fs-6'>Email notification</span>
								</div>
							</div>
						</div>
						<div className='row pb-4'>
							<h1 className='workflow-header fs-4'>Cancelled Job Alerts</h1>
							<p className='text-muted'>Turn on emails for any job that has been canceled either by the store or delivery service provider</p>
							<div className='d-flex flex-grow-1 align-items-center'>
								<Switch
									onColor={'#9FEA86'}
									checkedIcon={onIcon}
									uncheckedIcon={offIcon}
									onChange={() => setFieldValue('jobAlerts.cancelled', !values.jobAlerts.cancelled)}
									handleDiameter={19}
									checked={values.jobAlerts.cancelled}
									className='switch-text'
								/>
								<div className='d-flex align-items-center'>
									<span className='ms-3 me-2 workflow-header fs-6'>Email notification</span>
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

Notifications.propTypes = {

};

export default Notifications;
