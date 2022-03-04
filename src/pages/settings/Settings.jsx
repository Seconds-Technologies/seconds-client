import './settings.css';
import React, { useContext, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Mixpanel } from '../../config/mixpanel';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Profile from './containers/profile/Profile';
import Couriers from './containers/couriers/Couriers';
import Integrations from '../integration/Integrations';
import Subscription from './containers/subscription/Subscription';
import TabPanel from './components/TabPanel';
import BusinessWorkflows from './containers/profile/workflows/BusinessWorkflows';
import Developers from './containers/developers/Developers';
import TabContext from '../../context/TabContext';
import AppBar from '@mui/material/AppBar';

const Settings = props => {
	const { index, dispatch } = useContext(TabContext);

	const handleChange = (event, newValue) => {
		dispatch({type: 'setIndex', index: newValue})
	};

	useEffect(() => {
		Mixpanel.people.increment('page_views');
	}, []);

	function a11yProps(index) {
		return {
			id: `simple-tab-${index}`,
			'aria-controls': `simple-tabpanel-${index}`
		};
	}

	const AntTab = styled(props => <Tab disableRipple {...props} />)(({ theme }) => ({
		textTransform: 'none',
		minWidth: 0,
		[theme.breakpoints.up('sm')]: {
			minWidth: 0
		},
		fontWeight: theme.typography.fontWeightRegular,
		marginRight: theme.spacing(1),
		color: 'rgba(0, 0, 0, 0.85)',
		fontFamily: [
			'Inter',
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"'
		].join(','),
		'&:hover': {
			color: '#9400D3',
			opacity: 1
		},
		'&.Mui-selected': {
			color: '#9400D3',
			fontWeight: theme.typography.fontWeightMedium
		},
		'&.Mui-focusVisible': {
			backgroundColor: '#d1eaff'
		}
	}));

	return (
		<div className='page-container pb-3'>
			<Box sx={{ width: '100%'}}>
				<AppBar sx={{ borderBottom: 1, borderColor: 'divider', position: "sticky", top: 0, backgroundColor: 'white', boxShadow: 'none' }} >
					<Tabs
						indicatorColor='secondary'
						value={index}
						onChange={handleChange}
						aria-label='basic tabs example'
						variant='scrollable'
						scrollButtons='auto'
						allowScrollButtonsMobile
					>
						<AntTab label='Account Settings' {...a11yProps(0)} />
						<AntTab label='Billing' {...a11yProps(1)} />
						<AntTab label='Business Workflows' {...a11yProps(2)} />
						<AntTab label='Third Party Providers' {...a11yProps(3)} />
						<AntTab label='Integrations' {...a11yProps(4)} />
						<AntTab label='Developers' {...a11yProps(5)} />
					</Tabs>
				</AppBar>
				<TabPanel value={index} index={0}>
					<Profile />
				</TabPanel>
				<TabPanel value={index} index={1}>
					<Subscription {...props} />
				</TabPanel>
				<TabPanel value={index} index={2}>
					<BusinessWorkflows {...props} />
				</TabPanel>
				<TabPanel value={index} index={3}>
					<Couriers />
				</TabPanel>
				<TabPanel value={index} index={4}>
					<Integrations {...props} />
				</TabPanel>
				<TabPanel value={index} index={5}>
					<Developers {...props} />
				</TabPanel>
			</Box>
		</div>
	);
};

export default Settings;
