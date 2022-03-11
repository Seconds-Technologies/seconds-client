import './FeaturedInfo.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import { STATUS } from '../../constants';
import { subscribe, unsubscribe } from '../../store/actions/delivery';
import { dateFilter } from '../../helpers';

const FeaturedInfo = ({interval}) => {
    const dispatch = useDispatch();
    const filterByInterval = useCallback(dateFilter,[interval])

    const { email, apiKey } = useSelector(state => state['currentUser'].user);
    const { total, completed } = useSelector(state => {
        const { allJobs: total, completedJobs: completed } = state['deliveryJobs'];
        return { total: filterByInterval(total, interval), completed: filterByInterval(completed, interval) }
    });

    useEffect(() => {
        apiKey && dispatch(subscribe(apiKey, email));
        return () => apiKey && dispatch(unsubscribe());
    }, [apiKey]);

    const inTransit = useMemo(() => {
        return (total.filter(job => job.status === STATUS.DISPATCHING || job.status === STATUS.EN_ROUTE)).length
    }, [total])

    const fulfillmentRate = useMemo(() => {
		console.log(completed.length);
		console.log(total.length);
		if (total.length === 0) {
			return `0%`;
		} else {
            let rate = ((completed.length / total.length) * 100).toFixed(1);
			return `${rate}%`
		}
	}, [total, completed]);

    return (
        <div className='featured'>
            <div className='featuredItem py-1'>
                <Link to='/orders' className='ordersLink d-flex flex-column align-items-center text-center justify-content-between'>
                    <span className='featuredTitle mb-1'>All Orders</span>
                    <span className='featuredValue'>{total.length}</span>
                </Link>
            </div>
            <div className='featuredItem d-flex flex-column align-items-center py-1'>
                <span className='featuredTitle mb-1'>In Transit</span>
                <span className='featuredValue'>{inTransit}</span>
            </div>
            <div className='featuredItem d-flex flex-column align-items-center py-1'>
                <span className='featuredTitle mb-1'>Completed Orders</span>
                <span className='featuredValue'>{completed.length}</span>
            </div>
            <div className='featuredItem d-flex flex-column align-items-center py-1'>
                <span className='featuredTitle mb-1'>Fulfillment</span>
                <span className='featuredValue'>{fulfillmentRate}</span>
            </div>
        </div>
    );
}

export default FeaturedInfo;
