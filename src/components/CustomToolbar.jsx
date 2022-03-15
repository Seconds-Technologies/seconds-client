import React from 'react';
import PropTypes from 'prop-types';
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
import infinityIcon from '../assets/img/infinity.svg';

const CustomToolbar = ({toggleShow, canOptimize}) => {
	const history = useHistory();
	return (
		<GridToolbarContainer>
			<GridToolbarColumnsButton />
			<GridToolbarFilterButton />
			<GridToolbarDensitySelector />
			<GridToolbarExport />
			<Button size='small' onClick={() => history.push(PATHS.TRACK)} startIcon={<BsKanban size={16} />}>
				<span>Kanban View</span>
			</Button>
			<Button
				disabled={!canOptimize}
				size='small'
				onClick={toggleShow}
				startIcon={<img src={infinityIcon} alt={''} width={25} height={25} className={canOptimize ? "img-blue" : "img-grey"}/>}
			>
				<span>Optimise route</span>
			</Button>
		</GridToolbarContainer>
	);
};

export default CustomToolbar;
