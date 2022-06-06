import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Switch from 'react-switch';
import { PATHS, PROVIDERS } from '../../../../../constants';
import addisonLeeLogo from '../../../../../assets/img/addison-lee-logo.png';
import { useSelector } from 'react-redux';
import { offIcon, onIcon } from '../../../../../constants/elements';

const AddisonLeePanel = ({ wrapper, toggle }) => {
	const { activeFleetProviders } = useSelector(state => state['settingsStore']);
	const history = useHistory();
	return (
		<div role='button' className={wrapper}>
			<div className='d-flex justify-content-end position-absolute p-3' style={{ zIndex: 100 }}>
				<Switch
					onColor={'#9FEA86'}
					checkedIcon={onIcon}
					uncheckedIcon={offIcon}
					onChange={() => toggle({ [PROVIDERS.ADDISON_LEE]: !activeFleetProviders[PROVIDERS.ADDISON_LEE] })}
					handleDiameter={19}
					checked={activeFleetProviders[PROVIDERS.ADDISON_LEE]}
					className='switch-text'
				/>
			</div>
			<div
				onClick={() => history.push(PATHS.ADDISON_LEE)}
				className='d-flex justify-content-center align-items-center bg-white border p-5 api-wrapper'
			>
				<img className='img-fluid' src={addisonLeeLogo} alt='Addison lee logo' />
			</div>
		</div>
	);
};

AddisonLeePanel.propTypes = {
	
};

export default AddisonLeePanel;
