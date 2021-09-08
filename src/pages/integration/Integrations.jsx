import React, { useState } from 'react';
import shopifyLogo from '../../img/shopify.svg';
import Shopify from '../../components/Shopify/Shopify';
import './integrations.css';

export default function Integrations() {
	const [showShopify, setShopify] = useState(false);
	return (
		<div className='integrations container d-flex align-items-center justify-content-center'>
			{showShopify ? <Shopify goBack={() => setShopify(false)} /> : (
				<div className='row w-100'>
					<a role='button' className='col-sm-12 col-md-12 col-lg-6 button-wrapper my-3'
					   href='http://localhost:61112/swaggerui.html?project=e800128b&filename=C:/Users/chiso/Desktop/seconds-api/doc.json&renderer=0'>
						<div className='d-flex w-75 justify-content-center align-items-center bg-white api-wrapper'>
							<span className='api-text'>API</span>
						</div>
					</a>
					<div role='button' className='col-sm-12 col-md-12 col-lg-6 button-wrapper my-3'
					     onClick={() => setShopify(true)}>
						<div className='d-flex w-75 justify-content-center align-items-center bg-white api-wrapper'>
							<img className='img-fluid' width={250} src={shopifyLogo} alt='shopify logo' />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
