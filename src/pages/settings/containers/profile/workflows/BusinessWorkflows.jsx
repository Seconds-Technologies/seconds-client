import './workflows.css';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PATHS } from '../../../../../constants';
import Switch from 'react-switch';

const onIcon = <div className='switch-icon'>On</div>;
const offIcon = <div className='switch-icon'>Off</div>;

const BusinessWorkflows = props => {
	const [sms, setSMS] = useState(false);
	const [autoDispatch, setAutoDispatch] = useState(false);
	const [onlineDispatch, setOnlineDispatch] = useState(false);

	return (
		<div className='tab-container container-fluid px-3'>
			<div className='row pb-4'>
				<div>
					<h1 className='workflow-header fs-4'>Set Delivery Time</h1>
					<p className='text-muted'>Let us know the times you want to provide Same Day Delivery</p>
					<div className=''>
						<button
							type='button'
							className='btn btn-outline-secondary btn-sm'
							style={{ width: 130 }}
							onClick={() => props.history.push(PATHS.DELIVERY_TIMES)}
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
						onChange={() => setSMS(!sms)}
						handleDiameter={19}
						checked={sms}
						className='switch-text'
					/>
					<span className='ms-3 workflow-header fs-6'>SMS notification</span>
				</div>
			</div>
			<div className='row pb-4 w-75'>
				<h1 className='workflow-header fs-4'>Auto dispatch</h1>
				<div className='d-flex my-2'>
					<Switch
						onColor={'#9FEA86'}
						checkedIcon={onIcon}
						uncheckedIcon={offIcon}
						onChange={() => setAutoDispatch(!autoDispatch)}
						handleDiameter={19}
						checked={autoDispatch}
					/>
					<div className='ms-3 d-flex flex-column flex-wrap'>
						<span className='workflow-header fs-6'>Auto-dispatching</span>
						<p className='text-muted'>
							Turning on this feature will automatically dispatch any incoming delivery request to the earliest available driver or a
							third-party courier
						</p>
						<div>
							<span>Assign to</span>
							<div className='input-group mb-3 w-75'>
								<label className='input-group-text' htmlFor='inputGroupSelect01'>
									Driver with
								</label>
								<select className='form-select' id='inputGroupSelect01'>
									<option selected>Choose...</option>
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
						onChange={() => setOnlineDispatch(!onlineDispatch)}
						handleDiameter={19}
						checked={onlineDispatch}
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
					<input type='number' min={0} max={60} className='form-control' aria-label='drivers response time' />
					<span className='input-group-text'>mins</span>
				</div>
			</div>
			<div className='row pb-4'>
				<h1 className='workflow-header fs-4'>Delivery Provider Preferences</h1>
				<p className='text-muted'>Communicate your selection criteria</p>
				<div>
					<div className='form-check'>
						<input className='form-check-input' type='radio' name='exampleRadios' id='exampleRadios1' value='option1' />
						<label className='form-check-label' htmlFor='exampleRadios1'>
							Lowest Price
						</label>
					</div>
					<div className='form-check'>
						<input className='form-check-input' type='radio' name='exampleRadios' id='exampleRadios2' value='option2' />
						<label className='form-check-label' htmlFor='exampleRadios2'>
							Fastest delivery time
						</label>
					</div>
					<div className='form-check'>
						<input className='form-check-input' type='radio' name='exampleRadios' id='exampleRadios3' value='option3' />
						<label className='form-check-label' htmlFor='exampleRadios3'>
							Highest courier rating
						</label>
					</div>
				</div>
			</div>
			<div className='row pb-4'>
				<h1 className='workflow-header fs-4'>Delivery fee</h1>
				<p className='text-muted'>How much do you charge your customers for delivery</p>
				<div>
					<label htmlFor='customRange2' className='form-label'>
						Price Range
					</label>
					<div className="d-flex w-50">
						<span className="px-4">£5</span>
						<input type='range' className='form-range' min={5} max={15} id='customRange2' />
						<span className="px-4">£15</span>
					</div>
				</div>
				<div className='input-group mt-4' style={{ width: 200 }}>
					<span className='input-group-text'>£</span>
					<input type='number' min={5} max={15} className='form-control' aria-label='Amount in pounds (with dot and two decimal places)' />
				</div>
			</div>
		</div>
	);
};

BusinessWorkflows.propTypes = {};

export default BusinessWorkflows;
