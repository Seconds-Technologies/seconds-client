import './integrations.css';
import React, { useCallback, useEffect } from 'react';
import magentoLogo from '../../../../assets/img/magento-vector-logo.svg';
import flipdishLogo from '../../../../assets/img/flipdish.svg';
import squareLogo from '../../../../assets/img/square.svg';
import classnames from 'classnames';
import { Mixpanel } from '../../../../config/mixpanel';
import { removeError } from '../../../../store/actions/errors';
import { useDispatch, useSelector } from 'react-redux';
import Chip from '@mui/material/Chip';
import ShopifyPanel from './components/ShopifyPanel';
import WooCommercePanel from './components/WooCommercePanel';
import SquarespacePanel from './components/SquarespacePanel';
import HubrisePanel from './components/HubrisePanel';
import { updateIntegrationStatus } from '../../../../store/actions/settings';

export default function Integrations(props) {
	const { email } = useSelector(state => state['currentUser'].user);
	const dispatch = useDispatch();

	const toggleIntegration = useCallback(payload => {
		dispatch(updateIntegrationStatus(email, payload)).then(() =>
			alert(`Status for ${payload.platform} is now ${payload.status ? 'active' : 'inactive'}`)
		);
	}, []);

	const IntegrationLinkBtn = classnames({
		'col-sm-12': true,
		'col-md-4': true,
		'text-decoration-none': true,
		'my-2': true
	});

	useEffect(() => {
		console.log(props);
		Mixpanel.people.increment('page_views');
		dispatch(removeError());
	}, [props.location]);

	return (
		<div className='tab-container container-fluid py-3 px-4'>
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
				</div>
			</div>
		</div>
	);
}
