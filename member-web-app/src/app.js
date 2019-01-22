import React, { Component } from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Container } from 'semantic-ui-react'
import PrivateRoute from "react-private-route";
import Loadable from 'react-loadable';
import Header from './components/header';
import Footer from './components/footer';
import Connecting from './components/connecting';

import "./app.css";

const JoinPage = Loadable({
  loader: () => import('./modules/join-page'),
  loading: () => <Connecting />,
});

const SignInPage = Loadable({
  loader: () => import('./modules/sign-in-page'),
  loading: () => <Connecting />,
});

const PasswordResetPage = Loadable({
  loader: () => import('./modules/password-reset-page'),
  loading: () => <Connecting />,
});

const AccountPage = Loadable({
  loader: () => import('./modules/account-page'),
  loading: () => <Connecting />,
});

class App extends Component {

  isSignedIn() {
    return true;
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Container>
          <Router>
            <Switch>
              <Route path="/join" component={JoinPage} />
              <Route path="/sign-in" component={SignInPage} />
              <Route path="/password-reset" component={PasswordResetPage} />
              <PrivateRoute
                exact
                path="/account"
                component={AccountPage}
                isAuthenticated={this.isSignedIn()}
                redirect="/sign-in"
              />
            </Switch>
          </Router>
        </Container>
        <Footer />
    </div>
    );
  }
}

export default App;
