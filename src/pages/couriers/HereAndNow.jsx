import React, { useCallback, useState } from 'react';
import CourierPanel from '../../components/CourierPanel';
import { PROVIDERS } from '../../constants';
import { updateFleetProviders } from '../../store/actions/settings';
import { capitalize } from '../../helpers';
import { useDispatch, useSelector } from 'react-redux';
import SuccessToast from '../../modals/SuccessToast';
import here_now from '../../assets/img/herenow.png';

const AddisonLee = props => {
	const dispatch = useDispatch();
	const { email } = useSelector(state => state['currentUser'].user);
	const { activeFleetProviders } = useSelector(state => state['settingsStore']);
	const [successMessage, setSuccess] = useState('');

	const toggleProvider = useCallback(
		provider => {
			let data = { ...activeFleetProviders, ...provider };
			console.log(data);
			dispatch(updateFleetProviders(email, data)).then(() => {
				let providerId = Object.keys(provider)[0];
				let status = provider[providerId] ? 'enabled' : 'disabled';
				let message = `${capitalize(providerId)} is now ${status}`;
				console.log(message);
				setSuccess(message);
			});
		},
		[activeFleetProviders]
	);

	return (
		<div className='page-container container-fluid d-flex justify-content-center align-items-center'>
			<SuccessToast message={successMessage} toggleShow={setSuccess} />
			<div className='d-flex flex-grow justify-content-center' style={{width: 500}}>
				<div className='text-decoration-none my-2' />
				<CourierPanel
					id={PROVIDERS.HERE_NOW}
					name='Here and Now'
					img={here_now}
					description='Description: Here and Now is a commission-free delivery courier service.'
					link='https://here-now.co.uk'
					linkText='here-now.co.uk'
					locations='London'
					services='Same Day Delivery'
					vehicles='Bicycle'
					imgStyle={{ width: 75, height: 75 }}
					toggle={toggleProvider}
					comingSoon={true}
				/>
			</div>
		</div>
	);
};

AddisonLee.propTypes = {};

export default AddisonLee;
