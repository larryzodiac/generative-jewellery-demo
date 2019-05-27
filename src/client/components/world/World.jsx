/*
  Evan MacHale - N00150552
  26.05.19
  World.jsx
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
// Material Design Components
import { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
// My Components
import AppBar from '../misc/AppBar';
import Playground from './Playground';
import Saves from './Saves';
// Context
import { MyContext } from '../../Provider';

/*
  World functions as an environment for creating jewellery 💎
*/

class World extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: true,
      tabIndex: 0,
      navigationIcon: true,
      // For the Scene
      weightId: '',
      name: 'Cube',
      geometry: 'Cube',
      wireframe: false,
      subdivisions: 0,
      adjacentWeight: 0.125,
      edgePointWeight: 0.375,
      connectingEdgesWeight: 5,
    };
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.loadWeights = this.loadWeights.bind(this);
    this.saveWeights = this.saveWeights.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.clear = this.clear.bind(this);
  }

  toggleDrawer() {
    this.setState(prevState => ({ drawerOpen: !prevState.drawerOpen }));
  }

  toggleTab(tabIndex) {
    this.setState(prevState => ({
      tabIndex,
      navigationIcon: !prevState.navigationIcon,
    }));
  }

  handleChange(event) {
    let name, value, w;
    switch (event.target.type) {
      case 'checkbox':
        name = 'wireframe'
        value = event.target.checked
        break;
      case 'slider':
        name = event.target.name
        value = Math.round(event.value * 100) / 100
        break;
      default:
        name = event.target.name
        value = event.target.value
    }
    this.setState({
      [name]: value,
    });
  }

  loadWeights(data) {
    console.log(data);
    this.setState({
      drawerOpen: true,
      tabIndex: 0,
      navigationIcon: true,
      // For the Scene
      weightId: data.weightId,
      name: data.name,
      geometry: data.geometry,
      wireframe: false,
      subdivisions: data.subdivisions,
      adjacentWeight: data.adjacentWeight,
      edgePointWeight: data.edgePointWeight,
      connectingEdgesWeight: data.connectingEdgesWeight,
    });
  }

  saveWeights() {
    const {
      weightId,
      name,
      geometry,
      subdivisions,
      adjacentWeight,
      edgePointWeight,
      connectingEdgesWeight,
    } = this.state
    const { globalUserId } = this.context;
    axios.put('api/users/save', {
      globalUserId,
      weightId,
      name,
      geometry,
      subdivisions,
      adjacentWeight,
      edgePointWeight,
      connectingEdgesWeight,
    });
  }

  handleDelete() {
    this.setState({ weightId: '' });
  }

  clear() {
    this.setState({
      weightId: '',
      name: 'Cube',
      geometry: 'Cube',
      wireframe: false,
      subdivisions: 0,
      adjacentWeight: 0.125,
      edgePointWeight: 0.375,
      connectingEdgesWeight: 5,
    });
  }

  render() {
    // Navigation
    const { drawerOpen, tabIndex, navigationIcon } = this.state;
    // Scene
    const {
      name,
      geometry,
      wireframe,
      subdivisions,
      adjacentWeight,
      edgePointWeight,
      connectingEdgesWeight,
    } = this.state;
    // Context
    const { globalUserId } = this.context;
    return (
      <div className="drawer-container">
        <AppBar
          icon={navigationIcon}
          toggleDrawer={this.toggleDrawer}
          tabIndex={tabIndex}
          toggleTab={this.toggleTab}
        />
        <TopAppBarFixedAdjust className="top-app-bar-fix-adjust">
          {!tabIndex ? (
            <Playground
              drawerOpen={drawerOpen}
              handleChange={this.handleChange}
              saveWeights={this.saveWeights}
              clear={this.clear}
              name={name}
              geometry={geometry}
              wireframe={wireframe}
              subdivisions={subdivisions}
              adjacentWeight={adjacentWeight}
              edgePointWeight={edgePointWeight}
              connectingEdgesWeight={connectingEdgesWeight}
            />
          ) : (
            <Saves
              id={globalUserId}
              loadWeights={this.loadWeights}
              handleDelete={this.handleDelete}
            />
          )}
        </TopAppBarFixedAdjust>
      </div>
    );
  }
}

World.propTypes = {};

export default World;
