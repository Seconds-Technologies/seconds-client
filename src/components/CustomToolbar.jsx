import React from 'react';
import {
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarExport,
	GridToolbarFilterButton
} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { PATHS } from '../constants';
import { useHistory } from 'react-router-dom';
import { BsKanban } from 'react-icons/bs';

const CustomToolbar = () => {
	const history = useHistory();
	return (
		<GridToolbarContainer>
			<GridToolbarColumnsButton />
			<GridToolbarFilterButton />
			<GridToolbarDensitySelector />
			<GridToolbarExport />
			<Button size="small" onClick={() => history.push(PATHS.TRACK)} startIcon={<BsKanban size={16} />}>
				<span>Kanban View</span>
			</Button>
		</GridToolbarContainer>
	);
};

export default CustomToolbar;
