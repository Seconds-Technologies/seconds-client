// import "bootstrap";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { persistor, store } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

//import "bootstrap/dist/css/bootstrap.min.css";
import '../src/style..scss';
import "bootstrap/dist/js/bootstrap.min";

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
	document.getElementById("root")
);
