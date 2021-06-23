import routes from "./routes/routes";
import Topbar from "./Components/topbar/Topbar";
import Sidebar from "./Components/sidebar/Sidebar";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import { setAuthorizationToken } from "./store/actions/auth";

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
