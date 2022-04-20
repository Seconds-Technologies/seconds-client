import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl';
import './assets/fonts/Roboto/Roboto-Regular.ttf';
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { persistor, store } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider, createTheme } from '@mui/material';

import './scss/style.scss';
import "bootstrap/dist/js/bootstrap.min";
import moment from 'moment-timezone';
moment.tz.setDefault('Europe/London');

moment.locale('en', {
	calendar : {
		lastDay : 'LT [, Yesterday]',
		sameDay : 'LT [, Today]',
		nextDay : 'LT [, Tomorrow]',
		lastWeek : 'LT [last] ddd',
		nextWeek : 'LT [next] ddd',
		sameElse : 'L'
	}
});

const theme = createTheme();

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ThemeProvider theme={theme}>
				<Router>
					<App />
				</Router>
				</ThemeProvider>
			</PersistGate>
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);

//@ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
