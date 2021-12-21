import './Dashboard.css';
import React, { useEffect, useMemo, useState } from 'react';
import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo';
import Map from '../../components/Map/Map';
import { useSelector } from 'react-redux';
import { Mixpanel } from '../../config/mixpanel';

const Dashboard = props => {
	const latitude = useMemo(() => Number(localStorage.getItem('latitude')), []);
	const longitude = useMemo(() => Number(localStorage.getItem('longitude')), []);
	const [options] = useState([
		{
			id: 'day',
			name: 'Last 24 hrs'
		},
		{
			id: 'week',
			name: 'Last Week'
		},
		{
			id: 'month',
			name: 'Last Month'
		},
		{
			id: 'year',
			name: 'Last Year'
		}
	]);
	const [active, setActive] = useState({ id: 'day', name: 'Last 24 hrs' });
	const { firstname } = useSelector(state => state['currentUser'].user);

	useEffect(() => {
		Mixpanel.people.increment('page_views');
	}, []);

	return (
		<div className='dashboard bg-light'>
			<div className='d-flex justify-content-between px-4 pt-3'>
				<div className='d-flex flex-column justify-content-center'>
					<span className='dashboard-header mb-3'>Dashboard</span>
					<span className='fs-5'>
						<span className='bold-text'>{`Hey ${firstname},`}</span>&nbsp;here is your delivery overview
					</span>
				</div>
				<div className='dropdown'>
					<button
						className='btn bg-white dropdown-toggle border border-1 border-grey'
						type='button'
						id='dropdownMenuButton1'
						data-bs-toggle='dropdown'
						aria-expanded='false'
					>
						{active.name}
					</button>
					<ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
						{options.map(
							({ id, name }, index) =>
								id !== active.id && (
									<li key={index} role='button'>
										{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
										<div className='dropdown-item' onClick={() => setActive({ id, name })}>
											{name}
										</div>
									</li>
								)
						)}
					</ul>
				</div>
			</div>
			<FeaturedInfo interval={active.id} />
			<Map styles='mt-4' location={[longitude, latitude]} height={320} />
		</div>
	);
};

export default Dashboard;
