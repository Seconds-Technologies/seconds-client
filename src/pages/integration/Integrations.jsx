import './integrations.css';
import React, { useEffect, useState } from 'react';
import shopifyLogo from '../../assets/img/shopify.svg';
import weeblyLogo from '../../assets/img/weebly-vector-logo.svg';
import woocommerceLogo from '../../assets/img/woocommerce-logo.svg'
import squarespaceLogo from '../../assets/img/squarespace-logo.svg'
import { PATHS } from '../../constants';
import classnames from 'classnames';
import { Mixpanel } from '../../config/mixpanel';
import ComingSoon from '../../modals/ComingSoon';

export default function Integrations(props) {
	const [toastMessage, setShowToast] = useState('');

	const ShopifyLinkBtn = classnames({
		'col-sm-12': true,
		'col-md-6': true,
		'text-decoration-none': true,
		'my-2': true,
	});

	useEffect(() => {
		Mixpanel.people.increment('page_views');
	}, []);

	return (
		<div className='integrations container-fluid bg-light p-4'>
			<h3 className='integrations-header text-center mb-4'>Integration</h3>
			<ComingSoon message={toastMessage} toggleMessage={setShowToast}/>
			<div className='container'>
				<div className='row d-flex justify-content-center'>
					<div
						onClick={() => props.history.push(PATHS.SHOPIFY)}
						role='button'
						className={ShopifyLinkBtn}
					>
						<div className='d-flex justify-content-center align-items-center bg-white h-100 border p-4 api-wrapper'>
							<img className='img-fluid' width={200} height={150} src={shopifyLogo} alt='shopify logo' />
						</div>
					</div>
					<div
						onClick={() => setShowToast("This feature is coming soon 😄")}
						role='button'
						className={ShopifyLinkBtn}
					>
						<div className='d-flex justify-content-center align-items-center bg-white h-100 border p-1 api-wrapper'>
							<img className='img-fluid' width={250} src={weeblyLogo} alt='square logo' />
						</div>
					</div>
					<div
						onClick={() => props.history.push(PATHS.WOOCOMMERCE)}
						role='button'
						className={ShopifyLinkBtn}
					>
						<div className='d-flex justify-content-center align-items-center bg-white h-100 border p-1 api-wrapper'>
							<img className='img-fluid' width={200} src={woocommerceLogo} alt='square logo' />
						</div>
					</div>
					<div
						onClick={() => setShowToast("This feature is coming soon 😄")}
						role='button'
						className={ShopifyLinkBtn}
					>
						<div className='d-flex justify-content-center align-items-center bg-white h-100 border p-1 api-wrapper'>
							<img className='img-fluid' width={300} src={squarespaceLogo} alt='square logo' />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
