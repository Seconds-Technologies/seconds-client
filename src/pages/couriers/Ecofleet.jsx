import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import CourierPanel from '../settings/containers/couriers/components/CourierPanel';
import { PROVIDERS } from '../../constants';
import stuart from '../../assets/img/stuart.svg';
import { updateFleetProviders } from '../../store/actions/settings';
import { capitalize } from '../../helpers';
import { useDispatch, useSelector } from 'react-redux';
import SuccessToast from '../../modals/SuccessToast';
import ecofleet from '../../assets/img/ecofleet.svg';

const Ecofleet = props => {
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
					id={PROVIDERS.ECOFLEET}
					name='Ecofleet'
					img={ecofleet}
					description='Carbon-neutral electric bikes offering a last-mile delivery service in London. '
					link='https://ecofleet.co.uk'
					linkText='ecofleet.co.uk'
					locations='London'
					services='Service Level: Scheduled delivery'
					vehicles='Cargobike'
					toggle={toggleProvider}
				/>
			</div>
		</div>
	);
};

Ecofleet.propTypes = {};

export default Ecofleet;
