import React from 'react';
import { GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { PATHS } from '../constants';
import { useHistory } from 'react-router-dom';
import { BsKanban } from 'react-icons/bs';
import infinityIcon from '../assets/img/infinity.svg';
import multidropIcon from '../assets/img/multidrop.svg';

const CustomToolbar = ({toggleShow, canOptimize}) => {
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
				onClick={toggleShow}
				startIcon={<img src={infinityIcon} alt={''} width={25} height={25} className={canOptimize ? "img-blue" : "img-grey"}/>}
			>
				<span>Optimize</span>
			</Button>
			<Button
				size='small'
				onClick={toggleShow}
				startIcon={<img src={multidropIcon} alt={''} width={25} height={25} className="img-blue"/>}
			>
				<span>Multi-Drop</span>
			</Button>
		</GridToolbarContainer>
	);
};

export default CustomToolbar;
