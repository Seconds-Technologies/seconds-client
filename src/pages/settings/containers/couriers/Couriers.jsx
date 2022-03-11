import './couriers.css';
import React from 'react';
import stuart from '../../../../assets/img/stuart.svg';
import gophr from '../../../../assets/img/gophr.svg';
import streetStream from '../../../../assets/img/street-stream.svg';
import ecofleet from '../../../../assets/img/ecofleet.svg';
import addisonLee from '../../../../assets/img/addison_lee_logo_resized.svg';
import classnames from 'classnames';
import trackIcon from '../../../../assets/img/track1.svg';
import serviceIcon from '../../../../assets/img/service.svg';
import vehicleIcon from '../../../../assets/img/vehicle.svg';
import CourierPanel from '../../components/CourierPanel';

const Couriers = () => {
	const courierLinkBtn = classnames({
		'col-sm-12': true,
		'col-md-4': true,
		'text-decoration-none': true,
		'my-2': true
	});

	return (
		<div className='tab-container container-fluid p-5'>
			<div className='container'>
				<div className='row gy-5 gx-4 d-flex justify-content-center'>
					<div className={courierLinkBtn}>
						<CourierPanel
							name='Stuart'
							img={stuart}
							link='stuart.com'
							description="Stuart is Europe's leading on-demand provider with a fleet of geolocalised independent couriers"
							locations='Throughout France, United Kingdom, Spain, Poland, Portugal, Italy'
							services='Service Level: On-demand and Scheduled delivery'
							vehicles='Bicycle, Motorcycle, Car and Van'
						/>
					</div>
					<div className={courierLinkBtn}>
						<CourierPanel
							name='Gophr'
							img={gophr}
							description='Gophr has built a platform focused on courier needs, unlocking greater opportunities for couriers'
							link='gophr.com'
							locations='London, Brighton, Cambridge, Luton, Oxford, Southampton, Portsmouth, Burnley, Bury, Liverpool, Manchester, Wigna, Sheffield, Leeds, Wakefield, York, Bournemouth, Bristol, Cardiff, Birmingam, Nottingham, Leicester, Shrewsbury, Wolverhampton, Edinburgh, Glasgow'
							services='Service Level: On-demand and Scheduled delivery'
							vehicles='Bicycle, Motorcycle, Cargobike, Car and Van'
						/>
					</div>
					<div className={courierLinkBtn}>
						<CourierPanel
							name='Street Stream'
							img={streetStream}
							description='Street Stream are a London based Same-Day courier Service.'
							link='streetstream.co.uk'
							locations='London'
							services='Service Level: Same-Day On-demand and Scheduled delivery'
							vehicles='Bicycle, Motorcycle, Cargobike, Car and Van'
						/>
					</div>
					<div className={courierLinkBtn}>
						<CourierPanel
							name='Ecofleet'
							img={ecofleet}
							description='Carbon-neutral electric bikes offering a last-mile delivery service in London. '
							link='ecofleet.co.uk'
							locations='London'
							services='Service Level: Scheduled delivery'
							vehicles='Cargobike'
						/>
					</div>
					<div className={courierLinkBtn}>
						<CourierPanel
							name="Addison Lee"
							img={addisonLee}
							description='Addison Lee has a network of dedicated courier fleets of all sizes at your service for anything you need to deliver from small parcels to bulky deliveries.'
							link='addisonlee.com'
							locations='London'
							services='Service Level: On-demand and Scheduled delivery'
							vehicles='Bicycle, Motorbike, Small Van and Large Van'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Couriers;
