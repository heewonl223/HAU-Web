import React from "react";
import {HashRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import Auth from "routes/Auth";
import Dailylog from "components/Dailylog";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";
import Diagnosis from "components/Diagnosis";
import Search from "components/Search";

const AppRouter = ({isLoggedIn, userObj}) => {
    return (
        <Router>
            <Navigation />
            <Switch>
                {isLoggedIn ? (
                    <>
                        <Route exact path="/dailylog">
                            <Dailylog userObj={userObj}/>
                        </Route>
                        <Route exact path="/diagnosis">
                            <Diagnosis userObj={userObj}/>
                        </Route>
                        <Route exact path="/profile">
                            <Profile />
                        </Route>
                        <Route exact path="/search">
                            <Search />
                        </Route>
                    </> 
                ) : (
                    <>
                    <Route exact path="/">
                        <Auth />
                    </Route>
                    <Route exact path="/profile">
                        <Auth />
                    </Route>
                    <Redirect from="*" to="/" />
                    </>
                )}
            </Switch>
        </Router>
    );
};

export default AppRouter;