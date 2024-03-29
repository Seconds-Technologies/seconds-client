import './FeaturedInfo.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import { PATHS, STATUS } from '../../constants';
import { subscribe, unsubscribe } from '../../store/actions/delivery';
import { dateFilter } from '../../helpers';

const FeaturedInfo = ({ interval }) => {
	const dispatch = useDispatch();
	const filterByInterval = useCallback(dateFilter, [interval]);
	const drivers = useSelector(state => state['driversStore'])
	const { email, apiKey } = useSelector(state => state['currentUser'].user);
	const { total, completed } = useSelector(state => {
		const { allJobs: total, completedJobs: completed } = state['deliveryJobs'];
		return { total: filterByInterval(total, interval), completed: filterByInterval(completed, interval) };
	});

	useEffect(() => {
		apiKey && dispatch(subscribe(apiKey, email));
		return () => apiKey && dispatch(unsubscribe());
	}, [apiKey]);

	const inTransit = useMemo(() => {
		return total.filter(job => job.status === STATUS.DISPATCHING || job.status === STATUS.EN_ROUTE).length;
	}, [total]);

	const onlineDrivers = useMemo(() => {
		return drivers.filter(driver => driver.isOnline).length
	}, [drivers]);

	const fulfillmentRate = useMemo(() => {
		if (total.length === 0) {
			return `0%`;
		} else {
			let rate = ((completed.length / total.length) * 100).toFixed(1);
			return `${rate}%`;
		}
	}, [total, completed]);

	return (
		<div className='featured-container'>
			<div className='featuredItem py-1'>
				<Link to={PATHS.ORDERS} className='ordersLink d-flex flex-column align-items-center justify-content-center'>
					{/*<div className="px-4">
                        <img src={panelIcon1} alt='' className="img-fluid" width={35} height={35}/>
                    </div>*/}
					<span className='featuredTitle'>All Orders</span>
					<span className='featuredValue'>{total.length}</span>
				</Link>
			</div>
			<div className='featuredItem d-flex flex-column align-items-center justify-content-center py-1'>
				{/*<div className="px-4">
                    <img src={panelIcon2} alt='' className="img-fluid" width={45} height={45}/>
                </div>*/}
				<span className='featuredTitle'>In Transit</span>
				<span className='featuredValue'>{inTransit}</span>
			</div>
			<div className='featuredItem d-flex flex-column align-items-center justify-content-center py-1'>
				{/*<div className="px-4">
                    <img src={panelIcon3} alt='' className="img-fluid" width={35} height={35}/>
                </div>*/}
				<span className='featuredTitle'>Completed Orders</span>
				<span className='featuredValue'>{completed.length}</span>
			</div>
			<div className='featuredItem py-1'>
				<Link to={PATHS.DRIVERS} className='ordersLink d-flex flex-column align-items-center justify-content-center'>
					{/*<div className="px-4">
                        <img src={panelIcon1} alt='' className="img-fluid" width={35} height={35}/>
                    </div>*/}
					<span className='featuredTitle'>Online Drivers</span>
					<span className='featuredValue'>{onlineDrivers}</span>
				</Link>
			</div>
			<div className='featuredItem d-flex flex-column align-items-center justify-content-center py-1'>
				{/*<div className="px-4">
                    <img src={panelIcon4} alt='' className="img-fluid" width={35} height={35}/>
                </div>*/}
				<span className='featuredTitle'>Fulfillment</span>
				<span className='featuredValue'>{fulfillmentRate}</span>
			</div>
		</div>
	);
};

export default FeaturedInfo;
