import React from 'react';
import PropTypes from 'prop-types';

const ProductTile = ({ title, description, price, commission, caption }) => {
	return (
		<div className='border px-3 py-5 d-flex flex-column justify-content-around align-items-center'>
			<header className='py-2 fs-1 product-title font-semibold'>
				<span>{title}</span>
			</header>
			<div className='bg-light rounded-3 px-3'>
				<span className='text-primary product-description'>{description}</span>
			</div>
			<span className='font-extrabold product-price'>{price}</span>
			<div className='py-2'>
				<span className='fs-5 font-medium'>month/location</span>
			</div>
			<div className='py-2'>
				<small className='font-medium'>{commission}</small>
			</div>
			<footer>
				<span className='font-bold' style={{ letterSpacing: -0.3 }}>
					{caption}
				</span>
			</footer>
		</div>
	);
};

ProductTile.propTypes = {};

export default ProductTile;
