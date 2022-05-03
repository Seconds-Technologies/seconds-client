import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Switch from 'react-switch';
import { offIcon, onIcon, PATHS, PROVIDERS } from '../../../../../constants';
import gophrLogo from '../../../../../assets/img/gophr-logo.png';
import { useSelector } from 'react-redux';

const GophrPanel = ({ wrapper, toggle }) => {
	const { activeFleetProviders } = useSelector(state => state['settingsStore']);
	const history = useHistory();
	return (
		<div role='button' className={wrapper}>
			<div className='d-flex justify-content-end position-absolute p-3' style={{ zIndex: 100 }}>
				<Switch
					onColor={'#9FEA86'}
					checkedIcon={onIcon}
					uncheckedIcon={offIcon}
					onChange={() => toggle({ [PROVIDERS.GOPHR]: !activeFleetProviders[PROVIDERS.GOPHR] })}
					handleDiameter={19}
					checked={activeFleetProviders[PROVIDERS.GOPHR]}
					className='switch-text'
				/>
			</div>
			<div
				onClick={() => history.push(PATHS.GOPHR)}
				className='d-flex justify-content-center align-items-center bg-white border p-5 api-wrapper'
			>
				<img className='img-fluid' src={gophrLogo} alt='gophr logo' />
			</div>
		</div>
	);
};

GophrPanel.propTypes = {
	
};

export default GophrPanel;
