import React from 'react'
import "./Topbar.css"
import logo from "../../img/secondsapp.svg"
import { useHistory } from 'react-router-dom';
import { PATHS } from '../../constants';

export default function Topbar({name, company}) {
    const history = useHistory()
    return (
        <div className="topbar">
            <div className="topbarWrapper">
                <div className="topLeft">
                    <span className="logo">
                        <img src={logo} alt="" />
                    </span>
                </div>
                <div className="topRight" onClick={() => history.push(PATHS.PROFILE)}>
                    <div className="topbarIconContainer">
                        {name} - {company}
                    </div>
                </div>
            </div>
        </div>
    )
}
