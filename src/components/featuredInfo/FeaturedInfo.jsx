import './FeaturedInfo.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import { STATUS } from '../../constants';
import { subscribe, unsubscribe } from '../../store/actions/delivery';
import { dateFilter } from '../../helpers';
import panelIcon1 from '../../assets/img/feature-icon-1.svg'
import panelIcon2 from '../../assets/img/feature-icon-2.svg'
import panelIcon3 from '../../assets/img/feature-icon-3.svg'
import panelIcon4 from '../../assets/img/feature-icon-4.svg'

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
                <Link to='/orders' className='ordersLink d-flex align-items-center'>
                    <div className="px-4">
                        <img src={panelIcon1} alt='' className="img-fluid" width={60} height={60}/>
                    </div>
                    <div className='d-flex flex-column justify-content-center py-1'>
                        <span className='featuredTitle'>All Orders</span>
                        <span className='featuredValue'>{total.length}</span>
                    </div>
                </Link>
            </div>
            <div className='featuredItem d-flex align-items-center py-1'>
                <div className="px-4">
                    <img src={panelIcon2} alt='' className="img-fluid" width={60} height={60}/>
                </div>
                <div className='d-flex flex-column justify-content-center py-1'>
                    <span className='featuredTitle'>In Transit</span>
                    <span className='featuredValue'>{inTransit}</span>
                </div>
            </div>
            <div className='featuredItem d-flex align-items-center py-1'>
                <div className="px-4">
                    <img src={panelIcon3} alt='' className="img-fluid" width={60} height={60}/>
                </div>
                <div className='d-flex flex-column justify-content-center py-1'>
                    <span className='featuredTitle'>Completed Orders</span>
                    <span className='featuredValue'>{completed.length}</span>
                </div>
            </div>
            <div className='featuredItem d-flex align-items-center py-1'>
                <div className="px-4">
                    <img src={panelIcon4} alt='' className="img-fluid" width={60} height={60}/>
                </div>
                <div className='d-flex flex-column justify-content-center py-1'>
                    <span className='featuredTitle'>Fulfillment</span>
                    <span className='featuredValue'>{fulfillmentRate}</span>
                </div>
            </div>
        </div>
    );
}

export default FeaturedInfo;
