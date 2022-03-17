import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useSelector } from 'react-redux';
import { FieldArray, Form, Formik } from 'formik';
import ListItemIcon from '@mui/material/ListItemIcon';

const RouteOptimization = ({ show, onHide, orders, onSubmit }) => {
	const drivers = useSelector(state => state['driversStore']);
	const { deliveryHours } = useSelector(state => state['currentUser'].user);

	return (
		<Modal show={show} onHide={onHide} centered size='lg'>
			<Formik
				enableReinitialize
				initialValues={{
					startTime: moment(deliveryHours[moment().day()].open).format('YYYY-MM-DDTHH:mm'),
					endTime: moment(deliveryHours[moment().day()].close).format('YYYY-MM-DDTHH:mm'),
					breakPeriod: {
						label: '',
						start: '',
						end: '',
						duration: ''
					},
					driverIds: [],
					breakPeriods: [],
					objectives: {
						duration: true,
						mileage: false,
						cost: false
					}
				}}
				onSubmit={onSubmit}
			>
				{({ values, handleBlur, handleChange, setFieldValue }) => (
					<Form>
						<FieldArray
							name='breakPeriods'
							render={arrayHelpers => (
								<div className='container-fluid p-4'>
									<div className='d-flex justify-content-between mb-3'>
										<h1>{`You have selected to optimize ${orders.length} routes`}</h1>
										<button type='button' className='btn-close shadow-none' aria-label='Close' onClick={onHide} />
									</div>
									<div className='row gy-4'>
										<div className='col-6'>
											<label htmlFor=''>Start from</label>
											<input
												defaultValue={values.startTime}
												id='start-time'
												name='startTime'
												type='datetime-local'
												aria-label='start-time'
												className='form-control form-border rounded-3'
												onChange={handleChange}
												onBlur={handleBlur}
												min={moment().set('hour', 0).set('minute', 0).format('YYYY-MM-DDTHH:mm')}
												required
											/>
										</div>
										<div className='col-6'>
											<label htmlFor=''>End at</label>
											<input
												defaultValue={values.endTime}
												name='endTime'
												id='end-time'
												type='datetime-local'
												className='form-control form-border rounded-3'
												aria-label='end-time'
												onChange={handleChange}
												onBlur={handleBlur}
												min={moment(values.startTime).format('YYYY-MM-DDTHH:mm')}
												max={moment(values.startTime).set('hour', 23).set('minute', 59).format('YYYY-MM-DDTHH:mm')}
												required
											/>
										</div>
										<div className='col-6'>
											<h2 className='fs-6'>Specify break periods</h2>
											<p>These are the allocated time slots that drivers can take breaks during their job</p>
											<div className='w-100'>
												<TextField
													name='breakPeriod.label'
													helperText="Enter a useful name for the break period e.g. 'lunch time'"
													id='standard-basic'
													label='Name'
													variant='standard'
													onChange={handleChange}
													onBlur={handleBlur}
												/>
												<div className='d-flex justify-content-center flex-row mb-2'>
													<div className='d-flex flex-column flex-grow-1 me-2'>
														<label htmlFor=''>Start</label>
														<input
															name='breakPeriod.start'
															className='form-control form-control-sm rounded-3'
															type='time'
															aria-label='default input example'
															onChange={handleChange}
															onBlur={handleBlur}
														/>
													</div>
													<div className='d-flex flex-column flex-grow-1 ms-2'>
														<label htmlFor=''>End</label>
														<input
															name='breakPeriod.end'
															className='form-control form-control-sm rounded-3'
															type='time'
															aria-label='default input example'
															onChange={handleChange}
															onBlur={handleBlur}
														/>
													</div>
												</div>
											</div>

											<div className='d-flex justify-content-between align-items-center'>
												<div>
													<label htmlFor=''>Duration (mins)</label>
													<input
														name='breakPeriod.duration'
														className='form-control form-control-sm rounded-3 w-50'
														min={0}
														max={60}
														type='number'
														onChange={handleChange}
														onBlur={handleBlur}
														aria-label='default input example'
													/>
												</div>
											</div>
										</div>
										<div className='col-6'>
											<h2 className='fs-6'>Select driver and vehicle</h2>
											<p>You will be able to assign the optimised orders to drivers with your desired vehicle type</p>
											<FormControl sx={{ m: 1, width: 300 }}>
												<InputLabel id='multiple-checkbox-label'>Select</InputLabel>
												<Select
													name='driverIds'
													labelId='multiple-checkbox-label'
													id='multiple-checkbox'
													multiple
													value={values.driverIds}
													onChange={e => {
														const { value } = e.target;
														if (value[value.length - 1] === 'all') {
															setFieldValue(
																'driverIds',
																values.driverIds.length === drivers.length ? [] : drivers.map(({ id }) => id)
															);
														} else {
															handleChange(e);
														}
													}}
													onBlur={handleBlur}
													input={<OutlinedInput label='Select' />}
													renderValue={selected =>
														selected
															.map(id => {
																const driver = drivers.find(driver => driver.id === id);
																return `${driver.firstname} ${driver.lastname}`;
															})
															.join(', ')
													}
												>
													<MenuItem value='all'>
														<ListItemIcon>
															<Checkbox
																checked={drivers.length > 0 && values.driverIds.length === drivers.length}
																indeterminate={
																	values.driverIds.length > 0 && values.driverIds.length < drivers.length
																}
															/>
														</ListItemIcon>
														<ListItemText primary='Select All' />
													</MenuItem>
													{drivers.map(({ id, firstname, lastname }) => {
														const name = `${firstname} ${lastname}`;
														return (
															<MenuItem key={id} value={id}>
																<Checkbox checked={values.driverIds.indexOf(id) > -1} />
																<ListItemText primary={name} />
															</MenuItem>
														);
													})}
												</Select>
											</FormControl>
											<div className='my-3'>
												<h2 className='fs-6'>Optimisation objectives</h2>
												<div>
													<div className='form-check'>
														<input
															defaultChecked={values.objectives.mileage}
															name='objectives.mileage'
															className='form-check-input'
															type='checkbox'
															id='criteria-radio-1'
															onChange={handleChange}
															onBlur={handleBlur}
														/>
														<label className='form-check-label' htmlFor='exampleRadios1'>
															Minimise drive time
														</label>
													</div>
													<div className='form-check'>
														<input
															defaultChecked={values.objectives.duration}
															className='form-check-input'
															type='checkbox'
															name='objectives.duration'
															id='criteria-radio-2'
															onChange={handleChange}
															onBlur={handleBlur}
														/>
														<label className='form-check-label' htmlFor='exampleRadios2'>
															Arrive on time
														</label>
													</div>
													<div className='form-check'>
														<input
															defaultChecked={values.objectives.cost}
															className='form-check-input'
															type='checkbox'
															name='objectives.cost'
															id='criteria-radio-3'
															onChange={handleChange}
															onBlur={handleBlur}
														/>
														<label className='form-check-label' htmlFor='exampleRadios3'>
															Minimise cost
														</label>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className='d-flex align-items-end justify-content-between'>
										<div className='d-flex flex-row mt-3'>
											{values.breakPeriods.map((item, index) => (
												<Chip
													label={`${item.label}: ${item.start} - ${item.end} (${item.duration} mins)`}
													onDelete={arrayHelpers.remove(index)}
													className='me-2 mb-2'
												/>
											))}
										</div>
										<button type='submit' className='btn btn-lg btn-primary' style={{ width: 130 }}>
											<span>Proceed</span>
										</button>
									</div>
								</div>
							)}
						/>
					</Form>
				)}
			</Formik>
		</Modal>
	);
};

RouteOptimization.propTypes = {};

export default RouteOptimization;
