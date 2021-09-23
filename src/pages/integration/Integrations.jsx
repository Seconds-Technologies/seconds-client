import React from 'react';
import shopifyLogo from '../../img/shopify.svg';
import './integrations.css';
import { Link } from 'react-router-dom';
import { PATHS } from '../../constants';
import classnames from 'classnames';
import { useSelector } from 'react-redux';

export default function Integrations() {
	const { isIntegrated } = useSelector(state => state['shopifyStore']);
	const { apiKey } = useSelector(state => state['currentUser'].user);

	const ApiLinkBtn = classnames({
		'col-sm-12': true,
		'col-md-12': true,
		'col-lg-6': true,
		'button-wrapper': true,
		'text-decoration-none': true,
		'my-3': true,
		'link-disabled': isIntegrated,
	});

	const ShopifyLinkBtn = classnames({
		'col-sm-12': true,
		'col-md-12': true,
		'col-lg-6': true,
		'button-wrapper': true,
		'text-decoration-none': true,
		'my-3': true,
		'link-disabled': Boolean(apiKey),
	});

	return (
		<div className='integrations container'>
			<h3 className='integrations-header'>Connect your Platform</h3>
			<div className='d-flex flex-1 h-75 flex-column align-items-center justify-content-center'>
				<div className='row w-100'>
					<Link to={PATHS.API_KEY} role='button' className={ApiLinkBtn}>
						<div className='d-flex flex-column w-75 justify-content-center align-items-center bg-white api-wrapper'>
							<span className='key-text text-center'>🔑</span>
							<span className='api-text text-center'>API KEY</span>
						</div>
					</Link>
					<Link to={PATHS.SHOPIFY} role='button' className={ShopifyLinkBtn}>
						<div className='d-flex w-75 justify-content-center align-items-center bg-white api-wrapper'>
							<img className='img-fluid' width={250} src={shopifyLogo} alt='shopify logo' />
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}
