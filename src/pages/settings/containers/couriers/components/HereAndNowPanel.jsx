import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Switch from 'react-switch';
import { offIcon, onIcon, PATHS, PROVIDERS } from '../../../../../constants';
import { useSelector } from 'react-redux';
import hereNowLogo from '../../../../../assets/img/herenow.png';

const HereAndNowPanel = ({ wrapper, toggle, height, width }) => {
	const { activeFleetProviders } = useSelector(state => state['settingsStore']);
	const history = useHistory();
	return (
		<div role='button' className={wrapper}>
			<div className='d-flex justify-content-end position-absolute p-3' style={{ zIndex: 100 }}>
				<Switch
					onColor={'#9FEA86'}
					checkedIcon={onIcon}
					uncheckedIcon={offIcon}
					onChange={() => toggle({ [PROVIDERS.HERE_NOW]: !activeFleetProviders[PROVIDERS.HERE_NOW] })}
					handleDiameter={19}
					checked={activeFleetProviders[PROVIDERS.HERE_NOW]}
					className='switch-text'
					disabled
				/>
			</div>
			<div
				onClick={() => history.push(PATHS.HERE_NOW)}
				className='d-flex justify-content-center align-items-center bg-white border p-5 api-wrapper'
			>
				<img className='' src={hereNowLogo} width={width} height={height} alt='Here and now logo' />
			</div>
		</div>
	);
};

HereAndNowPanel.propTypes = {
	
};

export default HereAndNowPanel;
