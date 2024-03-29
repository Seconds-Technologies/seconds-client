import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import CourierPanel from '../../components/CourierPanel';
import { PROVIDERS } from '../../constants';
import stuart from '../../assets/img/stuart.svg';
import { updateFleetProviders } from '../../store/actions/settings';
import { capitalize } from '../../helpers';
import { useDispatch, useSelector } from 'react-redux';
import SuccessToast from '../../modals/SuccessToast';
import streetStream from '../../assets/img/street-stream.svg';

const StreetStream = props => {
	const dispatch = useDispatch();
	const { email } = useSelector(state => state['currentUser'].user)
	const { activeFleetProviders } = useSelector(state => state['settingsStore']);
	const [successMessage, setSuccess] = useState('')

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
			<SuccessToast message={successMessage} toggleShow={setSuccess}/>
			<div className='d-flex flex-grow justify-content-center' style={{width: 500}}>
				<div className='text-decoration-none my-2' />
				<CourierPanel
					id={PROVIDERS.STREET_STREAM}
					name='Street Stream'
					img={streetStream}
					description='Street Stream are a London based Same-Day courier Service.'
					link='https://streetstream.co.uk'
					linkText='streetstream.co.uk'
					locations='London'
					services='Service Level: Same-Day On-demand and Scheduled delivery'
					vehicles='Bicycle, Motorcycle, Cargobike, Car and Van'
					toggle={toggleProvider}
				/>
			</div>
		</div>
	);
};

StreetStream.propTypes = {};

export default StreetStream;
