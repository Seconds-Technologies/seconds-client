import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PATHS } from '../constants';
import Dashboard from '../pages/dashboard/Dashboard';
import Orders from '../pages/orders/Orders';
import Track from '../pages/track/Track';
import Create from '../pages/create/Create';
import ViewOrder from '../pages/viewOrder/ViewOrder';
import Integrations from '../pages/settings/containers/integrations/Integrations';
import PrivateRoute from './PrivateRoute';
import Signup from '../pages/signup/Signup';
import Signup1 from '../pages/signup/Signup1';
import Signup2 from '../pages/signup/Signup2';
import Login from '../pages/login/Login';
import Profile from '../pages/settings/containers/profile/Profile';
import Settings from '../pages/settings/Settings';
import Billing from '../pages/settings/containers/billing/Billing';
import ForgotPassword from '../pages/forgotPassword/ForgotPassword';
import ResetPassword from '../pages/resetPassword/ResetPassword';
import Shopify from '../pages/shopify/Shopify';
import WooCommerce from '../pages/wooCommerce/WooCommerce';
import Square from '../pages/square/Square';
import SquareSpace from '../pages/squarespace/SquareSpace';
import HubRise from '../pages/hubrise/HubRise';
import Catalog from '../pages/catalog/Catalog';
import Drivers from '../pages/drivers/Drivers';
import Analytics from '../pages/analytics/Analytics';
import Stuart from '../pages/couriers/Stuart';
import Gophr from '../pages/couriers/Gophr';
import StreetStream from '../pages/couriers/StreetStream';
import Ecofleet from '../pages/couriers/Ecofleet';
import AddisonLee from '../pages/couriers/AddisonLee';
import Absolutely from '../pages/couriers/Absolutely';
import HereAndNow from '../pages/couriers/HereAndNow';

const routes = (
	<Switch>
		<Route exact path={PATHS.SIGNUP} component={Signup} />
		<Route path={PATHS.SIGNUP_1} component={Signup1} />
		<Route path={PATHS.SIGNUP_2} component={Signup2} />
		<Route exact path={PATHS.LOGIN} component={Login} />
		<Route exact path={PATHS.FORGOT} component={ForgotPassword} />
		<Route exact path={PATHS.RESET} component={ResetPassword} />
		<PrivateRoute exact path={['/', PATHS.HOME]} component={Dashboard} />
		<PrivateRoute exact path={PATHS.INTEGRATE} component={Integrations} />
		<PrivateRoute exact path={PATHS.SHOPIFY} component={Shopify} />
		<PrivateRoute exact path={PATHS.STUART} component={Stuart} />
		<PrivateRoute exact path={PATHS.GOPHR} component={Gophr} />
		<PrivateRoute exact path={PATHS.STREET_STREAM} component={StreetStream} />
		<PrivateRoute exact path={PATHS.ECOFLEET} component={Ecofleet} />
		<PrivateRoute exact path={PATHS.ADDISON_LEE} component={AddisonLee} />
		<PrivateRoute exact path={PATHS.ABSOLUTELY} component={Absolutely} />
		<PrivateRoute exact path={PATHS.HERE_NOW} component={HereAndNow} />
		<PrivateRoute path={PATHS.SQUARE} component={Square} />
		<PrivateRoute path={PATHS.WOOCOMMERCE} component={WooCommerce} />
		<PrivateRoute path={PATHS.SQUARESPACE} component={SquareSpace} />
		<PrivateRoute exact path={PATHS.HUBRISE} component={HubRise} />
		<PrivateRoute exact path={PATHS.HUBRISE_CATALOG} component={Catalog} />
		<PrivateRoute exact path={PATHS.ORDERS} component={Orders} />
		<PrivateRoute exact path={PATHS.ANALYTICS} component={Analytics} />
		<PrivateRoute path={`${PATHS.VIEW_ORDER}/:orderId`} component={ViewOrder} />
		<PrivateRoute path={PATHS.CREATE} component={Create} />
		<PrivateRoute path={PATHS.TRACK} component={Track} />
		<PrivateRoute path={PATHS.DRIVERS} component={Drivers} />
		<PrivateRoute path={PATHS.SETTINGS} component={Settings} />
		<PrivateRoute path={PATHS.PROFILE} component={Profile} />
		<PrivateRoute path={PATHS.SUBSCRIPTION} component={Billing} />
	</Switch>
);

export default routes;
