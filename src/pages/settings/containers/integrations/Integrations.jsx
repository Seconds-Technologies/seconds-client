import './integrations.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
// svg
import magentoLogo from '../../../../assets/img/magento-vector-logo.svg';
import flipdishLogo from '../../../../assets/img/flipdish.svg';
import squareLogo from '../../../../assets/img/square.svg';
import deliverooLogo from '../../../../assets/img/deliveroo.svg';
import justEatLogo from '../../../../assets/img/just-eat.svg';
import uberEatsLogo from '../../../../assets/img/uber-eats.svg';
import classnames from 'classnames';
import { Mixpanel } from '../../../../config/mixpanel';
import { removeError } from '../../../../store/actions/errors';
import { useDispatch, useSelector } from 'react-redux';
import { capitalize } from '../../../../helpers';
import Chip from '@mui/material/Chip';
// modals
import { updateFleetProviders, updateIntegrationStatus } from '../../../../store/actions/settings';
import SuccessToast from '../../../../modals/SuccessToast';
// components
import ShopifyPanel from './components/ShopifyPanel';
import WooCommercePanel from './components/WooCommercePanel';
import SquarespacePanel from './components/SquarespacePanel';
import HubrisePanel from './components/HubrisePanel';
import StuartPanel from './components/StuartPanel';
import GophrPanel from './components/GophrPanel';
import StreetStreamPanel from './components/StreetStreamPanel';
import EcofleetPanel from './components/EcofleetPanel';
import AddisonLeePanel from './components/AddisonLeePanel';

export default function Integrations(props) {
	const [successMessage, setSuccess] = useState('');
	const error = useSelector(state => state['errors']);
	const { email } = useSelector(state => state['currentUser'].user);
	const { activeFleetProviders } = useSelector(state => state['settingsStore']);
	const dispatch = useDispatch();
	const errorRef = useRef(null);

	const toggleIntegration = useCallback(payload => {
		dispatch(updateIntegrationStatus(email, payload)).then(() => {
			const message = `${capitalize(payload.platform)} integration is now ${payload.status ? 'enabled' : 'disabled'}`;
			setSuccess(message);
		});
	}, []);

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

	const IntegrationLinkBtn = classnames({
		'col-sm-12': true,
		'col-md-4': true,
		'text-decoration-none': true,
		'my-2': true
	});

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		dispatch(removeError());
	}, [props.location]);

	return (
		<div ref={errorRef} className='tab-container container-fluid py-3 px-4'>
			<SuccessToast message={successMessage} toggleShow={setSuccess} />
			<div className='container'>
				<div className='row'>
					<div role='button' className={IntegrationLinkBtn}>
						<div className='d-flex justify-content-end position-absolute p-3'>
							<Chip
								label='Coming Soon'
								sx={{
									backgroundColor: '#DDF8D3',
									color: '#05CC79',
									fontWeight: 'bold'
								}}
							/>
						</div>
						<div className='d-flex flex-column justify-content-center align-items-center bg-white h-100 border p-1 api-wrapper'>
							<img className='img-fluid' width={300} src={squareLogo} alt='square logo' />
						</div>
					</div>
					<ShopifyPanel wrapper={IntegrationLinkBtn} toggle={toggleIntegration} />
					<div role='button' className={IntegrationLinkBtn}>
						<div className='d-flex justify-content-end position-absolute p-3'>
							<Chip
								label='Coming Soon'
								sx={{
									backgroundColor: '#DDF8D3',
									color: '#05CC79',
									fontWeight: 'bold'
								}}
							/>
						</div>
						<div className='d-flex justify-content-center align-items-center bg-white h-100 border p-4 api-wrapper'>
							<img className='img-fluid' width={200} src={flipdishLogo} alt='shopify logo' />
						</div>
					</div>
					<div role='button' className={IntegrationLinkBtn}>
						<div className='d-flex justify-content-end position-absolute p-3'>
							<Chip
								label='Coming Soon'
								sx={{
									backgroundColor: '#DDF8D3',
									color: '#05CC79',
									fontWeight: 'bold'
								}}
							/>
						</div>
						<div className='d-flex justify-content-center align-items-center bg-white h-100 border p-1 api-wrapper'>
							<img className='img-fluid' width={250} src={magentoLogo} alt='magento logo' />
						</div>
					</div>
					<WooCommercePanel wrapper={IntegrationLinkBtn} toggle={toggleIntegration} />
					<SquarespacePanel wrapper={IntegrationLinkBtn} toggle={toggleIntegration} />
					<HubrisePanel wrapper={IntegrationLinkBtn} toggle={toggleIntegration} />
					<div role='button' className={IntegrationLinkBtn}>
						<div className='d-flex justify-content-end position-absolute p-3'>
							<Chip
								label='Coming Soon'
								sx={{
									backgroundColor: '#DDF8D3',
									color: '#05CC79',
									fontWeight: 'bold'
								}}
							/>
						</div>
						<div className='d-flex justify-content-center align-items-center bg-white h-100 border p-1 api-wrapper'>
							<img className='img-fluid' width={250} src={deliverooLogo} alt='magento logo' />
						</div>
					</div>
					<div role='button' className={IntegrationLinkBtn}>
						<div className='d-flex justify-content-end position-absolute p-3'>
							<Chip
								label='Coming Soon'
								sx={{
									backgroundColor: '#DDF8D3',
									color: '#05CC79',
									fontWeight: 'bold'
								}}
							/>
						</div>
						<div className='d-flex justify-content-center align-items-center bg-white h-100 border p-1 api-wrapper'>
							<img className='img-fluid' width={250} src={uberEatsLogo} alt='magento logo' />
						</div>
					</div>
					<div role='button' className={IntegrationLinkBtn} style={{ height: 250 }}>
						<div className='d-flex justify-content-end position-absolute p-3'>
							<Chip
								label='Coming Soon'
								sx={{
									backgroundColor: '#DDF8D3',
									color: '#05CC79',
									fontWeight: 'bold'
								}}
							/>
						</div>
						<div className='d-flex justify-content-center align-items-center bg-white h-100 border p-1 api-wrapper'>
							<img className='img-fluid' width={250} src={justEatLogo} alt='magento logo' />
						</div>
					</div>
					<StuartPanel wrapper={IntegrationLinkBtn} toggle={toggleProvider} />
					<GophrPanel wrapper={IntegrationLinkBtn} toggle={toggleProvider} />
					<StreetStreamPanel wrapper={IntegrationLinkBtn} toggle={toggleProvider} />
					<EcofleetPanel wrapper={IntegrationLinkBtn} toggle={toggleProvider} />
					<AddisonLeePanel wrapper={IntegrationLinkBtn} toggle={toggleProvider} />
				</div>
			</div>
		</div>
	);
}
