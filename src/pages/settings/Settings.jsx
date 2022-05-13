import './settings.css';
import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Mixpanel } from '../../config/mixpanel';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Profile from './containers/profile/Profile';
import Integrations from './containers/integrations/Integrations';
import Billing from './containers/billing/Billing';
import TabPanel from '../../components/TabPanel';
import BusinessSettings from './containers/business/BusinessSettings';
import Developers from './containers/developers/Developers';
import AppBar from '@mui/material/AppBar';
import Branding from './containers/branding/Branding';
import DispatchRules from './containers/dispatchRules/DispatchRules';
import RoutingRules from './containers/routingRules/RoutingRules';
import Notifications from './containers/notifications/Notifications';
import Couriers from './containers/couriers/Couriers';
import { TabContext } from '../../context';

const Settings = props => {
	const { index, dispatch } = useContext(TabContext);
	const [navColor, setNavColor] = useState("white")

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
						<AntTab label='Business Settings' {...a11yProps(2)} />
						<AntTab label='Dispatch Rules' {...a11yProps(3)} />
						<AntTab label='Routing' {...a11yProps(4)} />
						<AntTab label='Notifications' {...a11yProps(5)} />
						<AntTab label="Branding" {...a11yProps(6)} />
						<AntTab label='Delivery Service Providers' {...a11yProps(7)} />
						<AntTab label='Integrations' {...a11yProps(8)} />
						<AntTab label='Developers' {...a11yProps(9)} />
					</Tabs>
				</AppBar>
				<TabPanel value={index} index={0}>
					<Profile setNavColor={setNavColor}/>
				</TabPanel>
				<TabPanel value={index} index={1}>
					<Billing setNavColor={setNavColor} {...props} />
				</TabPanel>
				<TabPanel value={index} index={2}>
					<BusinessSettings setNavColor={setNavColor} {...props} />
				</TabPanel>
				<TabPanel value={index} index={3}>
					<DispatchRules setNavColor={setNavColor} />
				</TabPanel>
				<TabPanel value={index} index={4}>
					<RoutingRules setNavColor={setNavColor} />
				</TabPanel>
				<TabPanel value={index} index={5}>
					<Notifications setNavColor={setNavColor} />
				</TabPanel>
				<TabPanel value={index} index={6}>
					<Branding setNavColor={setNavColor} />
				</TabPanel>
				<TabPanel value={index} index={7}>
					<Couriers setNavColor={setNavColor} {...props} />
				</TabPanel>
				<TabPanel value={index} index={8}>
					<Integrations setNavColor={setNavColor} {...props} />
				</TabPanel>
				<TabPanel value={index} index={9}>
					<Developers setNavColor={setNavColor} {...props} />
				</TabPanel>
			</Box>
		</div>
	);
};

export default Settings;
