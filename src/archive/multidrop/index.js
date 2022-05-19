import dayjs from 'dayjs';
import { createMultiDropJob, setBatch } from '../../store/actions/delivery';
import CSVUpload from '../../modals/CSVUpload';
import React from 'react';
import MultiDropQuote from '../../modals/MultiDropQuote';
import { addError } from '../../store/actions/errors';

const mutlidrop = () => {
	const confirmMultiDropQuote = () => {
		showMultiDropDialog(false);
		setLoadingText('Creating Order');
		showConfirmDialog(false);
		setLoadingModal(true);
		dispatch(createMultiDropJob(deliveryParams, apiKey))
			.then(
				({
					 jobSpecification: {
						 deliveries,
						 orderNumber,
						 pickupLocation: { fullAddress: pickupAddress },
						 pickupStartTime
					 },
					 selectedConfiguration: { deliveryFee, providerId }
				 }) => {
					let {
						dropoffLocation: { fullAddress: dropoffAddress },
						dropoffEndTime,
						orderReference: customerReference
					} = deliveries[0];
					let newJob = {
						orderNumber,
						customerReference,
						pickupAddress,
						dropoffAddress,
						pickupFrom: dayjs(pickupStartTime).format('DD-MM-YYYY HH:mm:ss'),
						deliverUntil: dayjs(dropoffEndTime).format('DD-MM-YYYY HH:mm:ss'),
						deliveryFee,
						courier: providerId.replace(/_/g, ' ')
					};
					setLoadingModal(false);
					setJob(newJob);
					handleOpen();
				}
			)
			.catch(err => {
				setLoadingModal(false);
				console.log(err);
				err ? dispatch(addError(err.message)) : dispatch(addError('Api endpoint could not be accessed!'));
			});
	};
	return (
		<>
			<MultiDropQuote show={multiDropDialog} toggleShow={showMultiDropDialog} numDropoffs={dropoffs.length} confirm={confirmMultiDropQuote} />
			<CSVUpload
				show={uploadCSV}
				ref={csvUploadRef}
				hide={() => showCSVUpload(false)}
				handleRemoveFile={() => console.log('File removed')}
				handleOnError={err => console.log(err)}
				handleOnDrop={drops => {
					let dropoff = {};
					let { data: keys } = drops.shift();
					if (drops.length > 8) {
						drops = drops.slice(0, 8);
						setToast(`Multi-drop only supports a maximum of 8 dropoffs`);
					}
					keys.forEach(key => (dropoff[key] = ''));
					let dropoffs = drops.map(({ data }) => {
						let dropoff = {};
						data.forEach((item, index) => {
							let key = keys[index];
							if (key === 'packageDropoffEndTime') {
								item = dayjs(item, 'DD/MM/YYYY HH:mm').format();
							}
							dropoff[key] = item;
						});
						return dropoff;
					});
					console.log(dropoffs);
					dispatch(setBatch(dropoffs));
				}}
				handleOpenDialog={res => console.log(res)}
			/>
			<div
				className='btn btn-outline-primary'
				onClick={() =>
					dropoffs.length < 8
						? showDropoffModal(true)
						: setToast(`You cannot add more than 8 dropoff locations per multi drop`)
				}
			>
				Add Dropoff
			</div>
		</>
	);
};
