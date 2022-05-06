import React from 'react';
import ProductTile from './ProductTile';
import { SUBSCRIPTION_PLANS } from '../../../constants';

const connect = String(process.env.REACT_APP_STRIPE_CONNECT_KEY);
const growth = String(process.env.REACT_APP_STRIPE_GROWTH_KEY)
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
						price={`Free*`}
						commission='We charge you 10% commission from delivery fees'
						caption="Get started in delivery for your business"
					/>
				</div>
				<div className='col-xs-12 col-md-4'>
					<ProductTile
						lookupKey={growth}
						title='Growth'
						description='Manage your own fleet'
						price={`£99*`}
						commission='We charge you 0.25p per delivery'
						caption="Make delivery your competitive advantage"
					/>
				</div>
				<div className='col-xs-12 col-md-4'>
					<ProductTile
						lookupKey={pro}
						title='Pro'
						description='Scale your own fleet'
						price={`£149*`}
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
