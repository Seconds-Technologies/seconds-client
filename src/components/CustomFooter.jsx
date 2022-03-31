import React from 'react';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { GridPagination } from '@mui/x-data-grid';

const CustomFooter = ({ onDelete, title, canDelete }) => {
	return (
		<Box sx={{ padding: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
			{canDelete && <Button
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
				<span className='text-capitalize'>{title}</span>
			</Button>}
			<GridPagination/>
		</Box>
	);
};

CustomFooter.propTypes = {
	onDelete: PropTypes.func,
	title: PropTypes.string,
	canDelete: PropTypes.bool
};

export default CustomFooter;
