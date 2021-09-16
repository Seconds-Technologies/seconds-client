import "./Login.css";
import logo from "../../img/secondslogin.svg";
import { Formik } from "formik";
import { authUser } from "../../store/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { removeError } from "../../store/actions/errors";

export default function Login() {
    const errors = useSelector(state => state["errors"]);
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(removeError());
    }, [location]);

    return (
        <div className="loginPage container-fluid py-5">
            <div className="d-flex">
                <img className="img-fluid mx-auto" src={logo} alt="" />
            </div>
            <div className="greeting">
                <h3 className="text-white welcome">Welcome back!</h3>
                <h5 className="text-white moreMessage">Nice to see you again.</h5>
            </div>
            <div className="d-flex w-sm loginContainer mx-auto px-4 py-5">
                <div className="d-flex flex-grow-1 flex-column justify-content-center">
                    <h4 className="getStarted pb-2">Log in</h4>
                    {errors.message && (
                        <div className="alert alert-danger alert-dismissible" role="alert">
                            <span>{errors.message}</span>
                            <button onClick={() => dispatch(removeError())} type="button" className="btn btn-close" />
                        </div>
                    )}
                    <Formik
                        initialValues={{
                            email: "",
                            password: ""
                        }}
                        onSubmit={(values, actions) => {
                            dispatch(authUser("login", values))
                                .then(() => history.push("/"))
                                .catch(err => console.log(err));
                        }}
                    >
                        {({
                              values,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              isSubmitting
                              /* and other goodies */
                          }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="loginItem1">
                                    <input
                                        autoComplete="email"
                                        type="email"
                                        name="email"
                                        placeholder="Business Email"
                                        className="form-control form-control-lg"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </div>
                                <div className="loginItem1">
                                    <input
                                        autoComplete="current-password"
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        className="form-control form-control-lg"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </div>
                                <div>
                                    <button type="submit" className="logIn w-100">Log In</button>
                                </div>
                            </form>
                        )}
                    </Formik>
                    {/*<div className="text-center pt-4">
                    <span className="text-center text-muted text-light">Need an account?&nbsp;<Link to="/signup">Sign up here!</Link></span>
                </div>*/}
                </div>
            </div>
            <h6 className="motto">Automated one hour and same day deliveries for your customers</h6>
        </div>
    );
}
