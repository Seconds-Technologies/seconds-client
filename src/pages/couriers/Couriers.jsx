import React from 'react';
import './couriers.css';
import stuart from '../../assets/img/stuart.svg'
import gophr from '../../assets/img/gophr.svg';
import streetStream from '../../assets/img/street-stream.svg';
import ecofleet from '../../assets/img/ecofleet.svg';

const Couriers = () => {
	return (
		<div className='couriers container-fluid p-5'>
			<div>
				<h3>Couriers</h3>
				<p className="mt-3">Use your existing contracts or discounted Seconds rate.</p>
			</div>
			<hr className="mt-4 mb-5"/>
			<div className='row gy-5 gx-4'>
				<a href="https://stuart.com/" target="_blank" role="button" className='col-sm-12 col-md-6 text-decoration-none'>
					<div role="button" className="d-flex h-100 align-items-center border border-dark rounded-3 p-3 me-md-4 courier-tile">
						<img src={stuart} alt='' width={120} height={120} />
						<span className="display-6 ms-5 text-dark">Stuart</span>
					</div>
				</a>
				<a href="https://uk.gophr.com/" target="_blank" role="button" className='col-sm-12 col-md-6 text-decoration-none'>
					<div role="button"  className="d-flex h-100 align-items-center border border-dark rounded-3 p-3 ms-md-4 courier-tile">
						<img src={gophr} alt=''  width={120} height={120} />
						<span className="display-6 ms-5 text-dark">Gophr</span>
					</div>
				</a>
				<a href="https://www.streetstream.co.uk/" target="_blank" role="button" className='col-sm-12 col-md-6 text-decoration-none'>
					<div role="button" className="d-flex h-100 align-items-center border border-dark rounded-3 p-3 me-md-4 courier-tile">
						<img src={streetStream} alt=''  width={120} height={120} />
						<span className="display-6 ms-5 text-dark">Street Stream</span>
					</div>
				</a>
				<a href="https://ecofleet.co.uk/" target="_blank" role="button" className='col-sm-12 col-md-6 text-decoration-none'>
					<div className="d-flex h-100 align-items-center border border-dark rounded-3 p-3 ms-md-4 courier-tile">
						<img src={ecofleet} alt=''  width={120} height={120} />
						<span className="display-6 ms-5 text-dark">Ecofleet</span>
					</div>
				</a>
			</div>
		</div>
	);
};

export default Couriers;
