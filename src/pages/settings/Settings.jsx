import React from 'react';
import './settings.css';
import { PATHS } from '../../constants';
import support from '../../img/support.svg';
import profile from '../../img/profile.svg';
import card from '../../img/bank_card.svg';

const Settings = props => {
	return (
		<div className='settings bg-light d-flex flex-column justify-content-center align-items-center'>
			<div
				className='row bg-white mt-3 mb-4 option-container border'
				onClick={() => props.history.push(PATHS.HELP)}
			>
				<div className='d-flex justify-content-center'>
					<img src={support} alt='' className='img-fluid mx-4' width={50} height={50} />
					<div className='text-center h1'>Customer Support</div>
				</div>
			</div>
			<div
				className='row bg-white my-4 option-container border'
				onClick={() => props.history.push(PATHS.PROFILE)}
			>
				<div className='d-flex justify-content-center'>
					<img src={profile} alt='' className='img-fluid me-5' width={50} height={50} />
					<div className='text-center h1 ms-2'>Profile Settings</div>
				</div>
			</div>
			<div
				className='row bg-white mt-4 mb-3 option-container border'
				onClick={() => props.history.push(PATHS.PAYMENT)}
			>
				<div className='d-flex justify-content-center'>
					<img src={card} alt='' className='img-fluid mx-4' width={50} height={50} />
					<div className='text-center h1'>Manage Payments</div>
				</div>
			</div>
		</div>
	);
};

export default Settings;
