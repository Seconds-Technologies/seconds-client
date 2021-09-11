import routes from "./routes/routes";
import Topbar from "./components/topbar/Topbar";
import Sidebar from "./components/sidebar/Sidebar";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import { setAuthorizationToken } from "./store/actions/auth";
import "./App.css";
import 'mapbox-gl/dist/mapbox-gl.css'

if(localStorage.getItem("jwt_token")){
    setAuthorizationToken(localStorage.getItem("jwt_token"))
}

function App() {
    const { isAuthenticated, user } = useSelector(state => state["currentUser"])
    console.log(isAuthenticated);
    return (
        <Router>
            {isAuthenticated
            && <Topbar name={`${user.firstname} ${user.lastname}`} company={user.company} />}
            <div className="app-container">
                {isAuthenticated && <Sidebar />}
                {routes}
            </div>
        </Router>
    );
}

export default App;
