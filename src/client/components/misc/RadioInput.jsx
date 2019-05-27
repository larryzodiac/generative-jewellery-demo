/*
  Evan MacHale - N00150552
  26.05.19
  RadioInput.jsx - Miscellaneous modular components folder🔨
*/

import React from 'react';
import PropTypes from 'prop-types';
// Material Design Components
import Radio, { NativeRadioControl } from '@material/react-radio';
import { ListItem, ListItemText, ListItemMeta } from '@material/react-list';

/*
  Geometry list radio button
*/

const RadioInput = (props) => {
  const { name, onChange } = props;
  return (
    <ListItem className="drawer-list-item">
      <ListItemText primaryText={name} />
      <ListItemMeta
        meta={(
          <Radio className="radio-alternate" wrapperClasses="mdc-list-item__meta">
            <NativeRadioControl
              name="geometry"
              value={name}
              id={name}
              onChange={onChange}
            />
          </Radio>
        )}
      />
    </ListItem>
  );
};

RadioInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RadioInput;
