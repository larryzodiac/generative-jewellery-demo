/*
  Evan MacHale - N00150552
  25.05.19
  Portal.jsx
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Material Design Components
import { Grid, Row, Cell } from '@material/react-layout-grid';
import { Body1, Headline1, Headline5 } from '@material/react-typography';
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
          <Cell desktopColumns={2} tabletColumns={1} />
          <Cell desktopColumns={8} tabletColumns={8} phoneColumns={4}>

            <Row>

              <Cell desktopColumns={6} tabletColumns={4} phoneColumns={4}>

                <Row>
                  <Cell desktopColumns={6} tabletColumns={4} phoneColumns={4}>
                    <Headline1 className="type-heavy">Generative Jewellery</Headline1>
                  </Cell>
                </Row>
                <Row>
                  <Cell columns={12}>
                    <Headline5>
                      <a href="http://www.iadt.ie/courses/creative-computing">Dún Laoghaire's Institue of Art, Design & Technology</a>
                      <br />
                      Final Year Research Project Demo.
                    </Headline5>
                    <Headline5>
                      An investigation into generative design using subdivision
                       surface algorithms in the form of a jewellery designer application.
                    </Headline5>
                    <Headline5>
                      Made by
                      <a href="https://github.com/larryzodiac"> Evan MacHale</a>
                      .
                    </Headline5>
                  </Cell>
                </Row>
                <div className="form">
                  <Row>
                    <Cell columns={9}>
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
                    <Cell columns={9}>
                      <Body1 className="form-or">or</Body1>
                    </Cell>
                  </Row>
                  <Row>
                    <Cell columns={9}>
                      <Button className="form-button-alt" onClick={this.switchPortal}>
                        {whichPortal ? 'Register' : 'Login'}
                      </Button>
                    </Cell>
                  </Row>
                </div>

              </Cell>

              <Cell desktopColumns={1} tabletColumns={1} />

            </Row>

          </Cell>
          <Cell desktopColumns={2} tabletColumns={1} />
        </Row>
      </Grid>
    );
  }
}

Portal.propTypes = {
  setLoginSuccess: PropTypes.func.isRequired,
};

export default Portal;
