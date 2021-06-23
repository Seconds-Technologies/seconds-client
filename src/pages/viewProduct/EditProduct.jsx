import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./editProduct.css";
import { Formik } from "formik";
import { apiCall } from "../../api";

export default function EditProduct() {
	const location = useLocation();
	const [product, setProduct] = useState({});
	const [show, setShow] = useState(false);
	const allProducts = useSelector(state => state["shopifyProducts"]);
	const { email } = useSelector(state => state["currentUser"].user);

	useEffect(() => {
		(async () => {
			const productID = location["state"].id;
			console.log("PRODUCT ID:", productID);
			let currentProduct = allProducts.filter(product => product["id"] === productID).map(product => {
				if (product["id"] === productID) {
					let { status, title, images, variants } = product;
					let { inventory_quantity: stock } = variants[0];
					let { src: img } = images[0];
					return { id: productID, status, title, stock, img };
				}
			})[0];
			console.log(currentProduct);
			setProduct({ ...currentProduct });
		})();
	}, []);

	return (
		<div className="viewProduct">
			<div className="productDetailsTitleContainer">
				<h2 className="productTitle">Product Details</h2>
			</div>
			<div className="productContainer">
				<div className="productShow">
					<div className="productShowTop">
						<span className="productTitle">{product.title}</span>
					</div>
					<div className="productShowBottom">
						<span className="productOptions">Details</span>
						<div className="productShowInfo">
							<h4 className="productShowLabel">Product ID:</h4>
							<span className="productShowInfoTitle">{Boolean(product.id) ? product.id : "N/A"}</span>
						</div>
						<div className="productShowInfo">
							<h4 className="productShowLabel">Status:</h4>
							<span
								className="productShowInfoTitle">{Boolean(product.status) ? product.status : "N/A"}</span>
						</div>
						<div className="productShowInfo">
							<h4 className="productShowLabel">Stock:</h4>
							<span
								className="productShowInfoTitle">{Boolean(product.stock) ? product.stock : 0}</span>
						</div>
					</div>
				</div>
				<div className="productUpdate">
					<div className="container text-center pt-3">
						<h3 className="productUpdateTitle">Edit Product</h3>
						<div className="d-flex justify-content-center align-items-center">
							<img className="productImg" src={product.img} alt="" />
						</div>
						<div className="d-flex flex-row justify-content-center">
							<Formik
								enableReinitialize
								initialValues={{
									status: product.status,
									quantity: product.stock
								}}
								onSubmit={async (values) => {
									try {
										const res = await apiCall("PUT", "/api/shopify/update-product", {
											...values,
											productId: product.id,
											email
										});
										console.log(res);
										setShow(true);
									} catch (err) {
										alert(err);
									}
								}}
							>
								{({
									  values,
									  handleSubmit,
									  handleBlur,
									  handleChange
								  }) => (
									<form action="" onSubmit={handleSubmit}>
										<div className="d-flex flex-row align-items-center py-2">
											<label className="lead pe-4">Change status:</label>
											<select
												value={values.status}
												className="form-select"
												name="status"
												onBlur={handleBlur}
												onChange={handleChange}
											>
												<option value="active">active</option>
												<option value="archived">archived</option>
												<option value="draft">draft</option>
											</select>
										</div>
										<div className="d-flex flex-row align-items-center py-2">
											<label className="lead pe-4">Change quantity:</label>
											<input
												type="number"
												name="quantity"
												defaultValue={product.stock}
												min="0"
												max="100"
												step="1"
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
										<div className="mt-3">
											<button type="submit" className="submitBtn">Confirm</button>
										</div>
									</form>
								)}
							</Formik>
						</div>
						<div className="d-block flex-grow-1 justify-content-center pt-3">
							{show && <div className="alert alert-success alert-dismissible fade show" role="alert">
								<h2 className="text-center">Product updated</h2>
								<button type="button" className="btn btn-close" data-bs-dismiss="alert" aria-label="Close"/>
							</div>}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}