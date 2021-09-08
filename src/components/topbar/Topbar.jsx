import React from 'react'
import "./Topbar.css"
import logo from "../../img/secondsapp.svg"

export default function Topbar({name, company}) {
    return (
        <div className="topbar">
            <div className="topbarWrapper">
                <div className="topLeft">
                    <span className="logo">
                        <img src={logo} alt="" />
                    </span>
                </div>
                <div className="topRight">
                    <div className="topbarIconContainer">
                        {name} - {company}
                    </div>
                </div>
            </div>
        </div>
    )
}
