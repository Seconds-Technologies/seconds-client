import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PATHS } from '../constants';
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
import Subscription from '../pages/subscription/Subscription';
import ForgotPassword from '../pages/forgotPassword/ForgotPassword';
import ResetPassword from '../pages/resetPassword/ResetPassword';
import Couriers from '../pages/couriers/Couriers';
import DeliveryTimes from '../pages/deliveryTimes/DeliveryTimes';
import MultiDrop from '../pages/multiDrop/MultiDrop';
import Square from '../pages/square/Square';
import Signup1 from '../pages/signup/Signup1';
import Signup2 from '../pages/signup/Signup2';

const routes = (
	<Switch>
		<Route exact path={PATHS.SIGNUP} component={Signup} />
		<Route exact path={PATHS.SIGNUP_1} component={Signup1} />
		<Route exact path={PATHS.SIGNUP_2} component={Signup2} />
		<Route exact path={PATHS.LOGIN} component={Login} />
		<Route exact path={PATHS.FORGOT} component={ForgotPassword} />
		<Route exact path={PATHS.RESET} component={ResetPassword} />
		<PrivateRoute exact path={['/', PATHS.HOME]} component={Dashboard} />
		<PrivateRoute exact path={PATHS.INTEGRATE} component={Integrations} />
		<PrivateRoute exact path={PATHS.API_KEY} component={ApiKey} />
		<PrivateRoute exact path={PATHS.SHOPIFY} component={Shopify} />
		<PrivateRoute path={PATHS.SQUARE} component={Square} />
		<PrivateRoute path={PATHS.ORDERS} component={Orders} />
		<PrivateRoute path={`${PATHS.VIEW_ORDER}/:orderId`} component={ViewOrder} />
		<PrivateRoute exact path={PATHS.CREATE} component={Create} />
		<PrivateRoute exact path={PATHS.MULTI} component={MultiDrop} />
		<PrivateRoute path={PATHS.TRACK} component={Track} />
		<PrivateRoute path={PATHS.COURIERS} component={Couriers} />
		<PrivateRoute path={PATHS.SETTINGS} component={Settings} />
		<PrivateRoute path={PATHS.PROFILE} component={Profile} />
		<PrivateRoute path={PATHS.HELP} component={CustomerSupport} />
		<PrivateRoute path={PATHS.DELIVERY_TIMES} component={DeliveryTimes} />
		<PrivateRoute path={PATHS.PAYMENT} component={PaymentMethod} />
		<PrivateRoute path={PATHS.SUBSCRIPTION} component={Subscription} />
	</Switch>
);

export default routes;