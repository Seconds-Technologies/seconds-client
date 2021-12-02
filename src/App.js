import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from 'react';
import routes from './routes/routes';
import Topbar from './components/topbar/Topbar';
import Sidebar from './components/sidebar/Sidebar';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setAuthorizationToken } from './store/actions/auth';
import GeolocationContextProvider from './context/GeolocationContext';
import { ChatWidget } from '@papercups-io/chat-widget';

if (localStorage.getItem('jwt_token')) {
	setAuthorizationToken(localStorage.getItem('jwt_token'));
}

function App() {
	const location = useLocation();
	const {
		isAuthenticated,
		user: { id, firstname, lastname, email, subscriptionPlan },
	} = useSelector(state => state['currentUser']);
	const token = '8d14f8d9-7027-4af7-8fb2-14ca0712e633';
	const inbox = '3793e40e-c090-4412-acd0-7e20a7dc9f8a';
	console.log('isAuthenticated:', isAuthenticated);
	return (
		<GeolocationContextProvider>
			<Router>
				{isAuthenticated && <Topbar />}
				<div className='app-container'>
					{isAuthenticated && <Sidebar />}
					{routes}
				</div>
				{isAuthenticated && <ChatWidget
					// `accountId` is used instead of `token` in older versions
					// of the @papercups-io/chat-widget package (before v1.2.x).
					// You can delete this line if you are on the latest version.
					// accountId="8d14f8d9-7027-4af7-8fb2-14ca0712e633"
					token={token}
					inbox={inbox}
					title='Welcome to Seconds'
					subtitle='Ask us anything in the chat window below 😊'
					primaryColor='#9400d3'
					position='left'
					greeting='Hi there! How can I help you?'
					newMessagePlaceholder='Start typing...'
					showAgentAvailability={false}
					agentAvailableText="We're online right now!"
					agentUnavailableText="We're away at the moment."
					requireEmailUpfront={false}
					iconVariant='outlined'
					baseUrl='https://app.papercups.io'
					styles={{
						toggleButton: {
							width: 75,
							height: 75,
							marginLeft: 40
						},
						toggleContainer: {
							zIndex: 1000000,
							position: 'absolute',
						},
						chatContainer: {
							zIndex: 10000000,
							position: 'absolute',
						},
					}}
					// Optionally include data about your customer here to identify them
					customer={{
						name: `${firstname} ${lastname}`,
						email: email,
						external_id: id,
						metadata: {
							plan: subscriptionPlan,
						},
						current_url: `https://app.ususeconds.com${location.pathname}`,
					}}
				/>}
			</Router>
		</GeolocationContextProvider>
	);
}

export default App;
