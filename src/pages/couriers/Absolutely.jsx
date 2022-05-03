import React, { useCallback, useState } from 'react';
import CourierPanel from '../../components/CourierPanel';
import { PROVIDERS } from '../../constants';
import { updateFleetProviders } from '../../store/actions/settings';
import { capitalize } from '../../helpers';
import { useDispatch, useSelector } from 'react-redux';
import SuccessToast from '../../modals/SuccessToast';
import absolutely from '../../assets/img/absolutely-brand.svg';

const Absolutely = props => {
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
					id={PROVIDERS.ABSOLUTELY}
					name='Absolutely Couriers'
					img={absolutely}
					description="Absolutely provides a full range of services to meet the demands of London's diverse economy, including same day temperature-controlled courier services."
					link='https://absolutelycourier.com'
					linkText='absolutelycourier.com'
					locations='London'
					services='Service Level: Overnight, Temperature-Controlled'
					vehicles='Bicycle, Motorbike, Cargobike, Small Van and Large Van'
					toggle={toggleProvider}
					comingSoon={true}
				/>
			</div>
		</div>
	);
};

Absolutely.propTypes = {};

export default Absolutely;
