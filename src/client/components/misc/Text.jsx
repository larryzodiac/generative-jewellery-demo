/*
  Evan MacHale - N00150552
  25.05.19
  Text.js - Miscellaneous modular components folder🔨
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Material Design Components
import TextField, { HelperText, Input } from '@material/react-text-field';

/*
  TextField_ renders an input for our forms 📝
  Takes name, label, value, onChange
*/

class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: true,
    };
    this.renderHelperText = this.renderHelperText.bind(this);
    this.changeError = this.changeError.bind(this);
  }

  componentDidMount() {
    const { error } = this.props;
    if (error !== '') this.setState({ isValid: false });
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (error !== prevProps.error) this.changeError();
  }

  changeError() {
    const { error } = this.props;
    if (error !== '') {
      this.setState({ isValid: false });
    } else {
      this.setState({ isValid: true });
    }
  }

  renderHelperText() {
    const { isValid } = this.state;
    const { error, name } = this.props;
    if (isValid) {
      if (name === 'confirm') {
        return (<HelperText>{`Please ${name}`}</HelperText>);
      }
      return (<HelperText>{`Please enter your ${name}`}</HelperText>);
    }
    return (
      <HelperText
        isValid={isValid}
        isValidationMessage
        validation
      >
        {error}
      </HelperText>
    );
  }

  render() {
    const { isValid } = this.state;
    const {
      outlined,
      name,
      label,
      value,
      onChange,
      type,
    } = this.props;
    return (
      <React.Fragment>
        {!outlined ? (
          <TextField
            className="form-text-field"
            label={label}
            helperText={this.renderHelperText()}
          >
            <Input
              type={type}
              isValid={isValid}
              name={name}
              value={value}
              onChange={onChange}
            />
          </TextField>
        ) : (
          <TextField
            outlined
            className="drawer-text-field"
            label="name"
          >
            <Input
              className="drawer-text-field-input"
              type={type}
              name={name}
              value={value}
              onChange={onChange}
            />
          </TextField>
        )}
      </React.Fragment>
    );
  }
}

Text.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  type: PropTypes.string,
  outlined: PropTypes.bool,
};

// Specifies the default values for props:
Text.defaultProps = {
  type: 'text',
  error: undefined,
  outlined: false,
};

export default Text;
