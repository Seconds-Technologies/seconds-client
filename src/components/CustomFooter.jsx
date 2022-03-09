import React from 'react';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

const CustomFooter = ({ onDelete }) => {
	return (
		<Box sx={{ padding: '10px', display: 'flex' }}>
			<Button
				size='medium'
				onClick={onDelete}
				variant='outlined'
				color='error'
				startIcon={
					<DeleteIcon
						fontSize='medium'
						color='error'
					/>
				}
			>
				<span className='text-capitalize'>Bulk Delete</span>
			</Button>
		</Box>
	);
};

CustomFooter.propTypes = {
	onDelete: PropTypes.func.isRequired,
};

export default CustomFooter;
