/*
  Evan MacHale - N00150552
  18.04.19
  GeometryList.js
*/

import React, { Component } from 'react';
import { ListItem, ListItemText, ListItemMeta } from '@material/react-list';
import Checkbox from '@material/react-checkbox';
// My components
import Radio from './input/Radio_';

class GeometryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };
  }

  render() {
    // Geometries contents
    const geometries = [
      {name:'Cone', image:'http://showcase.iadt.ie/assets/CC3/Headshot/N00153748_Profile.jpg'},
      {name:'Cube', image:'http://showcase.iadt.ie/assets/CC3/Headshot/N00153748_Profile.jpg'},
      {name:'Cylinder', image:'http://showcase.iadt.ie/assets/CC3/Headshot/N00150552_Profile.jpg'},
      {name:'Dodecahedron', image:'http://showcase.iadt.ie/assets/CC3/Headshot/N00150552_Profile.jpg'},
      {name:'Icosahedron', image:'http://showcase.iadt.ie/assets/CC3/Headshot/N00150552_Profile.jpg'},
      {name:'Octahedron', image:'http://showcase.iadt.ie/assets/CC3/Headshot/N00153748_Profile.jpg'},
      {name:'Tetrahedron', image:'http://showcase.iadt.ie/assets/CC3/Headshot/N00152737_Profile.jpg'},
      {name:'Torus', image:'http://showcase.iadt.ie/assets/CC3/Headshot/N00153748_Profile.jpg'}
    ];
    // Passing Props to generate list
    const geometries_list = geometries.map(g => {
      return (
        <Radio
          key={g.name}
          name={g.name}
          image={g.image}
          onChange={this.props.onChange}
        />
      );
    });

    return (
      <React.Fragment>
        {geometries_list}
        <ListItem className='drawer-list-item'>
          <ListItemText primaryText='Wireframe' />
          <ListItemMeta meta=
            <Checkbox
              className='checkbox-alternate'
              name='wireframe'
              checked={this.state.checked}
              value={this.state.checked}
              onChange={this.props.onChange}
            />
          />
        </ListItem>
      </React.Fragment>
    );
  }
}

export default GeometryList;