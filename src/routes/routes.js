import React from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import Orders from "../pages/orders/Orders";
import ViewOrder from "../pages/viewOrder/ViewOrder";
import Shopify from "../pages/shopify/Shopify";
import Products from "../pages/products/Products";
import PrivateRoute from "../Components/PrivateRoute";
import Signup from "../pages/signup/Signup";
import Login from "../pages/login/Login";
import EditProduct from "../pages/viewProduct/EditProduct";
import Help from "../pages/help/Help"

const routes = (
	<Switch>
		<Route exact path="/signup" component={Signup}/>
		<Route exact path="/login" component={Login}/>
		<PrivateRoute exact path={["/", "/home"]} component={Dashboard}/>
		<PrivateRoute path="/orders" component={Orders}/>
		<PrivateRoute path="/products" component={Products}/>
		<PrivateRoute path="/viewOrders/:orderId" component={ViewOrder}/>
		<PrivateRoute path="/editProducts/:productId" component={EditProduct}/>
		<PrivateRoute path="/shopifyLogIn" component={Shopify}/>
		<PrivateRoute path="/newproduct" component={Products}/>
		<PrivateRoute path="/help" component={Help}/>
	</Switch>
);

export default routes;