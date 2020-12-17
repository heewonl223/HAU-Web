import React from "react";
import {HashRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import Auth from "routes/Auth";
import Dailylog from "components/Dailylog";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";
import Diagnosis from "components/Diagnosis";
import Diagnosis2 from "components/Diagnosis2";
import Diagnosis3 from "components/Diagnosis3";
import Logo from 'components/reallogo.png';
import Search from "components/Search";

let text = ["this is text with breakdown",
                        <br/>,
                         "this is the second line"];


const AppRouter = ({isLoggedIn, userObj}) => {
    return (
        <Router>
            <Navigation />


            <Switch>
                {isLoggedIn ? (
                    <> 
                        <Route exact path="/profile">

                        <div>
                            <div id = "intro_img">
                            :)
                            </div>

                            <div id = "intro_img">
                            <img
                            src={Logo}
                            width='480'
                            height='400'/>
                            </div>
                            
                            <div id = "new_line">
                            .
                            </div>
                            <div id = "intro">
                            We are Health Assistant.
                            </div>
                            <div id = "intro">
                            Our goal is to provide service for patients
                            </div>
                            <div id = "intro">
                            who need information and communication with others.
                            </div>
                        </div>

                            <div id = "welcome">
                                Welcome!
                            </div>

                            <div id = "layout">
                                <Profile />
                            </div>
                        </Route>
                        <Route exact path="/dailylog">
                            <Dailylog userObj={userObj}/>
                        </Route>
                        <Route exact path="/diagnosis">
                            <Diagnosis userObj={userObj}/>
                        </Route>
                        <Route exact path="/diagnosis2">
                            <Diagnosis2 userObj={userObj}/>
                        </Route>
                        <Route exact path="/diagnosis3">
                            <Diagnosis3 userObj={userObj}/>
                        </Route>
                        <Route exact path="/search">
                            <Search />
                        </Route>
                    </> 
                ) : (
                    <>

                    <div>
                        <div id = "intro_img">
                        :)
                        </div>

                        <div id = "intro_img">
                        <img
                        src={Logo}
                        width='480'
                        height='400'/>
                        </div>
                        
                        <div id = "new_line">
                        .
                        </div>
                        <div id = "intro">
                        We are Health Assistant.
                        </div>
                        <div id = "intro">
                        Our goal is to provide service for patients
                        </div>
                        <div id = "intro">
                        who need information and communication with others.
                        </div>
                    </div>
                    <Route exact path="/profile">
                        <div id = "layout">
                            <Auth />
                        </div>
                    </Route>
                    <Route exact path="/dailylog">
                        <div id = "layout">
                            <Auth />
                        </div>                
                    </Route>
                    <Route exact path="/diagnosis">
                        <div id = "layout">
                            <Auth />
                        </div>                    
                    </Route>
                    <Route exact path="/search">
                        <div id = "layout">
                            <Auth />
                        </div>
                    </Route>
                    <Redirect from="*" to="/" />
                    </>
                )}
            </Switch>
        </Router>
    );
};

export default AppRouter;