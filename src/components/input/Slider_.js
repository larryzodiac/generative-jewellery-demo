/*
  Evan MacHale - N00150552
  18.04.19
  Slider_.js
*/

import React from 'react';
import { ListItem, ListItemText, ListItemMeta } from '@material/react-list';
import Slider from '@material-ui/lab/Slider';
import { MDCSlider } from '@material/slider';

class Slider_ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
    this.sliderRef = React.createRef();
  }

  componentDidMount() {
    this.slider = new MDCSlider(this.sliderRef.current);
  }

  render() {
    return (
      <React.Fragment>
        <ListItem className='drawer-list-item'>
          <ListItemText primaryText={this.props.label} />
          <ListItemMeta meta={`${this.props.value}`} />
        </ListItem>
        <ListItem id={this.props.name} className='drawer-slider'>
          <Slider classes={{thumb: 'drawer-slider-material', trackBefore: 'drawer-slider-material'}}
            min={this.props.min}
            max={this.props.max}
            step={this.props.step}
            value={this.props.value}
            aria-labelledby='label'
            onChange={this.props.onChange}
          />
        </ListItem>
          <div ref={this.sliderRef} className="slider-div mdc-slider" tabIndex="0" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Select Value">
            <div className="mdc-slider__track-container">
              <div className="mdc-slider__track"></div>
            </div>
            <div className="mdc-slider__thumb-container">
              <svg className="mdc-slider__thumb" width="21" height="21">
                <circle cx="10.5" cy="10.5" r="7.875"></circle>
              </svg>
              <div className="mdc-slider__focus-ring"></div>
            </div>
          </div>
      </React.Fragment>
    );
  }
}

export default Slider_;
