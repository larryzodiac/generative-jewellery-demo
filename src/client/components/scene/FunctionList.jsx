/*
  Evan MacHale - N00150552
  26.05.19
  FunctionList.jsx
*/

import React from 'react';
import PropTypes from 'prop-types';
// My components
import SliderInput from '../misc/SliderInput';

/*
  List
*/

const FunctionList = (props) => {
  const {
    subdivisions,
    adjacentWeight,
    edgePointWeight,
    connectingEdgesWeight,
    onChange,
  } = props;
  // function options for slider
  const functions = [
    {
      label: 'Subdivisions', name: 'subdivisions', value: subdivisions, continuous: false, min: 0, max: 5, step: 1,
    },
    {
      label: 'Adjacent Weight', name: 'adjacentWeight', value: adjacentWeight, continuous: true, min: 0, max: 1, step: null,
    },
    {
      label: 'Edge-Point Weight', name: 'edgePointWeight', value: edgePointWeight, continuous: true, min: 0, max: 1, step: null,
    },
    {
      label: 'Connecting Edges Weight', name: 'connectingEdgesWeight', value: connectingEdgesWeight, continuous: true, min: 1, max: 7, step: 1,
    },
  ];
  // Passing Props to generate list
  const functionsList = functions.map(f => (
    <SliderInput
      key={f.name}
      label={f.label}
      name={f.name}
      value={f.value}
      onChange={onChange}
      min={f.min}
      max={f.max}
      step={f.step}
      continuous={f.continuous}
    />
  ));
  return (
    <React.Fragment>
      {functionsList}
    </React.Fragment>
  );
};

FunctionList.propTypes = {
  subdivisions: PropTypes.number.isRequired,
  adjacentWeight: PropTypes.number.isRequired,
  edgePointWeight: PropTypes.number.isRequired,
  connectingEdgesWeight: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FunctionList;
