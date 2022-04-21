import React from 'react';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/lib/css/styles.css';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const BrandColorPicker = ({ show, onClose, setBrandColor, brandColor = '#9400D3' }) => {
	const [color, setColor] = useColor('hex', brandColor);

	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		p: 4
	};

	return (
		<Modal
			open={show}
			onClose={() => {
				setBrandColor(color.hex)
				onClose();
			}}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
		>
			<Box sx={style}>
				<ColorPicker width={456} height={228} color={color} onChange={setColor} hideHSV />
			</Box>
		</Modal>
	);
};

BrandColorPicker.propTypes = {};

export default BrandColorPicker;
