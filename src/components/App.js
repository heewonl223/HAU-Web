// on top of everything, manage authentication
import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import '../style.css'

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null); // beginning of userObj -> must be on top
  useEffect(()=> {
    // listening for change
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
  <div id="wrapper">
    {init ? (<AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> 
    ) : (
      "Initializing..." 
    )}
    <footer>Health Assistant</footer>
  </div>
  );
}

export default App;