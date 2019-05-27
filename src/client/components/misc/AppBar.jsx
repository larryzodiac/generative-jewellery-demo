/*
  Evan MacHale - N00150552
  26.05.19
  AppBar.js - Miscellaneous modular components folder🔨
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// Material Components
import TopAppBar, {
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
} from '@material/react-top-app-bar';
import MaterialIcon from '@material/react-material-icon';
// My Components
import Tab from './Tab';


/*
  AppBar used for navigation 🚩
*/

const AppBar = (props) => {
  const { tabIndex, toggleTab, toggleDrawer } = props;
  return (
    <TopAppBar className="top-app-bar-alternate">
      <TopAppBarRow>

        <TopAppBarSection align="start">
          <TopAppBarIcon navIcon tabIndex={0}>
            <MaterialIcon className="app-bar-icon" icon="menu" onClick={toggleDrawer} />
          </TopAppBarIcon>
        </TopAppBarSection>

        <TopAppBarSection className="tab-section">
          <Tab tabIndex={tabIndex} toggleTab={toggleTab} />
        </TopAppBarSection>

        <TopAppBarSection align="end">
          <Link to="/logout">
            <TopAppBarIcon actionItem tabIndex={0}>
              <MaterialIcon
                aria-label="exit_to_app"
                className="app-bar-icon"
                icon="exit_to_app"
              />
            </TopAppBarIcon>
          </Link>
        </TopAppBarSection>

      </TopAppBarRow>
    </TopAppBar>
  );
};

AppBar.propTypes = {
  tabIndex: PropTypes.number.isRequired,
  toggleTab: PropTypes.func.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};

export default AppBar;
