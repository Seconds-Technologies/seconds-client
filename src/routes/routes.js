import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from '../pages/dashboard/Dashboard';
import Orders from '../pages/orders/Orders';
import Track from '../pages/track/Track';
import NewOrder from '../pages/newOrder/NewOrder';
import ViewOrder from '../pages/viewOrder/ViewOrder';
import Integrations from '../pages/integration/Integrations';
import PrivateRoute from '../components/PrivateRoute';
import Signup from '../pages/signup/Signup';
import Login from '../pages/login/Login';
import Help from '../pages/Help';
import { PATHS } from '../constants';

const routes = (
	<Switch>
		<Route exact path='/signup' component={Signup} />
		<Route exact path='/login' component={Login} />
		<PrivateRoute exact path={['/', PATHS.HOME]} component={Dashboard} />
		<PrivateRoute path={PATHS.ORDERS} component={Orders} />
		<PrivateRoute path={`${PATHS.VIEW_ORDER}/:orderId`} component={ViewOrder} />
		<PrivateRoute path={PATHS.CREATE} component={NewOrder} />
		<PrivateRoute path={PATHS.TRACK} component={Track} />
		<PrivateRoute path={PATHS.INTEGRATE} component={Integrations} />
		<PrivateRoute path={PATHS.HELP} component={Help} />
	</Switch>
);

export default routes;