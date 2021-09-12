import './Sidebar.css';
import orderIcon from '../../img/orders.svg';
import plugIcon from '../../img/plug.svg';
import helpIcon from '../../img/help.svg';
import homeIcon from '../../img/home1.svg';
import createIcon from '../../img/create.svg';
import trackIcon from '../../img/track.svg';
import logoutIcon from '../../img/logout.svg';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { logout } from '../../store/actions/auth';
import { useDispatch } from 'react-redux';
import { PATHS } from '../../constants';

export default function Sidebar() {
	const dispatch = useDispatch();
	const history = useHistory();
	const location = useLocation();
	console.log('Location', location);
	return (
		<div className='sidebar'>
			<div className='sidebarWrapper'>
				<div className='sidebarMenu'>
					<ul className='sidebarList'>
						<Link to={PATHS.HOME} className='link'>
							<li className={`sidebarListItem ${location['pathname'] === PATHS.HOME && 'currentLink'}`}>
								<img className={`sidebarIcon`} src={homeIcon} alt={''} />
								<div className='sidebarText'>Home</div>
							</li>
						</Link>
						<Link to={PATHS.ORDERS} className='link'>
							<li className={`sidebarListItem ${location['pathname'] === PATHS.ORDERS && 'currentLink'}`}>
								<img className={`sidebarIcon`} src={orderIcon} alt={''} />
								<div className='sidebarText'>Orders</div>
							</li>
						</Link>
						<Link to={PATHS.CREATE} className='link'>
							<li className={`sidebarListItem ${location['pathname'] === PATHS.CREATE && 'currentLink'}`}>
								<img className={`sidebarIcon`} src={createIcon} alt={''} />
								<div className='sidebarText'>Create</div>
							</li>
						</Link>
						<Link to={PATHS.TRACK} className='link'>
							<li className={`sidebarListItem ${location['pathname'] === PATHS.TRACK && 'currentLink'}`}>
								<img className={`sidebarIcon`} src={trackIcon} alt={''} />
								<div className='sidebarText'>Track</div>
							</li>
						</Link>
						<Link to={PATHS.INTEGRATE} className='link'>
							<li
								className={`sidebarListItem ${
									location['pathname'] === PATHS.INTEGRATE && 'currentLink'
								}`}
							>
								<img className={`sidebarIcon`} src={plugIcon} alt={''} />
								<div className='sidebarText'>Integration</div>
							</li>
						</Link>
						<Link to={PATHS.HELP} className='link'>
							<li className={`sidebarListItem ${location['pathname'] === PATHS.HELP && 'currentLink'}`}>
								<img className={`sidebarIcon`} src={helpIcon} alt={''} />
								<div className='sidebarText'>Help</div>
							</li>
						</Link>
						<a
							onClick={() => {
								dispatch(logout());
								history.push('/login');
							}}
							className='link'
						>
							<li className='sidebarListItem1'>
								<img className='sidebarIcon1' src={logoutIcon} alt='' />
								Log Out
							</li>
						</a>
					</ul>
				</div>
			</div>
		</div>
	);
}
