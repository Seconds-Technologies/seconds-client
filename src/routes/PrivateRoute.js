import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute ({component: Component, ...rest}) {
	const { isAuthenticated } = useSelector(state => state['currentUser']);
	return (
		<Route
			{...rest}
			render={props => isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
		}>
		</Route>
	);
};

export default PrivateRoute;
