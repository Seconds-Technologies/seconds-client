import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ProductTile from './ProductTile';
import { ProductContext } from '../../../context/ProductContext';
import { SUBSCRIPTION_PLANS } from '../../../constants';

const connect = String(process.env.REACT_APP_STRIPE_CONNECT_KEY)
const growth = String(String(process.env.REACT_APP_STRIPE_GROWTH_KEY))
const pro = String(process.env.REACT_APP_STRIPE_PRO_KEY)

const Products = props => {
	return (
		<div className="container d-flex flex-column flex-grow-1 py-4">
			<div className='row gx-4 flex-grow-1 products-container'>
				<div className='col-xs-12 col-md-4'>
					<ProductTile
						lookupKey={connect}
						title='Connect'
						description='Access any delivery fleet'
						price={`${SUBSCRIPTION_PLANS[connect.toUpperCase()].priceLabel}*`}
						commission='We charge you 10% commission from delivery fees'
						caption="Get started in delivery for your business"
					/>
				</div>
				<div className='col-xs-12 col-md-4'>
					<ProductTile
						lookupKey={growth}
						title='Growth'
						description='Manage your own fleet'
						price={`${SUBSCRIPTION_PLANS[growth.toUpperCase()].priceLabel}*`}
						commission='We charge you 0.25p per delivery'
						caption="Make delivery your competitive advantage"
					/>
				</div>
				<div className='col-xs-12 col-md-4'>
					<ProductTile
						lookupKey={pro}
						title='Pro'
						description='Scale your own fleet'
						price={`${SUBSCRIPTION_PLANS[pro.toUpperCase()].priceLabel}*`}
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
