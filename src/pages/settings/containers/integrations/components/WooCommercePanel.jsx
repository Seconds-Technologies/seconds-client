import React from 'react';
import PropTypes from 'prop-types';
import { INTEGRATIONS, PATHS } from '../../../../../constants';
import Switch from 'react-switch';
import woocommerceLogo from '../../../../../assets/img/woocommerce-logo.svg';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { offIcon, onIcon } from '../../../../../constants/elements';

const WooCommercePanel = ({ wrapper, toggle }) => {
	const { isActive, credentials } = useSelector(state => state['wooCommerceStore'])
	const history = useHistory()
	return (
		<div role='button' className={wrapper}>
			<div className='d-flex justify-content-end position-absolute p-3'>
				<Switch
					onColor={'#9FEA86'}
					checkedIcon={onIcon}
					uncheckedIcon={offIcon}
					onChange={(checked, e) => {
						e.stopPropagation();
						toggle({ platform: INTEGRATIONS.WOOCOMMERCE, status: !isActive })
					}}
					handleDiameter={19}
					checked={isActive}
					className='switch-text'
					disabled={!credentials.consumerSecret}
				/>
			</div>
			<div onClick={() => history.push(PATHS.WOOCOMMERCE)} className='d-flex justify-content-center align-items-center bg-white h-100 border p-1 api-wrapper'>
				<img className='img-fluid' width={175} src={woocommerceLogo} alt='woocommerce logo' />
			</div>
		</div>
	);
};

WooCommercePanel.propTypes = {
	wrapper: PropTypes.string.isRequired,
	toggle: PropTypes.func.isRequired
};

export default WooCommercePanel;
