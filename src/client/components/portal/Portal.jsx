/*
  Evan MacHale - N00150552
  25.05.19
  Portal.jsx
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Material Design Components
import { Grid, Row, Cell } from '@material/react-layout-grid';
import { Body1, Headline2 } from '@material/react-typography';
import Button from '@material/react-button';
// My Components
import Login from './Login';
import Register from './Register';

/*
  Portal renders registration fields 🔒
*/

class Portal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      whichPortal: true,
    };
    this.switchPortal = this.switchPortal.bind(this);
  }

  // Toggle between forms
  switchPortal() {
    this.setState(prevState => ({
      whichPortal: !prevState.whichPortal,
    }));
  }

  render() {
    const { whichPortal } = this.state;
    const { setLoginSuccess } = this.props;
    return (
      <Grid>
        <Row>
          <Cell desktopColumns={1} tabletColumns={1} />
          <Cell desktopColumns={10} tabletColumns={8} phoneColumns={4}>

            <Row>

              <Cell desktopColumns={6} tabletColumns={4} phoneColumns={4}>

                <Row>
                  <Cell desktopColumns={6} tabletColumns={4} phoneColumns={4}>
                    <Headline2 className="type-heavy">Generative Jewellery</Headline2>
                  </Cell>
                </Row>
                <Row>
                  <Cell columns={12}>
                    <Body1>Generative Jewellery</Body1>
                  </Cell>
                </Row>

              </Cell>

              <Cell desktopColumns={1} tabletColumns={1} />

              <Cell desktopColumns={4} tabletColumns={4} phoneColumns={4}>

                <Row>
                  <Cell columns={12}>
                    {whichPortal ? (
                      <Login
                        {...this.props}
                        setLoginSuccess={setLoginSuccess}
                      />
                    ) : (
                      <Register />
                    )}
                  </Cell>
                </Row>
                <Row>
                  <Cell columns={12}>
                    <Body1 className="form-or">or</Body1>
                  </Cell>
                </Row>
                <Row>
                  <Cell columns={12}>
                    <Button className="form-button-alt" onClick={this.switchPortal}>
                      {whichPortal ? 'Register' : 'Login'}
                    </Button>
                  </Cell>
                </Row>

              </Cell>

              <Cell desktopColumns={1} tabletColumns={1} />

            </Row>

          </Cell>
          <Cell desktopColumns={1} tabletColumns={1} />
        </Row>
      </Grid>
    );
  }
}

Portal.propTypes = {
  setLoginSuccess: PropTypes.func.isRequired,
};

export default Portal;
