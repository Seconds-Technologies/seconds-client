import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFleetProviders } from '../../../../store/actions/settings';
import { capitalize } from '../../../../helpers';
import classnames from 'classnames';
import { Mixpanel } from '../../../../config/mixpanel';
import { removeError } from '../../../../store/actions/errors';
import StuartPanel from './components/StuartPanel';
import GophrPanel from './components/GophrPanel';
import StreetStreamPanel from './components/StreetStreamPanel';
import EcofleetPanel from './components/EcofleetPanel';
import AddisonLeePanel from './components/AddisonLeePanel';
import SuccessToast from '../../../../modals/SuccessToast';
import HereAndNowPanel from './components/HereAndNowPanel';
import AbsolutelyPanel from './components/AbsolutelyPanel';

const Couriers = props => {
	const dispatch = useDispatch();
	const { email } = useSelector(state => state['currentUser'].user);
	const { activeFleetProviders } = useSelector(state => state['settingsStore']);
	const [successMessage, setSuccess] = useState('');

	const toggleProvider = useCallback(
		provider => {
			let data = { ...activeFleetProviders, ...provider };
			console.log(data);
			dispatch(updateFleetProviders(email, data)).then(() => {
				let providerId = Object.keys(provider)[0];
				let status = provider[providerId] ? 'enabled' : 'disabled';
				let message = `${capitalize(providerId)} is now ${status}`;
				console.log(message);
				setSuccess(message);
			});
		},
		[activeFleetProviders]
	);

	const courierLinkBtn = classnames({
		'col-sm-12': true,
		'col-md-4': true,
		'text-decoration-none': true,
		'my-2': true
	});

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		dispatch(removeError());
	}, [props.location]);

	return (
		<div className='tab-container container-fluid py-3 px-4'>
			<SuccessToast message={successMessage} toggleShow={setSuccess} />
			<div className='container'>
				<div className='row'>
					<StuartPanel wrapper={courierLinkBtn} toggle={toggleProvider} />
					<GophrPanel wrapper={courierLinkBtn} toggle={toggleProvider} />
					<AddisonLeePanel wrapper={courierLinkBtn} toggle={toggleProvider} />
					<StreetStreamPanel wrapper={courierLinkBtn} toggle={toggleProvider} />
					<AbsolutelyPanel wrapper={courierLinkBtn} toggle={toggleProvider} />
					<HereAndNowPanel wrapper={courierLinkBtn} toggle={toggleProvider} width={300} height={225} />
					<EcofleetPanel wrapper={courierLinkBtn} toggle={toggleProvider} />
				</div>
			</div>
		</div>
	);
};

export default Couriers;
