import React from 'react';
import PropTypes from 'prop-types';
import { INTEGRATIONS, PATHS } from '../../../../../constants';
import Switch from 'react-switch';
import shopifyLogo from '../../../../../assets/img/shopify.svg';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const onIcon = <div className='switch-icon'>On</div>;
const offIcon = <div className='switch-icon'>Off</div>;

const ShopifyPanel = ({ wrapper, toggle }) => {
	const { isActive } = useSelector(state => state['shopifyStore'])
	const history = useHistory();
	return (
		<div onClick={() => history.push(PATHS.SHOPIFY)} role='button' className={wrapper}>
			<div className='d-flex justify-content-end position-absolute p-3'>
				<Switch
					onColor={'#9FEA86'}
					checkedIcon={onIcon}
					uncheckedIcon={offIcon}
					onChange={(checked, e) => {
						e.stopPropagation();
						toggle({ platform: INTEGRATIONS.SHOPIFY, status: !isActive })
					}}
					handleDiameter={19}
					checked={isActive}
					className='switch-text'
				/>
			</div>
			<div className='d-flex justify-content-center align-items-center bg-white h-100 border p-5 api-wrapper'>
				<img className='img-fluid' width={150} src={shopifyLogo} alt='shopify logo' />
			</div>
		</div>
	);
};

ShopifyPanel.propTypes = {
	wrapper: PropTypes.string.isRequired,
	toggle: PropTypes.func.isRequired
};

export default ShopifyPanel;
