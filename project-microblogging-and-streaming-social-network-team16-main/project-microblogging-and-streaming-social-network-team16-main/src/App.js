import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Container from "react-bootstrap/Container";
import Menubar from "./components/Menubar/Menubar";

import ErrorAlerter from "./components/ErrorAlerter/ErrorAlerter";

import Home from "./views/Home/Home";
import SignIn from "./views/SignIn/SignIn";
import SignUp from "./views/SignUp/SignUp";
import Posts from "./views/Posts/PostsView";
import Livestreams from "./views/Livestreams/Livestreams";
import IndividualLivestream from "./views/IndividualLivestream/IndividualLivestream";
import Profile from "./views/Profile/Profile";
import Contacts from "./views/Contacts/Contacts";
import Messages from "./views/Messages/Messages";
import SignOut from "./views/SignOut/SignOut";

import { getSession } from "./store/userState";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

/**
 * @returns {App} An App React component.
 */
function App() {
  const dispatch = useDispatch();
  const [initialSessionFetched, setInitialSessionFetched] = useState(false);
  const userState = useSelector((state) => state.user);

  if (!initialSessionFetched) {
    setInitialSessionFetched(true);
    dispatch(getSession());
  }

  let loggedInRoutes = null;
  if (userState.isUserLoggedIn) {
    loggedInRoutes = [
      <Route exact path="/feed" key="/feed">
        <Posts />
      </Route>,
      <Route exact path="/contacts" key="/contacts">
        <Contacts />
      </Route>,
      <Route exact path="/streams" key="/streams">
        <Livestreams />
      </Route>,
      <Route exact path="/inbox" key="/inbox">
        <Messages />
      </Route>,
      <Route
        exact
        path="/streams/:livestreamUser"
        key="/streams/:livestreamUser"
      >
        <IndividualLivestream />
      </Route>,
      <Route exact path="/profile" key="/profile">
        <Profile />
      </Route>,
      <Route exact path="/signout" key="/signout">
        <SignOut />
      </Route>,
    ];
  }

  const NoMatch = () => {
    const history = useHistory();
    if (userState.isUserLoggedIn !== null) {
      history.push("/");
    }
    return null;
  };

  return (
    <Router>
      <div className="App">
        <Helmet>
          <title>ABE Twitter</title>
        </Helmet>
        <ErrorAlerter />
        <header>
          <Menubar />
        </header>
        <Container className="mainContainer">
          <Switch>
            {loggedInRoutes}
            <Route exact path="/signup">
              <SignUp />
            </Route>
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
            <Route component={NoMatch} />
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

export default App;
