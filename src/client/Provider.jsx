/*
  Evan MacHale - N00150552
  25.05.19
  Provider.jsx
*/

import React from 'react';
import PropTypes from 'prop-types';

/*
  Provider acts as a wrapper at top level for context 📚
  https://www.youtube.com/watch?v=XLJN4JfniH4
*/

export const MyContext = React.createContext();

const Provider = (props) => {
  /*
    globalUserId defined on login success from App
    It is then accessible thorughout the application through context
    It is used to match articles to users when performing HTTP methods
  */
  const { globalUserId } = props;
  const { children } = props;
  return (
    // value to be passed to each Provider.Consumer
    <MyContext.Provider
      value={{
        globalUserId,
      }}
    >
      { children }
    </MyContext.Provider>
  );
};

Provider.propTypes = {
  globalUserId: PropTypes.string.isRequired,
  children: PropTypes.shape().isRequired,
};

export default Provider;
