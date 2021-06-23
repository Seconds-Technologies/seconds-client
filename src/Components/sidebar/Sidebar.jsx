import "./Sidebar.css";
import orderIcon from "../../img/orders.svg";
import plugIcon from "../../img/plug.svg";
import helpIcon from "../../img/help.svg";
import homeIcon from "../../img/home1.svg";
import logoutIcon from "../../img/logout.svg";
import productIcon from "../../img/product.svg";
import { Link, useHistory, useLocation } from "react-router-dom";
import { logout } from "../../store/actions/auth";
import { useDispatch } from "react-redux";

export default function Sidebar() {
	const dispatch = useDispatch();
	const history = useHistory();
	const location = useLocation();
	console.log("Location", location);
	return (
		<div className='sidebar'>
			<div className='sidebarWrapper'>
				<div className='sidebarMenu'>
					<ul className='sidebarList'>
						<Link to='/home' className='link'>
							<li className={`sidebarListItem ${location["pathname"] === "/home" && "currentLink"}`}>
								<img
									className={`sidebarIcon`}
									src={homeIcon}
									alt={""}
								/>
								<div className='sidebarText'>Dashboard</div>
							</li>
						</Link>
						<Link to='/orders' className='link'>
							<li className={`sidebarListItem ${location["pathname"] === "/orders" && "currentLink"}`}>
								<img
									className={`sidebarIcon`}
									src={orderIcon}
									alt={""}
								/>
								<div className='sidebarText'>Orders</div>
							</li>
						</Link>
						<Link to='/products' className='link'>
							<li className={`sidebarListItem ${location["pathname"] === "/products" && "currentLink"}`}>
								<img
									className={`sidebarIcon`}
									src={productIcon}
									alt={""}
								/>
								<div className='sidebarText'>Products</div>
							</li>
						</Link>
						<Link to='/shopifyLogIn' className='link'>
							<li
								className={`sidebarListItem ${
									location["pathname"] === "/shopifyLogIn" && "currentLink"
								}`}
							>
								<img
									className={`sidebarIcon`}
									src={plugIcon}
									alt={""}
								/>
								<div className='sidebarText'>Integration</div>
							</li>
						</Link>
						<Link to='/help' className='link'>
							<li className={`sidebarListItem ${
								location["pathname"] === "/help" && "currentLink"
							}`}>
								<img
									className={`sidebarIcon`}
									src={helpIcon}
									alt={""}
								/>
								<div className='sidebarText'>Help</div>
							</li>
						</Link>
						<a
							onClick={() => {
								dispatch(logout());
								history.push("/login");
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
