import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { Steps } from 'intro.js-react';
// routes
import routes from './routes/routes';
import { PATHS } from './constants';
// layouts
import Sidebar from './layout/sidebar/Sidebar';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { setAuthorizationToken, syncUser, updateCurrentUser, updateProfile } from './store/actions/auth';
import { ChatWidget } from '@papercups-io/chat-widget';
import CreateLocation from './modals/CreateLocation';
// material UI
import { createTheme, ThemeProvider } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
// contexts
import { IntercomProvider } from 'react-use-intercom';
import { MagicBellProvider } from '@magicbell/magicbell-react';
import GeolocationContextProvider from './context/GeolocationContext';
import AmplifyContextProvider from './context/AmplifyContext';
import ProductContextProvider from './context/ProductContext';
import TabContextProvider from './context/TabContext';
import KanaProvider from './context/KanaContext';

if (localStorage.getItem('jwt_token')) {
	setAuthorizationToken(localStorage.getItem('jwt_token'));
}

const MAGICBELL_API_KEY = process.env.REACT_APP_MAGIC_BELL_API_KEY

function App() {
	const location = useLocation();
	const dispatch = useDispatch();
	const [hintsEnabled, setHintsEnabled] = useState(false);
	const [steps, setSteps] = useState([
		{
			intro: 'Welcome to the Seconds dashboard. Lets walk you through the basics'
		},
		{
			element: '.featured-container',
			intro: 'Here you can see your delivery overview with all the essential information'
		},
		{
			element: '#time-filter',
			intro: 'You can filter the stats based on time period here'
		},
		{
			element: '.map-container',
			intro: "Here we show an interactive map of your store's location. The map will populate with markers as new orders come in"
		},
		{
			intro: "Click the 'Orders' icon in the sidebar to continue the tour"
		}
	]);
	const {
		isAuthenticated,
		user: { id, firstname, lastname, email, subscriptionPlan, fullAddress, lastLogin }
	} = useSelector(state => state['currentUser']);

	useEffect(() => {
		isAuthenticated &&
			dispatch(syncUser(email))
				.then(() => console.log('USER SYNCED'))
				.catch(err => console.error('USER SYNC FAILED!', err));
	}, [isAuthenticated]);

	const token = '8d14f8d9-7027-4af7-8fb2-14ca0712e633';
	const inbox = '3793e40e-c090-4412-acd0-7e20a7dc9f8a';
	const stuartAppId = process.env.REACT_APP_STUART_APP_ID;

	const stepsRef = useRef(null);

	const theme = createTheme({
		palette: {
			neutral: {
				main: grey,
				contrastText: '#fff'
			}
		}
	});

	const stepsEnabled = useMemo(() => {
		return Boolean(isAuthenticated && fullAddress && !lastLogin && location.pathname === PATHS.HOME);
	}, [isAuthenticated, fullAddress, lastLogin, location]);

	const onBeforeChange = useCallback(
		nextStepIndex => {
			if (nextStepIndex === 4) {
				setHintsEnabled(true);
				stepsRef.current.updateStepElement(nextStepIndex);
			}
		},
		[stepsRef]
	);

	return (
		<GeolocationContextProvider>
			<AmplifyContextProvider>
				<KanaProvider>
					<MagicBellProvider
						userExternalId={id}
						apiKey={MAGICBELL_API_KEY}
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
							<ProductContextProvider>
								<TabContextProvider>
									<IntercomProvider appId={stuartAppId} shouldInitialize={process.env.NODE_ENV === 'production'}>
										<Router>
											<div className='app-container'>
												{isAuthenticated && <Sidebar hintsEnabled={hintsEnabled} />}
												<CreateLocation open={isAuthenticated && !fullAddress} onClose={() => console.log('closing modal...')} />
												<Steps
													ref={stepsRef}
													enabled={stepsEnabled}
													steps={steps}
													initialStep={0}
													onBeforeChange={onBeforeChange}
													onExit={() => {
														setHintsEnabled(false);
														dispatch(
															updateProfile({
																id,
																lastLogin: dayjs().format()
															})
														).then(() => dispatch(updateCurrentUser({ lastLogin: dayjs().format() })));
													}}
													options={{
														hideNext: true,
														exitOnOverlayClick: false,
														showStepNumbers: true,
														showBullets: false,
														showProgress: true,
														skipLabel: 'Skip'
													}}
												/>
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
															width: 50,
															height: 50,
															marginRight: 10
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
								</TabContextProvider>
							</ProductContextProvider>
						</ThemeProvider>
					</MagicBellProvider>
				</KanaProvider>
			</AmplifyContextProvider>
		</GeolocationContextProvider>
	);
}

export default App;
