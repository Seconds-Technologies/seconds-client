import orderIcon from '../../assets/img/orders1.svg';
import integrateIcon from '../../assets/img/integrate.svg';
import settingsIcon from '../../assets/img/settings.svg';
import dashboardIcon from '../../assets/img/dashboard.svg';
import createIcon from '../../assets/img/create1.svg';
import trackIcon from '../../assets/img/track1.svg';
import courierIcon from '../../assets/img/courier.svg';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { PATHS } from '../../constants';
import './Sidebar.css';

export default function Sidebar() {
	const location = useLocation();
	return (
		<div className="sidebar">
			<div className='mb-1 d-flex flex-column flex-shrink-0 ps-3 pe-2'>
				<ul className='nav nav-pills flex-column mb-auto'>
					<Link to={PATHS.HOME} className='link text-black mt-3'>
						<li className={`sidebarListItem ${location['pathname'] === PATHS.HOME && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${
									location['pathname'] === PATHS.HOME && 'currentIcon'
								}`}
								src={dashboardIcon}
								alt={''}
								width={25}
								height={25}
							/>
							<div className='item-hover'>Dashboard</div>
						</li>
					</Link>
					<Link to={PATHS.ORDERS} className='link text-black'>
						<li className={`sidebarListItem ${location['pathname'] === PATHS.ORDERS && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${
									location['pathname'] === PATHS.ORDERS && 'currentIcon'
								}`}
								src={orderIcon}
								alt={''}
								width={25}
								height={25}
							/>
							<div className='item-hover'>Orders</div>
						</li>
					</Link>
					<Link to={PATHS.CREATE} className='link text-black'>
						<li className={`sidebarListItem ${location['pathname'] === PATHS.CREATE && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${
									location['pathname'] === PATHS.CREATE && 'currentIcon'
								}`}
								src={createIcon}
								alt={''}
								width={25}
								height={25}
							/>
							<div className='item-hover'>Create</div>
						</li>
					</Link>
					<Link to={PATHS.TRACK} className='link text-black'>
						<li className={`sidebarListItem ${location['pathname'] === PATHS.TRACK && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${
									location['pathname'] === PATHS.TRACK && 'currentIcon'
								}`}
								src={trackIcon}
								alt={''}
								width={25}
								height={25}
							/>
							<div className='item-hover'>Track</div>
						</li>
					</Link>
					<Link to={PATHS.INTEGRATE} className='link text-black mt-4'>
						<li className={`sidebarListItem ${location['pathname'] === PATHS.INTEGRATE && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${
									location['pathname'] === PATHS.INTEGRATE && 'currentIcon'
								}`}
								src={integrateIcon}
								alt={''}
								width={25}
								height={25}
							/>
							<div className='item-hover'>Integrations</div>
						</li>
					</Link>
					<Link to={PATHS.COURIERS} className='link text-black'>
						<li className={`sidebarListItem ${location['pathname'] === PATHS.COURIERS && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${
									location['pathname'] === PATHS.COURIERS && 'currentIcon'
								}`}
								src={courierIcon}
								alt={''}
								width={25}
								height={25}
							/>
							<div className='item-hover'>Couriers</div>
						</li>
					</Link>
					<Link to={PATHS.SETTINGS} className='link text-black mt-4'>
						<li className={`sidebarListItem ${location['pathname'] === PATHS.SETTINGS && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${
									location['pathname'] === PATHS.SETTINGS && 'currentIcon'
								}`}
								src={settingsIcon}
								alt={''}
								width={25}
								height={25}
							/>
							<div className='item-hover'>Settings</div>
						</li>
					</Link>
				</ul>
			</div>
		</div>
	);
}
