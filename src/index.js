import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import awsconfig from './aws-exports';
import './assets/fonts/Roboto/Roboto-Regular.ttf';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Amplify, { Storage } from 'aws-amplify';
import '@aws-amplify/ui/dist/style.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { persistor, store } from './store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import './scss/style.scss';
import 'bootstrap/dist/js/bootstrap.min';
import moment from 'moment-timezone';

moment.tz.setDefault('Europe/London');

Amplify.configure({
	Auth: {
		mandatorySignIn: false,
		identityPoolId: awsconfig.aws_cognito_identity_pool_id, //REQUIRED - Amazon Cognito Identity Pool ID
		region: awsconfig.aws_cognito_region, // REQUIRED - Amazon Cognito Region
		userPoolId: awsconfig.aws_user_pools_id, //OPTIONAL - Amazon Cognito User Pool ID
		userPoolWebClientId: awsconfig.aws_user_pools_web_client_id //OPTIONAL - Amazon Cognito Web Client ID
	},
	Storage: {
		AWSS3: {
			level: 'public',
			bucket: awsconfig.aws_user_files_s3_bucket, //REQUIRED -  Amazon S3 bucket name
			region: awsconfig.aws_user_files_s3_bucket_region //OPTIONAL -  Amazon service region
		}
	}
});

Storage.configure({
	customPrefix: {
		public: '',
		protected: 'protected/',
		private: 'private/'
	}
});

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Router>
					<App />
				</Router>
			</PersistGate>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

//@ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
