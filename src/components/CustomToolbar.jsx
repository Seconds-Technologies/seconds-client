import React from 'react';
import { GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { PATHS } from '../constants';
import { useHistory } from 'react-router-dom';
import { BsKanban } from 'react-icons/bs';
import infinityIcon from '../assets/img/infinity.svg';
import multiDropIcon from '../assets/img/multidrop.svg';

const CustomToolbar = ({ canMultiDrop, showMultiDrop, showRouteOpt, canOptimize }) => {
	const history = useHistory();
	return (
		<GridToolbarContainer>
			<GridToolbarFilterButton />
			<GridToolbarExport />
			<Button size='small' onClick={() => history.push(PATHS.TRACK)} startIcon={<BsKanban size={16} />}>
				<span>Kanban</span>
			</Button>
			<Button
				disabled={!canOptimize}
				size='small'
				onClick={showRouteOpt}
				startIcon={<img src={infinityIcon} alt={''} width={25} height={25} className={canOptimize ? 'img-blue' : 'img-grey'} />}
			>
				<span>Optimize</span>
			</Button>
			<Button
				disabled={!canMultiDrop}
				size='small'
				onClick={showMultiDrop}
				startIcon={<img src={multiDropIcon} alt={''} width={25} height={25} className={canMultiDrop ? 'img-blue' : 'img-grey'} />}
			>
				<span>Multi-Drop</span>
			</Button>
		</GridToolbarContainer>
	);
};

export default CustomToolbar;
