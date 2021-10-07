import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from '../pages/dashboard/Dashboard';
import Orders from '../pages/orders/Orders';
import Track from '../pages/track/Track';
import Create from '../pages/create/Create';
import ViewOrder from '../pages/viewOrder/ViewOrder';
import Integrations from '../pages/integration/Integrations';
import PrivateRoute from '../components/PrivateRoute';
import Signup from '../pages/signup/Signup';
import Login from '../pages/login/Login';
import Shopify from '../pages/shopify/Shopify';
import ApiKey from '../pages/apiKey/ApiKey';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/settings/Settings';
import CustomerSupport from '../pages/settings/CustomerSupport';
import PaymentMethod from '../pages/paymentMethod/PaymentMethod';
import { PATHS } from '../constants';
import Subscription from '../pages/subscription/Subscription';

const routes = (
	<Switch>
		<Route exact path='/signup' component={Signup} />
		<Route exact path='/login' component={Login} />
		<PrivateRoute exact path={['/', PATHS.HOME]} component={Dashboard} />
		<PrivateRoute exact path={PATHS.INTEGRATE} component={Integrations} />
		<PrivateRoute exact path={PATHS.API_KEY} component={ApiKey} />
		<PrivateRoute exact path={PATHS.SHOPIFY} component={Shopify} />
		<PrivateRoute path={PATHS.ORDERS} component={Orders} />
		<PrivateRoute path={`${PATHS.VIEW_ORDER}/:orderId`} component={ViewOrder} />
		<PrivateRoute path={PATHS.CREATE} component={Create} />
		<PrivateRoute path={PATHS.TRACK} component={Track} />
		<PrivateRoute path={PATHS.SETTINGS} component={Settings} />
		<PrivateRoute path={PATHS.PROFILE} component={Profile} />
		<PrivateRoute path={PATHS.HELP} component={CustomerSupport} />
		<PrivateRoute path={PATHS.PAYMENT} component={PaymentMethod} />
		<PrivateRoute path={PATHS.SUBSCRIPTION} component={Subscription} />
	</Switch>
);

export default routes;