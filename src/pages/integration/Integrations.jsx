import './integrations.css';
import React, { useEffect, useState } from 'react';
import secondsLogo from '../../img/logo.svg';
import shopifyLogo from '../../img/shopify.svg';
import { PATHS } from '../../constants';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import plug from '../../img/apikey.svg';
import { Mixpanel } from '../../config/mixpanel';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ToastFade from 'react-bootstrap/Toast';

export default function Integrations(props) {
	const { apiKey } = useSelector(state => state['currentUser'].user);
	const [toastMessage, setShowToast] = useState("")

	const ApiLinkBtn = classnames({
		'col-sm-12': true,
		'col-md-12': true,
		'col-lg-6': true,
		'button-wrapper': true,
		'text-decoration-none': true,
		'my-3': true,
		'flex-column': true,
	});

	const ShopifyLinkBtn = classnames({
		'col-sm-12': true,
		'col-md-6': true,
		'col-lg-6': true,
		'button-wrapper': true,
		'text-decoration-none': true,
		'my-3': true
	});

	useEffect(() => {
		Mixpanel.people.increment('page_views');
	}, []);

	const apiKeyToast = (
		<ToastContainer className='topRight'>
			<ToastFade onClose={() => setShowToast("")} show={!!toastMessage} animation={'true'} delay={3000}
			           autohide>
				<ToastFade.Header closeButton={false}>
					<img
						src={secondsLogo}
						className='rounded me-2'
						alt=''
					/>
					<strong className='me-auto'>Seconds</strong>
				</ToastFade.Header>
				<ToastFade.Body>{toastMessage}</ToastFade.Body>
			</ToastFade>
		</ToastContainer>
	);

	return (
		<div className='integrations bg-light p-4'>
			<div className='w-100 row'>
				<div className='col-12 mb-5'>
					<h3 className='integrations-header text-center'>Integration</h3>
				</div>
				{apiKeyToast}
				<div role='button' className={ApiLinkBtn} onClick={() => props.history.push(PATHS.API_KEY)}>
					<div className='d-flex flex-column w-75 justify-content-center align-items-center bg-white api-wrapper border'>
						<span className='key-text text-center'>
							<img src={plug} alt='' />
						</span>
						<span className='api-text text-center'>API Key</span>
					</div>
				</div>
				<div
					onClick={() =>
						!apiKey
							? setShowToast('Please generate an API key before integrating your shopify store')
							: props.history.push(PATHS.SHOPIFY)
					}
					role='button'
					className={ShopifyLinkBtn}
				>
					<div className='d-flex w-75 justify-content-center align-items-center bg-white api-wrapper border'>
						<img className='img-fluid' width={250} src={shopifyLogo} alt='shopify logo' />
					</div>
				</div>
			</div>
		</div>
	);
}
