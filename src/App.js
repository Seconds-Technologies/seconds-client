import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useReducer } from 'react';
import routes from './routes/routes';
import Sidebar from './components/sidebar/Sidebar';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthorizationToken, syncUser } from './store/actions/auth';
import GeolocationContextProvider from './context/GeolocationContext';
import { ChatWidget } from '@papercups-io/chat-widget';
import { IntercomProvider } from 'react-use-intercom';
import TabContext, { indexReducer } from './context/TabContext';
import { MagicBellProvider } from '@magicbell/magicbell-react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import AmplifyContextProvider from './context/AmplifyContext';

if (localStorage.getItem('jwt_token')) {
	setAuthorizationToken(localStorage.getItem('jwt_token'));
}

function App() {
	const [val, setVal] = useReducer(indexReducer, 0, () => 0);
	const location = useLocation();
	const dispatch = useDispatch();
	const {
		isAuthenticated,
		user: { id, firstname, lastname, email, subscriptionPlan }
	} = useSelector(state => state['currentUser']);
	const token = '8d14f8d9-7027-4af7-8fb2-14ca0712e633';
	const inbox = '3793e40e-c090-4412-acd0-7e20a7dc9f8a';
	const stuartAppId = process.env.REACT_APP_STUART_APP_ID;

	const theme = createTheme({
		palette: {
			neutral: {
				main: grey,
				contrastText: '#fff'
			}
		}
	});

	useEffect(() => {
		isAuthenticated &&
			dispatch(syncUser(email))
				.then(() => console.log('USER SYNCED'))
				.catch(err => console.error('USER SYNC FAILED!', err));
	}, [isAuthenticated]);

	return (
		<GeolocationContextProvider>
			<AmplifyContextProvider>
				<MagicBellProvider
					userExternalId={id}
					apiKey={process.env.REACT_APP_MAGIC_BELL_API_KEY}
					theme={{
						header: {
							backgroundColor: '#9400D3'
						},
						footer: {
							backgroundColor: '#9400D3'
						}
					}}
				>
					<ThemeProvider theme={theme}>
						<TabContext.Provider value={{ index: val, dispatch: setVal }}>
							<IntercomProvider appId={stuartAppId} shouldInitialize={process.env.NODE_ENV === 'production'}>
								<Router>
									<div className='app-container'>
										{isAuthenticated && <Sidebar />}
										{routes}
									</div>
									{isAuthenticated && (
										<ChatWidget
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
													width: 60,
													height: 60
												},
												toggleContainer: {
													zIndex: 1000000,
													position: 'fixed'
												},
												chatContainer: {
													zIndex: 10000000,
													position: 'fixed'
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
												current_url: `https://app.useseconds.com${location.pathname}`
											}}
										/>
									)}
								</Router>
							</IntercomProvider>
						</TabContext.Provider>
					</ThemeProvider>
				</MagicBellProvider>
			</AmplifyContextProvider>
		</GeolocationContextProvider>
	);
}

export default App;
