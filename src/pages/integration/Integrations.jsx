import React, { useState } from 'react';
import shopifyLogo from '../../img/shopify.svg';
import './integrations.css';
import { Link } from 'react-router-dom';
import { PATHS } from '../../constants';

export default function Integrations() {
	return (
		<div className='integrations container d-flex align-items-center justify-content-center'>
			<div className='row w-100'>
				<Link
					to={PATHS.API_KEY}
					role='button'
					className='col-sm-12 col-md-12 col-lg-6 button-wrapper text-decoration-none my-3'
				>
					<div className='d-flex w-75 justify-content-center align-items-center bg-white api-wrapper'>
						<span className='api-text text-center'>API KEY</span>
					</div>
				</Link>
				<Link
					to={PATHS.SHOPIFY}
					role='button'
					className='col-sm-12 col-md-12 col-lg-6 button-wrapper my-3'
				>
					<div className='d-flex w-75 justify-content-center align-items-center bg-white api-wrapper'>
						<img className='img-fluid' width={250} src={shopifyLogo} alt='shopify logo' />
					</div>
				</Link>
			</div>
		</div>
	);
}
