import './couriers.css';
import React, { useCallback } from 'react';
import stuart from '../../../../assets/img/stuart.svg';
import gophr from '../../../../assets/img/gophr.svg';
import streetStream from '../../../../assets/img/street-stream.svg';
import ecofleet from '../../../../assets/img/ecofleet.svg';
import addisonLee from '../../../../assets/img/addison_lee_logo_resized.svg';
import absolutely from '../../../../assets/img/absolutely-brand.svg';
import here_now from '../../../../assets/img/here-now.PNG';
import classnames from 'classnames';
import CourierPanel from './components/CourierPanel';
import { useDispatch, useSelector } from 'react-redux';
import { updateFleetProviders } from '../../../../store/actions/settings';
import { PROVIDERS } from '../../../../constants';

const Couriers = () => {
	const dispatch = useDispatch();
	const courierLinkBtn = classnames({
		'col-sm-12': true,
		'col-md-4': true,
		'text-decoration-none': true,
		'my-2': true
	});
	const { email } = useSelector(state => state['currentUser'].user);
	const { activeFleetProviders } = useSelector(state => state['settingsStore']);

	const toggleProvider = useCallback(
		provider => {
			let data = { ...activeFleetProviders, ...provider };
			console.log(data);
			dispatch(updateFleetProviders(email, data)).then(() => console.log('Fleet provider updated successfully!'));
		},
		[activeFleetProviders]
	);

	return (
		<div className='tab-container container-fluid p-5'>
			<div className='container'>
				<div className='row gy-5 gx-4 d-flex justify-content-center'>
					<div className={courierLinkBtn}>
						<CourierPanel
							id={PROVIDERS.STUART}
							name='Stuart'
							img={stuart}
							link='https://stuart.com'
							linkText='stuart.com'
							description="Stuart is Europe's leading on-demand provider with a fleet of geolocalised independent couriers"
							locations='Throughout France, United Kingdom, Spain, Poland, Portugal, Italy'
							services='Service Level: On-demand and Scheduled delivery'
							vehicles='Bicycle, Motorcycle, Car and Van'
							toggle={toggleProvider}
						/>
					</div>
					<div className={courierLinkBtn}>
						<CourierPanel
							id={PROVIDERS.GOPHR}
							name='Gophr'
							img={gophr}
							description='Gophr has built a platform focused on courier needs, unlocking greater opportunities for couriers'
							link='https://gophr.com'
							linkText='gophr.com'
							locations='Throughout London and the UK'
							services='Service Level: On-demand and Scheduled delivery'
							vehicles='Bicycle, Motorcycle, Cargobike, Car and Van'
							toggle={toggleProvider}
						/>
					</div>
					<div className={courierLinkBtn}>
						<CourierPanel
							id={PROVIDERS.STREET_STREAM}
							name='Street Stream'
							img={streetStream}
							description='Street Stream are a London based Same-Day courier Service.'
							link='https://streetstream.co.uk'
							linkText='streetstream.co.uk'
							locations='London'
							services='Service Level: Same-Day On-demand and Scheduled delivery'
							vehicles='Bicycle, Motorcycle, Cargobike, Car and Van'
							toggle={toggleProvider}
						/>
					</div>
					<div className={courierLinkBtn}>
						<CourierPanel
							id={PROVIDERS.ECOFLEET}
							name='Ecofleet'
							img={ecofleet}
							description='Carbon-neutral electric bikes offering a last-mile delivery service in London. '
							link='https://ecofleet.co.uk'
							linkText='ecofleet.co.uk'
							locations='London'
							services='Service Level: Scheduled delivery'
							vehicles='Cargobike'
							toggle={toggleProvider}
						/>
					</div>
					<div className={courierLinkBtn}>
						<CourierPanel
							id={PROVIDERS.ADDISON_LEE}
							name='Addison Lee'
							img={addisonLee}
							description='Addison Lee has a network of dedicated courier fleets of all sizes at your service for anything you need to deliver from small parcels to bulky deliveries.'
							link='http://addisonlee.com'
							linkText='addisonlee.com'
							locations='London'
							services='Service Level: On-demand and Scheduled delivery'
							vehicles='Bicycle, Motorbike, Small Van and Large Van'
							toggle={toggleProvider}
							comingSoon={true}
						/>
					</div>
					<div className={courierLinkBtn}>
						<CourierPanel
							id={PROVIDERS.ABSOLUTELY}
							name='Absolutely Couriers'
							img={absolutely}
							description="Absolutely provides a full range of services to meet the demands of London's diverse economy, including same day temperature-controlled courier services."
							link='https://absolutelycourier.com'
							linkText='absolutelycourier.com'
							locations='London'
							services='Service Level: Overnight, Temperature-Controlled'
							vehicles='Bicycle, Motorbike, Cargobike, Small Van and Large Van'
							toggle={toggleProvider}
							comingSoon={true}
						/>
					</div>
					<div className={courierLinkBtn}>
						<CourierPanel
							id={PROVIDERS.HERE_NOW}
							name='Here and Now'
							img={here_now}
							description='Description: Here and Now is a commission-free delivery courier service.'
							link='https://here-now.co.uk'
							linkText='here-now.co.uk'
							locations='London'
							services='Same Day Delivery'
							vehicles='Bicycle'
							imgStyle={{ width: 75, height: 75 }}
							toggle={toggleProvider}
							comingSoon={true}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Couriers;
