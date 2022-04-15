import './integrations.css';
import React, { useEffect, useState } from 'react';
import shopifyLogo from '../../assets/img/shopify.svg';
import magentoLogo from '../../assets/img/magento-vector-logo.svg';
import flipdishLogo from '../../assets/img/flipdish.svg';
import woocommerceLogo from '../../assets/img/woocommerce-logo.svg';
import squarespaceLogo from '../../assets/img/squarespace-logo.svg';
import squareLogo from '../../assets/img/square.svg';
import hubriseLogo from '../../assets/img/hubrise-logo.png';
import { PATHS } from '../../constants';
import classnames from 'classnames';
import { Mixpanel } from '../../config/mixpanel';
import ComingSoon from '../../modals/ComingSoon';
import { removeError } from '../../store/actions/errors';
import { useDispatch } from 'react-redux';
import Chip from '@mui/material/Chip';

export default function Integrations(props) {
	const dispatch = useDispatch();
	const [toastMessage, setShowToast] = useState('');

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
			<ComingSoon message={toastMessage} toggleMessage={setShowToast} />
			<div className='container'>
				<div className='row'>
					<div role='button' className={IntegrationLinkBtn}>
						<div className='d-flex justify-content-end position-absolute p-3'>
							<Chip label='Coming Soon' sx={{
								backgroundColor: "#DDF8D3",
								color: "#05CC79",
								fontWeight: "bold"
							}}/>
						</div>
						<div className='d-flex flex-column justify-content-center align-items-center bg-white h-100 border p-1 api-wrapper'>
							<img className='img-fluid' width={300} src={squareLogo} alt='square logo' />
						</div>
					</div>
					<div onClick={() => props.history.push(PATHS.SHOPIFY)} role='button' className={IntegrationLinkBtn}>
						<div className='d-flex justify-content-center align-items-center bg-white h-100 border p-5 api-wrapper'>
							<img className='img-fluid' width={150}  src={shopifyLogo} alt='shopify logo' />
						</div>
					</div>
					<div role='button' className={IntegrationLinkBtn}>
						<div className='d-flex justify-content-end position-absolute p-3'>
							<Chip label='Coming Soon' sx={{
								backgroundColor: "#DDF8D3",
								color: "#05CC79",
								fontWeight: "bold"
							}}/>
						</div>
						<div className='d-flex justify-content-center align-items-center bg-white h-100 border p-4 api-wrapper'>
							<img className='img-fluid' width={200} src={flipdishLogo} alt='shopify logo' />
						</div>
					</div>
					<div role='button' className={IntegrationLinkBtn}>
						<div className='d-flex justify-content-end position-absolute p-3'>
							<Chip label='Coming Soon' sx={{
								backgroundColor: "#DDF8D3",
								color: "#05CC79",
								fontWeight: "bold"
							}}/>
						</div>
						<div className='d-flex justify-content-center align-items-center bg-white h-100 border p-1 api-wrapper'>
							<img className='img-fluid' width={250} src={magentoLogo} alt='magento logo' />
						</div>
					</div>
					<div onClick={() => props.history.push(PATHS.WOOCOMMERCE)} role='button' className={IntegrationLinkBtn}>
						<div className='d-flex justify-content-center align-items-center bg-white h-100 border p-1 api-wrapper'>
							<img className='img-fluid' width={175} src={woocommerceLogo} alt='woocommerce logo' />
						</div>
					</div>
					<div onClick={() => props.history.push(PATHS.SQUARESPACE)} role='button' className={IntegrationLinkBtn}>
						<div className='d-flex justify-content-center align-items-center bg-white h-100 border p-1 api-wrapper'>
							<img className='img-fluid' width={250} src={squarespaceLogo} alt='squarespace logo' />
						</div>
					</div>
					<div onClick={() => props.history.push(PATHS.HUBRISE)} role='button' className={IntegrationLinkBtn}>
						<div className='d-flex justify-content-center align-items-center bg-white h-100 border p-5 api-wrapper'>
							<img className='img-fluid' width={300} src={hubriseLogo} alt='square logo' />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
