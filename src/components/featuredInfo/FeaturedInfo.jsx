import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllOrders } from '../../store/actions/shopify';
import './FeaturedInfo.css';

export default function FeaturedInfo() {
    const dispatch = useDispatch();
    const { isIntegrated, credentials } = useSelector(state => state['shopifyStore']);
    const { total, completed } = useSelector(state => {
        if (isIntegrated) {
            const { allOrders: total, completedOrders: completed } = state['shopifyOrders'];
            return { total, completed }
        } else {
            const { allJobs: total, completedJobs: completed } = state['deliveryJobs'];
            return { total, completed }
        }
    });
    const { email, createdAt } = useSelector(state => state['currentUser'].user);

    useEffect(() => {
        if (isIntegrated) {
            const { accessToken, baseURL } = credentials;
            dispatch(getAllOrders(accessToken, baseURL, email, createdAt));
        }
    }, [isIntegrated]);

    return (
        <div className='featured'>
            <div className='featuredItem'>
                <Link to='/orders' className='ordersLink d-flex flex-column align-items-center text-center'>
                    <span className='featuredTitle'>All Orders</span>
                    <div className='featuredAllOrdersContainer'>
                        <span className='featuredAllOrders'>{total.length}</span>
                    </div>
                    <span className='featuredSub'>Total orders from your store</span>
                </Link>
            </div>
            <div className='featuredItem d-flex flex-column align-items-center'>
                <span className='featuredTitle'>Completed Orders</span>
                <div className='featuredAllOrdersContainer'>
                    <span className='featuredAllOrders'>{completed.length}</span>
                </div>
                <span className='featuredSub'>Total number of orders delivered</span>
            </div>
            <div className='featuredItem featuredItem d-flex flex-column align-items-center'>
                <span className='featuredTitle'>Delivery Payouts</span>
                <div className='featuredAllOrdersContainer'>
                    <span className='featuredAllOrders'>{`£${7 * completed.length}`}</span>
                </div>
                <span className='featuredSub'>Total delivery payouts</span>
            </div>
        </div>
    );
}
