import React from 'react';
import './settings.css';
import { PATHS } from '../../constants';

const Settings = props => {
	return (
		<div className='settings d-flex flex-column justify-content-center align-items-center'>
			<div className='row bg-white mt-3 mb-4 option-container' onClick={() => props.history.push(PATHS.HELP)}>
				<div className="text-center h1">😃 Customer Support</div>
			</div>
			<div className='row bg-white my-4 option-container' onClick={() => props.history.push(PATHS.PROFILE)}>
				<div className="text-center h1">👤 Profile Settings</div>
			</div>
			<div className='row bg-white mt-4 mb-3 option-container'>
				<div className="text-center h1">💳 Payment Method</div>
			</div>
		</div>
	);
};

export default Settings;
