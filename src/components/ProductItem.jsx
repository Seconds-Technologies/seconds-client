import React from "react";
import PropTypes from "prop-types";
import "../pages/viewOrder/viewOrder.css";

const ProductItem = ({title, quantity, img }) => {
	return (
		<div className="productItem">
			<img className="productImg"
			     src={img}
			     alt="" />
			<h3 className="productName">{title}</h3>
			<h3 className="productQuantity">{quantity}</h3>
		</div>
	);
};

ProductItem.propTypes = {
	title: PropTypes.string.isRequired,
	quantity: PropTypes.number.isRequired,
	img: PropTypes.string.isRequired
}
export default ProductItem;
