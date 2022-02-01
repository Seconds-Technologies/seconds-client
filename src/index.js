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
import { ThemeProvider, createTheme, makeStyles } from '@mui/material';

//import "bootstrap/dist/css/bootstrap.min.css";
import './style.scss';
import "bootstrap/dist/js/bootstrap.min";
import moment from 'moment-timezone';
moment.tz.setDefault('Europe/London');

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
