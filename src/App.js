import React, { useState } from 'react';
import routes from './routes/routes';
import Topbar from './components/topbar/Topbar';
import Sidebar from './components/sidebar/Sidebar';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setAuthorizationToken } from './store/actions/auth';
import GeolocationContextProvider from './context/GeolocationContext';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';

if (localStorage.getItem('jwt_token')) {
	setAuthorizationToken(localStorage.getItem('jwt_token'));
}

function App() {
	const { isAuthenticated } = useSelector(state => state['currentUser']);
	console.log("isAuthenticated:", isAuthenticated);
	return (
		<GeolocationContextProvider>
			<Router>
				{isAuthenticated && <Topbar/>}
				<div className='app-container'>
					{isAuthenticated && <Sidebar />}
					{routes}
				</div>
			</Router>
		</GeolocationContextProvider>
	);
}

export default App;
