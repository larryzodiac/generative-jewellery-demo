/*
  Evan MacHale - N00150552
  26.05.19
  SliderInput.jsx - Miscellaneous modular components folder🔨
*/

import React from 'react';
import PropTypes from 'prop-types';
// Material Design Components
import { ListItem, ListItemText, ListItemMeta } from '@material/react-list';
import { MDCSlider } from '@material/slider';

// let slider;

class SliderInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.sliderRef = React.createRef();
    this.layout = true;
    this.slider = undefined;
  }

  componentDidMount() {
    const { onChange, name } = this.props;
    this.slider = new MDCSlider(this.sliderRef.current);
    this.slider.target = { type: 'slider', name };
    this.slider.listen('MDCSlider:change', () => onChange(this.slider));
    this.slider.layout();
    this.forceUpdate(); // Bad..
  }

  componentDidUpdate() {
    this.slider.layout();
  }

  render() {
    const {
      label,
      value,
      name,
      min,
      max,
      onChange,
      continuous,
    } = this.props;
    return (
      <React.Fragment>
        <ListItem className="slider-list-item">
          <ListItemText primaryText={label} />
          <ListItemMeta meta={`${value}`} />
        </ListItem>
        <ListItem className="slider-list-item" id={name}>
          {continuous ? (
            <div
              ref={this.sliderRef}
              className="slider-alternate drawer-slider mdc-slider"
              tabIndex="0"
              role="slider"
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={value}
              aria-label="Select Value"
              onChange={onChange}
            >
              <div className="mdc-slider__track-container">
                <div className="mdc-slider__track" />
              </div>
              <div className="mdc-slider__thumb-container">
                <svg className="mdc-slider__thumb" width="21" height="21">
                  <circle cx="10.5" cy="10.5" r="7.875" />
                </svg>
                <div className="mdc-slider__focus-ring" />
              </div>
            </div>
          ) : (
            <div
              ref={this.sliderRef}
              className="slider-alternate drawer-slider mdc-slider mdc-slider--discrete"
              tabIndex="0"
              role="slider"
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={value}
              aria-label="Select Value"
              onChange={onChange}
            >
              <div className="mdc-slider__track-container">
                <div className="mdc-slider__track" />
              </div>
              <div className="mdc-slider__thumb-container">
                <div className="mdc-slider__pin">
                  <span className="mdc-slider__pin-value-marker" />
                </div>
                <svg className="mdc-slider__thumb" width="21" height="21">
                  <circle cx="10.5" cy="10.5" r="7.875" />
                </svg>
                <div className="mdc-slider__focus-ring" />
              </div>
            </div>
          )}
        </ListItem>
      </React.Fragment>
    );
  }
}

SliderInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  continuous: PropTypes.bool.isRequired,
};

export default SliderInput;
