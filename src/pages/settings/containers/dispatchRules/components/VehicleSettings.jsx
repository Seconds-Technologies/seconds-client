import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import { BsInfoCircle } from 'react-icons/bs';

const style = {
	position: 'absolute',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	borderRadius: 3,
	boxShadow: 24,
	p: 4
};

const VehicleSettings = ({ open, onClose, code, label, onChange, defaultMinDispatch = 0, defaultMaxDispatch = 100, defaultMaxTransitTime = 100 }) => {
	return (
		<Modal open={open} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
			<Box sx={style}>
				<div className='pb-3 d-flex flex-row justify-content-between w-100'>
					<header>
						<h1 className='text-center fs-4'>{label}</h1>
					</header>
					<div className='ms-auto'>
						<IconButton size='small' onClick={onClose}>
							<CloseIcon />
						</IconButton>
					</div>
				</div>
				<div className='my-2 align-items-center'>
					<header className='d-flex align-items-center'>
						<span className='me-2 workflow-header fs-6'>Min Dispatch Order Amount</span>
						<Tooltip title='Minimum order subtotal required to qualify for a Dispatch delivery order.' placement='right-start'>
							<IconButton size='small'>
								<BsInfoCircle />
							</IconButton>
						</Tooltip>
					</header>
					<div className='input-group mt-2' style={{ width: 250 }}>
						<span className='input-group-text'>£</span>
						<input
							defaultValue={defaultMinDispatch}
							name={`courierVehicles.${code}.minDispatchAmount`}
							type='number'
							min={0}
							max={100}
							className='form-control'
							onChange={onChange}
							aria-label='Amount (to the nearest dollar)'
						/>
					</div>
				</div>
				<div className='align-items-center my-2'>
					<header className='d-flex align-items-center'>
						<span className='me-2 workflow-header fs-6'>Max Dispatch Order Amount</span>
						<Tooltip title='Maximum order subtotal required to qualify for a Dispatch delivery order.' placement='right-start'>
							<IconButton size='small'>
								<BsInfoCircle />
							</IconButton>
						</Tooltip>
					</header>
					<div className='input-group mt-2' style={{ width: 250 }}>
						<span className='input-group-text'>£</span>
						<input
							defaultValue={defaultMaxDispatch}
							type='number'
							name={`courierVehicles.${code}.maxDispatchAmount`}
							min={0}
							max={100}
							className='form-control'
							aria-label='Amount (to the nearest dollar)'
							onChange={onChange}
						/>
					</div>
				</div>
				<div className='align-items-center my-2' style={{ width: 250 }}>
					<header className='d-flex align-items-center'>
						<span className='me-2 workflow-header fs-6'>Max Transit time</span>
						<Tooltip
							title='Maximum transit time allowed to deliver food to the customer. Quotes will be rejected by Dispatch if transit time quoted by the DSP is greater than this value'
							placement='right-start'
						>
							<IconButton size='small'>
								<BsInfoCircle />
							</IconButton>
						</Tooltip>
					</header>
					<div className='input-group mt-2'>
						<input
							defaultValue={defaultMaxTransitTime}
							name={`courierVehicles.${code}.maxTransitTime`}
							type='number'
							min={0}
							max={100}
							className='form-control'
							onChange={onChange}
							aria-label='Amount (to the nearest dollar)'
						/>
						<span className='input-group-text'>mins</span>
					</div>
				</div>
			</Box>
		</Modal>
	);
};

VehicleSettings.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	code: PropTypes.string.isRequired
};

export default VehicleSettings;
