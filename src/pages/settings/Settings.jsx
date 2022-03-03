import './settings.css';
import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Mixpanel } from '../../config/mixpanel';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Profile from './containers/profile/Profile';
import Couriers from './containers/couriers/Couriers';
import Integrations from '../integration/Integrations';
import Subscription from '../subscription/Subscription';
import TabPanel from './components/TabPanel';
import BusinessWorkflows from './containers/profile/workflows/BusinessWorkflows';

const Settings = props => {
	const [value, setValue] = React.useState(0);
	const handleChange = (event, newValue) => {
		setValue(newValue);
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
		<div className='page-container d-flex py-3'>
			<Box sx={{ width: '100%' }}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs indicatorColor='secondary' value={value} onChange={handleChange} aria-label='basic tabs example' variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
						<AntTab label='Account Settings' {...a11yProps(0)} />
						<AntTab label='Billing' {...a11yProps(1)} />
						<AntTab label='Business Workflows' {...a11yProps(2)} />
						<AntTab label='Couriers' {...a11yProps(3)} />
						<AntTab label='Integrations' {...a11yProps(4)} />
						<AntTab
							label={
								<React.Fragment>
									<a href='https://docs.useseconds.com/' target='_blank' className='text-decoration-none'>
										Developers
									</a>
								</React.Fragment>
							}
						/>
					</Tabs>
				</Box>
				<TabPanel value={value} index={0}>
					<Profile />
				</TabPanel>
				<TabPanel value={value} index={1}>
					<Subscription {...props} />
				</TabPanel>
				<TabPanel value={value} index={2}>
					<BusinessWorkflows {...props}/>
				</TabPanel>
				<TabPanel value={value} index={3}>
					<Couriers />
				</TabPanel>
				<TabPanel value={value} index={4}>
					<Integrations {...props} />
				</TabPanel>
			</Box>
		</div>
	);
};

export default Settings;
