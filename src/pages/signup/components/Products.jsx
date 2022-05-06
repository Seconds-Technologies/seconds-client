import React from 'react';
import PropTypes from 'prop-types';
import ProductTile from './ProductTile';

const Products = props => {
	return (
		<div className='container py-4'>
			<div className='row gx-4'>
				<div className='col-xs-12 col md 4'>
					<ProductTile
						title='Connect'
						description='Access any delivery fleet'
						price='Free*'
						commission='We charge you 10% commission from delivery fees'
						caption="Get started in delivery for your business"
					/>
				</div>
				<div className='col-xs-12 col md 4'>
					<ProductTile
						title='Growth'
						description='Manage your own fleet'
						price='£99*'
						commission='We charge you 0.25p per delivery'
						caption="Make delivery your competitive advantage"
					/>
				</div>
				<div className='col-xs-12 col md 4'>
					<ProductTile
						title='Pro'
						description='Scale your own fleet'
						price='£149*'
						commission='We charge you 0.15p per delivery'
						caption="Optimize your entire delivery operations"
					/>
				</div>
			</div>
		</div>
	);
};

Products.propTypes = {};

export default Products;
