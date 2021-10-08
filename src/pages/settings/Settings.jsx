import React from 'react';
import './settings.css';
import { PATHS } from '../../constants';
import support from '../../img/support.svg';
import profile from '../../img/profile.svg';
import card from '../../img/bank_card.svg';

const Settings = props => {
	return (
		<div className='settings bg-light d-flex flex-column justify-content-center align-items-center'>
			<div className='row bg-white mt-3 mb-4 option-container border' onClick={() => props.history.push(PATHS.HELP)}>
				<div className="text-center h1"><img src={support} alt='' className="img-fluid mx-4" width={50} height={50} />Customer Support</div>
			</div>
			<div className='row bg-white my-4 option-container border' onClick={() => props.history.push(PATHS.PROFILE)}>
				<div className="text-center h1"><img src={profile} alt='' className="img-fluid mx-4" width={50} height={50} />Profile Settings</div>
			</div>
			<div className='row bg-white mt-4 mb-3 option-container border' onClick={() => props.history.push(PATHS.PAYMENT)}>
				<div className="text-center h1"><img src={card} alt='' className="img-fluid mx-4" width={50} height={50} />Manage Payments</div>
			</div>
		</div>
	);
};

export default Settings;
