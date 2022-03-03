import './couriers.css';
import React from 'react';
import stuart from '../../../../assets/img/stuart.svg';
import gophr from '../../../../assets/img/gophr.svg';
import streetStream from '../../../../assets/img/street-stream.svg';
import ecofleet from '../../../../assets/img/ecofleet.svg';
import addisonLee from '../../../../assets/img/addison_lee_logo_resized.svg';
import classnames from 'classnames';

const Couriers = () => {
	const courierLinkBtn = classnames({
		'col-sm-12': true,
		'col-md-4': true,
		'text-decoration-none': true,
		'my-2': true,
	});

	return (
		<div className='tab-container container-fluid p-5'>
			<div className='container'>
				<div className='row gy-5 gx-4 d-flex justify-content-center'>
					<a href='https://stuart.com/' target='_blank' role='button' className={courierLinkBtn}>
						<div className='d-flex flex-column h-100 align-items-center border rounded-3 p-3 courier-tile'>
							<img src={stuart} alt='' width={120} height={120} />
							<span className='display-6 text-dark'>Stuart</span>
						</div>
					</a>
					<a href='https://uk.gophr.com/' target='_blank' role='button' className={courierLinkBtn}>
						<div role='button' className='d-flex flex-column h-100 align-items-center border rounded-3 p-3 courier-tile'>
							<img src={gophr} alt='' width={120} height={120} />
							<span className='display-6 text-dark'>Gophr</span>
						</div>
					</a>
					<a href='https://www.streetstream.co.uk/' target='_blank' role='button' className={courierLinkBtn}>
						<div role='button' className='d-flex flex-column h-100 align-items-center border rounded-3 p-3 courier-tile'>
							<img src={streetStream} alt='' width={120} height={120} />
							<span className='display-6 text-dark'>Street Stream</span>
						</div>
					</a>
					<a href='https://ecofleet.co.uk/' target='_blank' role='button' className={courierLinkBtn}>
						<div className='d-flex flex-column h-100 align-items-center border rounded-3 p-3 courier-tile'>
							<img src={ecofleet} alt='' width={120} height={120} />
							<span className='display-6 text-dark'>Ecofleet</span>
						</div>
					</a>
					<a href='https://www.addisonlee.com/' target='_blank' role='button' className={courierLinkBtn}>
						<div className='d-flex flex-column h-100 align-items-center border rounded-3 p-3 courier-tile test3'>
							<img src={addisonLee} alt='' width={200} height={120} />
							<span className='display-6 text-dark'>Addison Lee</span>
						</div>
					</a>
				</div>
			</div>
		</div>
	);
};

export default Couriers;
