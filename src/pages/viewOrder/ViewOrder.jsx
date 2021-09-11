import "./viewOrder.css";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { apiCall } from "../../api";
import { Formik } from "formik";
import ProductItem from "../../components/ProductItem";
import classnames from "classnames";
import { updateOrderStatus } from "../../store/actions/shopify";

export default function ViewOrder() {
	const dispatch = useDispatch();
	const location = useLocation();
	const allOrders = useSelector(state => state["shopifyOrders"].allOrders);
	const { baseURL, accessToken } = useSelector(state => state["shopifyUser"].credentials);
	const { email } = useSelector(state => state["currentUser"].user);
	const [order, setOrder] = useState({});
	const [show, setShow] = useState(false);
	const [products, setProducts] = useState([]);
	const [total, setQuantity] = useState(0);

	const statusBtn = classnames({
		orderAddButton: true,
		"me-3": true,
		unpacked: order.status === "Unpacked",
		inProgress: order.status === "In Progress",
		completed: order.status === "Completed",
	});

	useEffect(() => {
		(async () => {
			const orderID = Number(location["pathname"].split('/').reverse()[0]);
			let currentOrder = allOrders
				.filter(order => order["order_number"] === orderID)
				.map(order => {
					if (order["order_number"] === orderID) {
						let fullName = `${order["customer"]["first_name"]} ${order["customer"]["last_name"]}`;
						let email = order["customer"]["email"];
						let phone = order["customer"]["phone"];
						let { address1, city, zip } = order["shipping_address"];
						let address = `${address1} ${city} ${zip}`;
						return {
							id: order["id"],
							orderNumber: order["order_number"],
							fullName,
							email,
							phone,
							address,
							status: order["status"],
							items: order["line_items"],
						};
					}
				})[0];
			console.log(currentOrder);
			setOrder(currentOrder);
			let products = await Promise.all(
				currentOrder.items.map(async ({ product_id: id, title, quantity }) => {
					setQuantity(prevState => prevState + quantity);
					let image = await apiCall("POST", "/server/shopify/product-image", { baseURL, accessToken, id });
					return { title, quantity, img: image["src"] };
				})
			);
			setProducts(products);
		})();
	}, []);

	return (
		<div className='viewOrder'>
			<div className='orderDetailsTitleContainer'>
				<h2 className='orderTitle'>Order Details</h2>
			</div>
			<div className='orderContainer'>
				<div className='orderShow'>
					<div className='orderShowTop'>
						<span className='orderShowCustomerName'>{order.fullName}</span>
					</div>
					<div className='orderShowBottom'>
						<span className='orderShowTitle'>Order Details</span>
						<div className='orderShowInfo'>
							<h4 className='orderShowLabel'>Order ID:</h4>
							<span className='orderShowInfoTitle'>{order.orderNumber}</span>
						</div>
						<div className='orderShowInfo'>
							<h4 className='orderShowLabel'>Email:</h4>
							<span className='orderShowInfoTitle'>{Boolean(order.email) ? order.email : "N/A"}</span>
						</div>
						<div className='orderShowInfo'>
							<h4 className='orderShowLabel'>Phone Number:</h4>
							<span className='orderShowInfoTitle'>{Boolean(order.phone) ? order.phone : "N/A"}</span>
						</div>
						<div className='orderShowInfo'>
							<h4 className='orderShowLabel'>Address:</h4>
							<span className='orderShowInfoTitle'>{Boolean(order.address) ? order.address : "N/A"}</span>
						</div>
						<div className='orderShowInfo'>
							<h4 className='orderShowLabel'>Items:</h4>
							<span className='orderShowInfoTitle'>{total}</span>
						</div>
						<div className='d-flex flex-row align-items-center'>
							<button className={statusBtn} disabled>
								<span>{order.status}</span>
							</button>
							<div className='d-block w-100'>
								<Formik
									enableReinitialize
									initialValues={{
										status: order.status,
									}}
									onSubmit={async values => {
										if (order.status !== values.status) {
											try {
												dispatch(updateOrderStatus(order.id, email, values.status, order.status))
												setShow(true);
											} catch (err) {
												alert(err);
											}
										}
									}}
								>
									{({ values, handleSubmit, handleBlur, handleChange }) => (
										<form action='' onSubmit={handleSubmit}>
											<div className='d-flex flex-row align-items-center py-2'>
												<select
													value={values.status}
													className='form-select'
													name='status'
													onBlur={handleBlur}
													onChange={event => {
														handleChange(event);
														handleSubmit(event);
													}}
												>
													<option value='Unpacked'>Unpacked</option>
													<option value='In Progress'>In Progress</option>
													<option value='Completed'>Completed</option>
												</select>
											</div>
										</form>
									)}
								</Formik>
							</div>
						</div>
						<div className="d-block flex-grow-1 justify-content-center pt-3">
							{show && <div className="alert alert-success alert-dismissible fade show" role="alert">
								<h2 className="text-center">Order updated</h2>
								<button type="button" className="btn btn-close" data-bs-dismiss="alert" aria-label="Close"/>
							</div>}
						</div>
					</div>
				</div>
				<div className='orderUpdate'>
					<h3 className='orderUpdateTitle'>Products Ordered</h3>
					{products.map(({ title, img, quantity }, index) => (
						<ProductItem key={index} img={img} title={title} quantity={quantity} />
					))}
				</div>
			</div>
		</div>
	);
}
