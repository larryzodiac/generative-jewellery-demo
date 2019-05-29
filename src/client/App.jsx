/*
  Evan MacHale - N00150552
  25.05.19
  App.jsx
*/

import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import './App.scss';
// My Components
import Provider from './Provider';
import Portal from './components/portal/Portal';
import World from './components/world/World';
import Loading from './components/misc/Loading';

/*
  Context
*/

export const ContextId = React.createContext('hello');

/*
  App functions as the hub for all component traffic 🚂
*/

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginSuccess: false,
      id: '',
    };
    this.setLoginSuccess = this.setLoginSuccess.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    // Who goes there? Where is your token? 👮
    axios.get('/api/token')
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            loginSuccess: true,
            id: response.data,
          });
        }
      })
      .catch((err) => {
        if (err) {
          this.setState({ loginSuccess: false });
        }
      });
  }

  setLoginSuccess(id) {
    this.setState(prevState => ({
      loginSuccess: !prevState.loginSuccess,
      id,
    }));
  }

  logout(props) {
    /*
      react-router Route Component Props History 🔌
      Allows us to redirect by accessing the history prop!
      https://medium.com/@anneeb/redirecting-in-react-4de5e517354a
    */
    axios.get('/api/logout')
      .then((response) => {
        if (response.status === 200) {
          this.setState({ loginSuccess: false });
          props.history.push('/');
        }
      });
  }

  render() {
    const { loginSuccess, id } = this.state;
    return (
      <Provider globalUserId={id}>
        <BrowserRouter>
          <Route exact path="/" render={props => <Portal {...props} setLoginSuccess={this.setLoginSuccess} />} />
          <Route
            exact
            path="/"
            render={() => (
              loginSuccess && <Redirect to="/play" />
            )}
          />
          <Route
            path="/play"
            render={() => (
              !loginSuccess ? (
                <Redirect to="/" />
              ) : (
                <World />
              )
            )}
          />
          <Route path="/logout" render={this.logout} />
          <Route path="/loading" render={props => <Loading {...props} />} />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
