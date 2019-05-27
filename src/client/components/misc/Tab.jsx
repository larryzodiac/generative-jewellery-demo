/*
  Evan MacHale - N00150552
  27.05.19
  Tab.js
*/

import React from 'react';
import PropTypes from 'prop-types';
// Material Design Components
import TabBar from '@material/react-tab-bar';
import { Tab as ReactTab } from '@material/react-tab';

/*
  Tab functions as a work around for integrating top-app-bar and tabs
  MDC React top-app-bar v0.13.0. will upon release
*/

const Tab = (props) => {
  const { tabIndex, toggleTab } = props;
  return (
    <TabBar
      className="tab-bar-alternate"
      activeIndex={tabIndex}
      handleActiveIndexUpdate={toggleTab}
    >
      <ReactTab className="tab-alternate">
        <span className="mdc-tab__text-label">PLAY</span>
      </ReactTab>
      <ReactTab className="tab-alternate">
        <span className="mdc-tab__text-label">SAVED</span>
      </ReactTab>
    </TabBar>
  );
};

Tab.propTypes = {
  tabIndex: PropTypes.number.isRequired,
  toggleTab: PropTypes.func.isRequired,
};

export default Tab;
