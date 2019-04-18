/*
  Evan MacHale - N00150552
  18.04.19
  FunctionList.js
*/

import React, { Component } from 'react';
// My components
import Slider from './input/Slider_';

class FunctionList extends Component {
  render () {
    // function options for slider
    const functions = [
      {label:'Subdivisions', name:'subdivisions', value:this.props.subdivisions, min:0, max:5, step:1},
      {label:'Adjacent Weight', name:'adjacent_weight', value:this.props.adjacent_weight, min:0, max:1, step:null},
      {label:'Edge-Point Weight', name:'edge_point_weight', value:this.props.edge_point_weight, min:0, max:1, step:null},
      {label:'Connecting Edges Weight', name:'connecting_edges_weight', value:this.props.connecting_edges_weight, min:1, max:7, step:1}
    ];
    // Passing Props to generate list
    const functions_list = functions.map(f => {
      return (
        <Slider
          key={f.name}
          label={f.label}
          name={f.name}
          value={f.value}
          onChange={this.props.onChange}
          min={f.min}
          max={f.max}
          step={f.step}
        />
      )
    });

    return (
      <React.Fragment>
        {functions_list}
      </React.Fragment>
    );
  }
}

export default FunctionList;
