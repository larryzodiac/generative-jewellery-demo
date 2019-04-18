/*
  Evan MacHale - N00150552
  18.04.19
  Radio_.js
*/

import React, { Component } from 'react';
import Radio, { NativeRadioControl } from '@material/react-radio';
import { ListItem, ListItemText, ListItemMeta } from '@material/react-list';

class Radio_ extends Component {
  render () {
    return (
      <ListItem className='drawer-list-item'>
        <ListItemText primaryText={this.props.name} />
        <ListItemMeta meta=
          <Radio className='radio-alternate' wrapperClasses='mdc-list-item__meta'>
            <NativeRadioControl
              name='geometry'
              value={this.props.name}
              id={this.props.name}
              onChange={this.props.onChange}
            />
          </Radio>
        />
      </ListItem>
    );
  }
}

export default Radio_;