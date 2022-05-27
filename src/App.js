import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
// routes
import routes from './routes/routes';
// layouts
import Sidebar from './layout/sidebar/Sidebar';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { setAuthorizationToken, syncUser } from './store/actions/auth';
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

const token = '8d14f8d9-7027-4af7-8fb2-14ca0712e633';
const inbox = '3793e40e-c090-4412-acd0-7e20a7dc9f8a';
const stuartAppId = process.env.REACT_APP_STUART_APP_ID;
const MAGICBELL_API_KEY = process.env.REACT_APP_MAGIC_BELL_API_KEY

function App() {
	const location = useLocation();
	const dispatch = useDispatch();
	const {
		isAuthenticated,
		user: { id, firstname, lastname, email, subscriptionPlan, fullAddress }
	} = useSelector(state => state['currentUser']);

	useEffect(() => {
		isAuthenticated &&
			dispatch(syncUser(email))
				.then(() => console.log('USER SYNCED'))
				.catch(err => console.error('USER SYNC FAILED!', err));
	}, [isAuthenticated]);

	const theme = createTheme({
		palette: {
			neutral: {
				main: grey,
				contrastText: '#fff'
			}
		}
	});

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
												{isAuthenticated && <Sidebar />}
												<CreateLocation open={isAuthenticated && !fullAddress}  onClose={() => console.log("New Location Created")}/>
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
