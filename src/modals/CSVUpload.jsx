import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { CSVReader } from 'react-papaparse';

const CSVUpload = React.forwardRef((props, ref) => (
	<Modal centered show={props.show} contentClassName={"bg-transparent border-0"} onHide={() => props.hide()}>
		<CSVReader
			ref={ref}
			onDrop={props.handleOnDrop}
			onError={props.handleOnError}
			addRemoveButton
			onRemoveFile={props.handleOnRemoveFile}
			style={{
				dropArea: {
					borderColor: 'blue',
					backgroundColor: 'white',
					height: 200,
					borderRadius: 20,
				},
				dropAreaActive: {
					borderColor: 'red',
				},
				dropFile: {
					width: 100,
					height: 120,
					background: '#ccc',
				},
				fileSizeInfo: {
					color: '#fff',
					backgroundColor: '#000',
					borderRadius: 3,
					lineHeight: 1,
					marginBottom: '0.5em',
					padding: '0 0.4em',
				},
				fileNameInfo: {
					color: '#fff',
					backgroundColor: '#eee',
					borderRadius: 3,
					fontSize: 14,
					lineHeight: 1,
					padding: '0 0.4em',
				},
				removeButton: {
					color: 'blue',
				},
				progressBar: {
					backgroundColor: 'pink',
				},
			}}
		>
			<span className="text-muted fs-4">Drop CSV file here or click to upload.</span>
		</CSVReader>
	</Modal>
));

CSVUpload.propTypes = {
	show: PropTypes.bool.isRequired,
	handleOnDrop: PropTypes.func,
	handleRemoveFile: PropTypes.func,
	handleOnError: PropTypes.func,
	handleOpenDialog: PropTypes.func,
};

export default CSVUpload;
