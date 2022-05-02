import React, { useState } from 'react';
import { EditableInput } from 'react-color/lib/components/common';
import BrandColorPicker from './components/BrandColorPicker';

const Branding = props => {
	const [brandColor, setBrandColor] = useState('#9400D3');
	const [colorPicker, toggleColorPicker] = useState(false);

	const styles = {
		input: {
			height: 34,
			border: `1px solid ${brandColor}`,
			paddingLeft: 10
		},
		swatch: {
			width: 54,
			height: 34,
			background: brandColor
		}
	};

	return (
		<div className='tab-container px-3'>
			<div className='container-fluid'>
				<div className='mb-4'>
					<h1 className='workflow-header fs-4'>Your business logo</h1>
					<p className='text-muted'>Your brand logo will be in the dashboard and customer tracking link</p>
					<button type='button' className='btn btn-outline-secondary btn-sm' style={{ width: 130 }}>
						Change
					</button>
				</div>
				<div className='mb-4'>
					<h1 className='workflow-header fs-4'>Primary brand colour</h1>
					<p className='text-muted'>Your primary colour will be in the dashboard and customer tracking link</p>
					<div className='d-flex' role='button' onClick={() => toggleColorPicker(true)}>
						<EditableInput style={{ input: styles.input }} value={brandColor} onChange={setBrandColor} />
						<div style={styles.swatch} />
					</div>
					<BrandColorPicker
						show={colorPicker}
						onClose={() => toggleColorPicker(false)}
						brandColor={brandColor}
						setBrandColor={setBrandColor}
					/>
				</div>
				<div className='mb-5'>
					<h1 className='workflow-header fs-4'>Customer SMS</h1>
					<p className='text-muted'>Please contact <strong>support@useseconds.com</strong> to customize the SMS</p>
				</div>
				<div className='d-flex'>
					<button
						className='btn btn-dark me-5'
						style={{ height: 45, width: 150 }}
					>
						Cancel
					</button>
					<button
						className='btn btn-primary'
						style={{ height: 45, width: 150 }}
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

Branding.propTypes = {};

export default Branding;
