/*
  Evan MacHale - N00150552
  25.05.19
  Playground.jsx
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Material Design Components
import Drawer, { DrawerAppContent, DrawerContent } from '@material/react-drawer';
import List, { ListGroup, ListItem } from '@material/react-list';
import Button from '@material/react-button';
// My Components
import Scene from '../scene/Scene';
import GeometryList from '../scene/GeometryList';
import FunctionList from '../scene/FunctionList';
import Text from '../misc/Text';

/*
  Playground functions as container for Three.js Scene Component
*/

class Playground extends Component {
  constructor(props) {
    super(props);
    this.state = { exportClicked: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      exportClicked: prevState.exportClicked + 1,
    }));
  }

  render() {
    const { exportClicked } = this.state;
    const {
      drawerOpen,
      handleChange,
      saveWeights,
      clear,
      name,
      geometry,
      wireframe,
      subdivisions,
      adjacentWeight,
      edgePointWeight,
      connectingEdgesWeight,
    } = this.props;
    return (
      <React.Fragment>
        <Drawer
          className="drawer-alternate"
          dismissible
          open={drawerOpen}
        >
          <DrawerContent>
            <ListGroup className="drawer-group">
              <List nonInteractive>
                <GeometryList
                  geometry={geometry}
                  wireframe={wireframe}
                  onChange={handleChange}
                />
              </List>
              <hr className="drawer-divider" />
              <List nonInteractive>
                <FunctionList
                  subdivisions={subdivisions}
                  adjacentWeight={adjacentWeight}
                  edgePointWeight={edgePointWeight}
                  connectingEdgesWeight={connectingEdgesWeight}
                  onChange={handleChange}
                />
              </List>
              <hr className="drawer-divider" />
              <List nonInteractive>
                <ListItem className="button-list-item">
                  <Button
                    className="button-alternate"
                    outlined
                    onClick={clear}
                  >
                    Clear
                  </Button>
                </ListItem>
                <ListItem className="button-list-item">
                  <Text name="name" label="Username" value={name} onChange={handleChange} outlined />
                </ListItem>
                <ListItem className="button-list-item">
                  <Button
                    className="button-alternate"
                    outlined
                    onClick={saveWeights}
                  >
                    Save
                  </Button>
                </ListItem>
                <ListItem className="button-list-item">
                  <Button
                    className="button-alternate-clear"
                    outlined
                    onClick={this.handleClick}
                  >
                    Download .stl
                  </Button>
                </ListItem>
              </List>
            </ListGroup>
          </DrawerContent>
        </Drawer>
        <DrawerAppContent className="drawer-app-content">
          <Scene
            geometry={geometry}
            wireframe={wireframe}
            subdivisions={subdivisions}
            adjacentWeight={adjacentWeight}
            edgePointWeight={edgePointWeight}
            connectingEdgesWeight={connectingEdgesWeight}
            exportClicked={exportClicked}
          />
        </DrawerAppContent>
      </React.Fragment>
    );
  }
}

Playground.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  saveWeights: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  geometry: PropTypes.string.isRequired,
  wireframe: PropTypes.bool.isRequired,
  subdivisions: PropTypes.number.isRequired,
  adjacentWeight: PropTypes.number.isRequired,
  edgePointWeight: PropTypes.number.isRequired,
  connectingEdgesWeight: PropTypes.number.isRequired,
};

export default Playground;
