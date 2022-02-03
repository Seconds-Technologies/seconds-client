import './settings.css';
import React, { useEffect } from 'react';
import { PATHS } from '../../constants';
import support from '../../assets/img/support.svg';
import profile from '../../assets/img/profile.svg';
import card from '../../assets/img/bank_card.svg';
import clock from '../../assets/img/clock.svg';
import { Mixpanel } from '../../config/mixpanel';
import codeIcon from '../../assets/img/developer.svg';

const Settings = props => {
	useEffect(() => {
		Mixpanel.people.increment("page_views")
	}, []);

	return (
		<div className='page-container bg-light d-flex flex-column justify-content-center align-items-center py-3'>
			<div
				className='row bg-white mt-3 mb-3 option-container border'
				onClick={() => props.history.push(PATHS.HELP)}
			>
				<div className='d-flex justify-content-center'>
					<img src={support} alt='' className='img-fluid mx-4' width={50} height={50} />
					<div className='text-center h1'>Customer Support</div>
				</div>
			</div>
			<div
				className='row bg-white my-3 mb-3 option-container border'
				onClick={() => props.history.push(PATHS.PROFILE)}
			>
				<div className='d-flex justify-content-center'>
					<img src={profile} alt='' className='img-fluid me-5' width={50} height={50} />
					<div className='text-center h1 ms-2'>Profile Settings</div>
				</div>
			</div>
			<div
				className='row bg-white my-3 mb-3 option-container border'
				onClick={() => props.history.push(PATHS.PAYMENT)}
			>
				<div className='d-flex justify-content-center'>
					<img src={card} alt='' className='img-fluid mx-4' width={50} height={50} />
					<div className='text-center h1'>Manage Payments</div>
				</div>
			</div>
			<div
				className='row bg-white mt-3 mb-3 option-container border'
				onClick={() => props.history.push(PATHS.DELIVERY_TIMES)}
			>
				<div className='d-flex justify-content-center'>
					<img src={clock} alt='' className='img-fluid mx-4' width={50} height={50} />
					<div className='text-center h1'>Set Delivery Times</div>
				</div>
			</div>
			<a
				href='https://docs.useseconds.com'
				target='_blank'
				className='row bg-white mt-3 mb-3 option-container border text-decoration-none text-dark'
			>
				<div className='d-flex justify-content-center'>
					<img className="img-fluid mx-4" src={codeIcon} width={50} height={50} alt={''} />
					<div className='text-center h1'>Developers</div>
				</div>
			</a>
		</div>
	);
};

export default Settings;
