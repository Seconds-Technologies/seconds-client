import React, { useState } from 'react';
import { EditableInput, Hue } from 'react-color/lib/components/common';
import BrandColorPicker from '../../components/BrandColorPicker';

const Branding = props => {
	const [brandColor, setBrandColor] = useState('#9400D3');
	const [colorPicker, toggleColorPicker] = useState(false);

	const styles = {
		input: {
			height: 34,
			border: `1px solid ${brandColor}`,
			paddingLeft: 10,
		},
		swatch: {
			width: 54,
			height: 34,
			background: brandColor,
		},
	}

	return (
		<div className='tab-container container-fluid p-5'>
			<div>
				<h1>Please upgrade your plan to be able to change the branding</h1>
			</div>
			<div className='mb-3'>
				<span className='fs-1 my-1 font-semibold'>Your business logo</span>
				<p>Your brand logo will be in the dashboard and customer tracking link</p>
				<button type='button' className='btn btn-outline-secondary btn-sm' style={{ width: 130 }}>
					Change
				</button>
			</div>
			<div className='mb-3'>
				<span className='fs-1 my-1 font-semibold'>Primary brand colour</span>
				<p>Your primary colour will be in the dashboard and customer tracking link</p>
				<div
					className='d-flex'
					role='button'
					onClick={() => toggleColorPicker(true)}
				>
					{/*<div style={{ backgroundColor: brandColor, width: 20, height: 20 }} />
					<span>{brandColor}</span>*/}
					<EditableInput style={{ input: styles.input }} value={brandColor} onChange={setBrandColor} />
					<div style={ styles.swatch } />
				</div>
				<BrandColorPicker show={colorPicker} onClose={() => toggleColorPicker(false)} brandColor={brandColor} setBrandColor={setBrandColor} />
			</div>
			<div className='mb-5'>
				<span className='fs-1 my-1 font-semibold'>Customer SMS</span>
				<p>Please contact support@useseconds.com to customize the SMS</p>
			</div>
			<div className='d-flex'>
				<button
					className='btn btn-dark me-5'
					style={{
						height: 50,
						width: 150
					}}
				>
					Cancel
				</button>
				<button
					className='btn btn-primary'
					style={{
						height: 50,
						width: 150
					}}
				>
					Save
				</button>
			</div>
		</div>
	);
};

Branding.propTypes = {};

export default Branding;
