import React from 'react';
import PropTypes from 'prop-types';
import { INTEGRATIONS, PATHS } from '../../../../../constants';
import Switch from 'react-switch';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import squarespaceLogo from '../../../../../assets/img/squarespace-logo.svg';

const onIcon = <div className='switch-icon'>On</div>;
const offIcon = <div className='switch-icon'>Off</div>;

const SquarespacePanel = ({ wrapper, toggle }) => {
	const { isActive, credentials } = useSelector(state => state['squarespaceStore'])
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
						toggle({ platform: INTEGRATIONS.SQUARESPACE, status: !isActive })
					}}
					handleDiameter={19}
					checked={isActive}
					className='switch-text'
					disabled={!credentials.secretKey}
				/>
			</div>
			<div onClick={() => history.push(PATHS.SQUARESPACE)} className='d-flex justify-content-center align-items-center bg-white h-100 border p-1 api-wrapper'>
				<img className='img-fluid' width={250} src={squarespaceLogo} alt='squarespace logo' />
			</div>
		</div>
	);
};

SquarespacePanel.propTypes = {
	wrapper: PropTypes.string.isRequired,
	toggle: PropTypes.func.isRequired
};

export default SquarespacePanel;
