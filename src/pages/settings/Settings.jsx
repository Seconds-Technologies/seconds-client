import './settings.css';
import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Mixpanel } from '../../config/mixpanel';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Profile from './containers/profile/Profile';
import Couriers from './containers/couriers/Couriers';
import Integrations from './containers/integrations/Integrations';
import Subscription from './containers/billing/Subscription';
import TabPanel from '../../components/TabPanel';
import BusinessWorkflows from './containers/workflows/BusinessWorkflows';
import Developers from './containers/developers/Developers';
import TabContext from '../../context/TabContext';
import AppBar from '@mui/material/AppBar';
import Branding from './containers/branding/Branding';
import Payroll from './containers/payroll/Payroll';

const Settings = props => {
	const { index, dispatch } = useContext(TabContext);
	const [navColor, setNavColor] = useState("white")

	const setWhite = () => setNavColor("white")
	const setTransparent = () => setNavColor("transparent")

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
				<AppBar sx={{ borderBottom: 1, borderColor: 'divider', position: "sticky", top: 0, backgroundColor: navColor, boxShadow: 'none', zIndex: 10 }} >
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
						<AntTab label="Branding" {...a11yProps(3)} />
						<AntTab label="Driver Payroll" {...a11yProps(4)} />
						<AntTab label='Delivery Service Providers' {...a11yProps(5)} />
						<AntTab label='Integrations' {...a11yProps(6)} />
						<AntTab label='Developers' {...a11yProps(7)} />
					</Tabs>
				</AppBar>
				<TabPanel value={index} index={0}>
					<Profile setNavColor={setNavColor}/>
				</TabPanel>
				<TabPanel value={index} index={1}>
					<Subscription setNavColor={setNavColor} {...props} />
				</TabPanel>
				<TabPanel value={index} index={2}>
					<BusinessWorkflows setNavColor={setNavColor} {...props} />
				</TabPanel>
				<TabPanel value={index} index={3}>
					<Branding setNavColor={setNavColor} />
				</TabPanel>
				<TabPanel value={index} index={4}>
					<Payroll setNavColor={setNavColor} />
				</TabPanel>
				<TabPanel value={index} index={5}>
					<Couriers setNavColor={setNavColor} />
				</TabPanel>
				<TabPanel value={index} index={6}>
					<Integrations setNavColor={setNavColor} {...props} />
				</TabPanel>
				<TabPanel value={index} index={7}>
					<Developers setNavColor={setNavColor} {...props} />
				</TabPanel>
			</Box>
		</div>
	);
};

export default Settings;
