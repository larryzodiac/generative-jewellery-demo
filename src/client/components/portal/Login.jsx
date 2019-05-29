/*
  Evan MacHale - N00150552
  25.05.19
  Login.js
*/

import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
// Material Design Components
import { Row, Cell } from '@material/react-layout-grid';
import Button from '@material/react-button';
import { Headline3 } from '@material/react-typography';
import MaterialIcon from '@material/react-material-icon';
// My Components
import Text from '../misc/Text';

/*
  Login renders a form + handles POST requests 🔒
*/

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      usernameError: '',
      password: '',
      passwordError: '',
      redirect: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderRedirect = this.renderRedirect.bind(this);
  }

  handleInputChange(event) {
    const { target } = event;
    const { value, name } = target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { username, password } = this.state;
    const { setLoginSuccess } = this.props;
    /*
      Make POST Request 📮
    */
    axios.post('/api/login', { username, password })
      .then((response) => {
        if (response.status === 200) {
          // Maybe pass user_id here for context?
          setLoginSuccess(response.data);
          this.setState({ redirect: true });
        }
      })
      .catch((error) => {
        /*
          Validate 🔒
        */
        switch (error.response.data.message.message) {
          case 'Missing credentials':
            this.setState({
              usernameError: error.response.data.message.message,
              passwordError: error.response.data.message.message,
            });
            break;
          case 'Incorrect username':
            this.setState({
              usernameError: error.response.data.message.message,
              passwordError: '',
            });
            break;
          case 'Incorrect password':
            this.setState({
              usernameError: '',
              passwordError: error.response.data.message.message,
            });
            break;
          default:
        }
      });
  }

  // If requests were successful, we can redirect to the Home
  renderRedirect() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to="/play" />;
    }
    return <React.Fragment />;
  }

  render() {
    const {
      username,
      usernameError,
      password,
      passwordError,
    } = this.state;
    return (
      <React.Fragment>
        {this.renderRedirect()}
        <Row>
          <Cell columns={12}>
            <form onSubmit={this.handleSubmit}>
              <Row>
                <Cell columns={12}>
                <Headline3>
                  Login
                  <MaterialIcon className="" icon="arrow_downward" />
                </Headline3>
                </Cell>
                <Cell columns={12}>
                  <Text name="username" label="Username" value={username} error={usernameError} onChange={this.handleInputChange} />
                </Cell>
                <Cell columns={12}>
                  <Text name="password" type="password" label="Password" value={password} error={passwordError} onChange={this.handleInputChange} />
                </Cell>
                <Cell columns={12}>
                  <Button className="form-button" type="submit" value="Submit">Login</Button>
                </Cell>
              </Row>
            </form>
          </Cell>
        </Row>
      </React.Fragment>
    );
  }
}

Login.propTypes = {
  setLoginSuccess: PropTypes.func.isRequired,
};

export default Login;
