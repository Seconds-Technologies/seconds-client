import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import './FeaturedInfo.css';
import { STATUS } from '../../constants';
import { getAllOrders } from '../../store/actions/shopify';
import { subscribe, unsubscribe } from '../../store/actions/delivery';
import moment from 'moment';

const FeaturedInfo = ({interval}) => {
    const dispatch = useDispatch();
    const filterByInterval = useCallback((data) => {
        console.log("INTERVAL: ", interval)
        switch(interval){
            case "day":
                return data.filter(({createdAt}) => {
                    let duration = moment.duration(moment().diff(moment(createdAt))).as("day")
                    console.log("DURATION", duration)
                    return duration < 1
                })
            case "week":
                return data.filter(({createdAt}) => {
                    let duration = moment.duration(moment().diff(moment(createdAt))).as("week")
                    console.log("DURATION", duration)
                    return duration < 1
                })
            case "month":
                return data.filter(({createdAt}) => {
                    let duration = moment.duration(moment().diff(moment(createdAt))).as("month")
                    console.log("DURATION", duration)
                    return duration < 1
                })
            case "year":
                return data.filter(({createdAt}) => {
                    let duration = moment.duration(moment().diff(moment(createdAt))).as("year")
                    console.log("DURATION", duration)
                    return duration < 1
                })
            default:
                return data
        }
    },[interval])

    const { isIntegrated, credentials } = useSelector(state => state['shopifyStore']);
    const { email, createdAt, apiKey } = useSelector(state => state['currentUser'].user);
    const { total, completed } = useSelector(state => {
        if (isIntegrated) {
            const { allOrders: total, completedOrders: completed } = state['shopifyOrders'];
            return { total, completed }
        } else {
            const { allJobs: total, completedJobs: completed } = state['deliveryJobs'];
            console.log(completed)
            return { total: filterByInterval(total), completed: filterByInterval(completed) }
        }
    });

    useEffect(() => {
        isIntegrated && dispatch(getAllOrders(credentials.accessToken, credentials.baseURL, email, createdAt))
        apiKey && dispatch(subscribe(apiKey, email));
        return () => apiKey && dispatch(unsubscribe());
    }, [isIntegrated, apiKey]);

    const deliveryFee = useMemo(() => {
        let totalFee = 0;
        for (let order of completed){
            console.log("MEMO:", order)
            totalFee = totalFee + order.deliveryFee
        }
        console.log(totalFee)
        return totalFee.toFixed(2)
    }, [completed]);

    const inTransit = useMemo(() => {
        return (total.filter(job => job.status === STATUS.DISPATCHING || job.status === STATUS.EN_ROUTE)).length
    }, [total])

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

export default FeaturedInfo;
