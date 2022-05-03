import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';

const VehicleSettings = ({ open, onClose }) => {
	return (
		<Modal open={open} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
			<div className='d-flex flex-column mt-4'>
				<div className='my-2 align-items-center'>
					<span className='me-2 workflow-header fs-6'>Min Dispatch Order Amount</span>
					<div className='input-group mt-2' style={{ width: 200 }}>
						<span className='input-group-text'>£</span>
						<input
							defaultValue={0}
							type='number'
							min={0}
							max={100}
							className='form-control'
							aria-label='Amount (to the nearest dollar)'
						/>
					</div>
				</div>
				<div className='align-items-center my-2'>
					<span className='me-2 workflow-header fs-6'>Max Dispatch Order Amount</span>
					<div className='input-group mt-2' style={{ width: 200 }}>
						<span className='input-group-text'>£</span>
						<input
							defaultValue={100}
							type='number'
							min={0}
							max={100}
							className='form-control'
							aria-label='Amount (to the nearest dollar)'
						/>
					</div>
				</div>
				<div className='align-items-center my-2'>
					<span className='me-2 workflow-header fs-6'>Max Transit time</span>
					<div className='input-group mt-2' style={{ width: 200 }}>
						<input
							defaultValue={100}
							type='number'
							min={0}
							max={100}
							className='form-control'
							aria-label='Amount (to the nearest dollar)'
						/>
						<span className='input-group-text'>mins</span>
					</div>
				</div>
			</div>
		</Modal>
	);
};

VehicleSettings.propTypes = {

};

export default VehicleSettings;
