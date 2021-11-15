import './Dashboard.css';
import React, { useEffect, useState } from 'react';
import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo';
import Map from '../../components/Map/Map';
import { useSelector } from 'react-redux';
import { Mixpanel } from '../../config/mixpanel'
import {ChatWidget} from "@papercups-io/chat-widget";

const Dashboard = props => {
	const token = String(process.env.REACT_APP_PAPERCUPS_TOKEN)
	const inbox = String(process.env.REACT_APP_INBOX_ID)
	const [options] = useState([
		{
			id: 'day',
			name: 'Last 24 hrs',
		},
		{
			id: 'week',
			name: 'Last Week',
		},
		{
			id: 'month',
			name: 'Last Month',
		},
		{
			id: 'year',
			name: 'Last Year',
		},
	]);
	const [active, setActive] = useState({ id: 'day', name: 'Last 24 hrs' });
	const { id, firstname, lastname, email, subscriptionPlan } = useSelector(state => state['currentUser'].user);

	useEffect(() => {
		console.table({token, inbox})
		Mixpanel.people.increment("page_views")
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
									<li key={index} role="button">
										{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
										<div className='dropdown-item' onClick={() => setActive({id,name})}>
											{name}
										</div>
									</li>
								)
						)}
					</ul>
				</div>
			</div>
			<FeaturedInfo interval={active.id} />
			<Map />
			<ChatWidget
				// `accountId` is used instead of `token` in older versions
				// of the @papercups-io/chat-widget package (before v1.2.x).
				// You can delete this line if you are on the latest version.
				// accountId="8d14f8d9-7027-4af7-8fb2-14ca0712e633"
				token={token}
				inbox={inbox}
				title="Welcome to Seconds"
				subtitle="Ask us anything in the chat window below 😊"
				primaryColor="#9400d3"
				greeting="Hi there! How can I help you?"
				newMessagePlaceholder="Start typing..."
				showAgentAvailability={false}
				agentAvailableText="We're online right now!"
				agentUnavailableText="We're away at the moment."
				requireEmailUpfront={false}
				iconVariant="outlined"
				baseUrl="https://app.papercups.io"
				styles={{
					toggleButton: {
						width: 60,
						height: 60
					}
				}}
				// Optionally include data about your customer here to identify them
				customer={{
					name: `${firstname} ${lastname}`,
					email: email,
					external_id: id,
					metadata: {
						plan: subscriptionPlan
					},
					current_url: `https://app.ususeconds.com${props.location.pathname}`
				}}
			/>
		</div>
	);
}

export default Dashboard;
