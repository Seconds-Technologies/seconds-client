import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { getAllOrders } from '../../store/actions/shopify';
import { getAllJobs } from '../../store/actions/delivery';
import './FeaturedInfo.css';
import { STATUS } from '../../constants';

export default function FeaturedInfo() {
    const dispatch = useDispatch();
    const { isIntegrated, credentials } = useSelector(state => state['shopifyStore']);
    const { email, createdAt, apiKey } = useSelector(state => state['currentUser'].user);
    const { total, completed } = useSelector(state => {
        if (isIntegrated) {
            const { allOrders: total, completedOrders: completed } = state['shopifyOrders'];
            return { total, completed }
        } else {
            const { allJobs: total, completedJobs: completed } = state['deliveryJobs'];
            return { total, completed }
        }
    });

    const deliveryFee = useMemo(() => {
        let totalFee = 0;
        for (let order of completed){
            console.log("MEMO:", order)
            totalFee = totalFee + order.payout
        }
        console.log(totalFee)
        return totalFee.toFixed(2)
    }, [completed]);

    const inTransit = useMemo(() => {
        return (total.filter(job => job.status === STATUS.DISPATCHING || job.status === STATUS.EN_ROUTE)).length
    }, [total])

    useEffect(() => {
        if (isIntegrated) {
            const { accessToken, baseURL } = credentials;
            dispatch(getAllOrders(accessToken, baseURL, email, createdAt))
        } else {
            dispatch(getAllJobs(apiKey, email));
        }
    }, [isIntegrated]);

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
                <span className='featuredTitle mb-1'>Payouts</span>
                <span className='featuredValue'>{`£${deliveryFee}`}</span>
            </div>
        </div>
    );
}
