import './settings.css';
import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Mixpanel } from '../../config/mixpanel';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Profile from '../profile/Profile';
import Couriers from '../couriers/Couriers';
import Integrations from '../integration/Integrations';
import Subscription from '../subscription/Subscription';
import TabPanel from './components/TabPanel';

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

	const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
		({ theme }) => ({
			textTransform: 'none',
			fontWeight: theme.typography.fontWeightRegular,
			fontSize: theme.typography.pxToRem(15),
			marginRight: theme.spacing(1),
			color: 'rgba(255, 255, 255, 0.7)',
			'&.Mui-selected': {
				color: '#fff',
			},
			'&.Mui-focusVisible': {
				backgroundColor: 'rgba(100, 95, 228, 0.32)',
			},
		}),
	);

	return (
		<div className='page-container d-flex py-3'>
			<Box sx={{ width: '100%' }}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
						<Tab label='Account Settings' {...a11yProps(0)} />
						<Tab label='Billing' {...a11yProps(1)} />
						<Tab label='Business Workflows' {...a11yProps(2)} />
						<Tab label='Couriers' {...a11yProps(3)} />
						<Tab label='Integrations' {...a11yProps(4)} />
						<Tab
							label={
								<React.Fragment>
									<a href='https://docs.useseconds.com/' target="_blank" className="text-decoration-none">Developers</a>
								</React.Fragment>
							}
						/>
					</Tabs>
				</Box>
				<TabPanel value={value} index={0}>
					<Profile/>
				</TabPanel>
				<TabPanel value={value} index={1}>
					<Subscription/>
				</TabPanel>
				<TabPanel value={value} index={2}>
					Business Workflows
				</TabPanel>
				<TabPanel value={value} index={3}>
					<Couriers/>
				</TabPanel>
				<TabPanel value={value} index={4}>
					<Integrations/>
				</TabPanel>
			</Box>
		</div>
	);
};

export default Settings;
