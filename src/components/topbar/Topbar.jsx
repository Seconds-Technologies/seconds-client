import React, { useEffect } from 'react';
import './Topbar.css';
import logo from '../../img/secondsapp.svg';
import { Link, useHistory } from 'react-router-dom';
import { PATHS } from '../../constants';
import { useSelector } from 'react-redux';

export default function Topbar() {
	const { firstname, lastname, profileImageData } = useSelector(state => state["currentUser"].user)
	const history = useHistory();

	return (
		<nav className='navbar navbar-expand-md navbar-light sticky-top bg-white'>
			<div className='container-fluid d-flex ms-3'>
				<Link to='/' className='navbar-brand' href=''>
					<span className='logo'>
						<img src={logo} alt='' />
					</span>
				</Link>
			</div>
			<div className="collapse navbar-collapse" id="profile">
				<div className='navbar-text me-5' onClick={() => history.push(PATHS.PROFILE)}>
					<div className='d-flex align-items-center' role="button">
						<img
							className='border rounded-circle me-3'
							src={`data:image/jpeg;base64,${profileImageData}`}
							alt=''
							width={50}
							height={50}
						/>
						<span className="profile-text fs-4 text-dark">{firstname}&nbsp;</span>
						<span className="profile-text fs-4 text-dark">{lastname}</span>
					</div>
				</div>
			</div>
		</nav>
		/*<div className="topbar">
            <div className="topbarWrapper test3">
                <div className="topLeft">
                    <span className="logo">
                        <img src={logo} alt="" />
                    </span>
                </div>
                <div className="topRight" onClick={() => history.push(PATHS.PROFILE)}>
                    <div className="topbarIconContainer d-flex align-items-center justify-content-center px-5 ">
                        <img className="border rounded-circle me-3" src={`data:image/jpeg;base64,${profileImage}`} alt='' width={50} height={50}/>
                        {name}
                    </div>
                </div>
            </div>
        </div>*/
	);
}
