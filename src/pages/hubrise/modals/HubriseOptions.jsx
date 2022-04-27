import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FieldArray, Form, Formik } from 'formik';
// material UI components
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { BsInfoCircle } from 'react-icons/bs';
import Switch from 'react-switch';
//constants
import { HUBRISE_ORDER_STATUSES } from '../../../constants';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { capitalize } from '../../../helpers';
import { OutlinedInput } from '@mui/material';
import { useSelector } from 'react-redux';

const onIcon = <div className='switch-icon'>On</div>;
const offIcon = <div className='switch-icon'>Off</div>;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250
		}
	}
};

const HubriseOptions = ({ show, centered, onHide, onSubmit }) => {
	const { options } = useSelector(state => state['hubriseStore'])
	const [serviceType, setServiceType] = useState('');
	return (
		<Modal show={show} onHide={onHide} centered={centered} size='lg'>
			<Modal.Header closeButton>
				<Modal.Title>Hubrise Workflow</Modal.Title>
			</Modal.Header>
			<Modal.Body className='d-flex justify-content-center align-items-center border-0'>
				<Formik
					initialValues={options}
					onSubmit={onSubmit}
				>
					{({ values, errors, handleBlur, setFieldValue }) => (
						<Form className='container w-100'>
							<div>
								<h1 className='workflow-header fs-5'>Enable Triggers</h1>
								<p className='text-muted'>Set which order statuses / service types should trigger deliveries to be created on our platform</p>
								<div className='d-flex flex-grow-1 align-items-center'>
									<Switch
										onColor={'#9FEA86'}
										checkedIcon={onIcon}
										uncheckedIcon={offIcon}
										onChange={() => setFieldValue('triggers.enabled', !values.triggers.enabled)}
										handleDiameter={19}
										checked={values.triggers.enabled}
										className='switch-text'
									/>
								</div>
							</div>
							<div className='d-flex align-items-center'>
								<header className='my-3'>
									<span className='me-2 workflow-header fs-6'>Customize triggers</span>
								</header>
								<Tooltip
									title='Set which order statuses / service types should trigger deliveries to be created'
									placement='right-start'
								>
									<IconButton size='small'>
										<BsInfoCircle />
									</IconButton>
								</Tooltip>
							</div>
							<FieldArray
								name='triggers.serviceTypeRefs'
								render={arrayHelpers => (
									<div className='row flex align-items-center'>
										<label htmlFor='' className='col-sm-3 col-form-label'>
											Service Type Ref
										</label>
										<div className='col-sm-6'>
											<input
												type='text'
												onChange={e => setServiceType(e.target.value)}
												onBlur={handleBlur}
												className='form-control rounded-3'
												disabled={!values.triggers.enabled}
												value={serviceType}
											/>
										</div>
										<div className='col-sm-3'>
											<button
												disabled={!values.triggers.enabled || !serviceType}
												type='button'
												className='btn btn-outline-primary'
												onClick={() => {
													arrayHelpers.push(serviceType);
													setServiceType('');
												}}
											>
												{/* show this when user has removed all friends from the list */}
												Add Service Type
											</button>
										</div>
										<div className='col-12'>
											<Stack className='flex align-items-center' direction='row' spacing={1} mt={2}>
												<label htmlFor='' className='col-form-label'>
													Active service types:
												</label>
												{values.triggers.serviceTypeRefs.map((status, index) => (
													<Chip
														size='small'
														key={index}
														label={status}
														variant='outlined'
														onDelete={() => arrayHelpers.remove(index)}
													/>
												))}
											</Stack>
										</div>
									</div>
								)}
							/>
							<div className='row mb-3 flex align-items-center'>
								<label htmlFor='' className='col-sm-3 col-form-label'>
									Order statuses
								</label>
								<div className='col-sm-9 py-1'>
									<FormControl sx={{ m: 1, width: 300 }} size='small'>
										<InputLabel id='demo-multiple-name-label'>Status</InputLabel>
										<Select
											disabled={!values.triggers.enabled}
											labelId='demo-multiple-name-label'
											id='demo-multiple-name'
											multiple
											value={values.triggers.statuses}
											onChange={event => {
												const {
													target: { value }
												} = event;
												setFieldValue(
													'triggers.statuses',
													// On autofill we get a stringified value.
													typeof value === 'string' ? value.split(',') : value
												);
											}}
											input={<OutlinedInput label='Status' />}
											MenuProps={MenuProps}
										>
											{Object.values(HUBRISE_ORDER_STATUSES).map((status, index) => (
												<MenuItem key={index} value={status}>
													{capitalize(status.replaceAll('_', ' '))}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									{/*{Object.values(HUBRISE_ORDER_STATUSES).map((status, index) => (
												<div key={index} className='form-check'>
													<input className='form-check-input' type='checkbox' disabled={!values.triggers.enabled} />
													<label className='form-check-label' htmlFor='flexCheckDefault'>
														{status}
													</label>
												</div>
											))}*/}
								</div>
							</div>
							<div className='d-flex py-2'>
								<Button size='lg' type='submit' style={{ width: 150 }}>
									Save
								</Button>
							</div>
						</Form>
					)}
				</Formik>
			</Modal.Body>
		</Modal>
	);
};

HubriseOptions.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	centered: PropTypes.bool
};

export default HubriseOptions;
