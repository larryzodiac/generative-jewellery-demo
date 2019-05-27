/*
  Evan MacHale - N00150552
  26.05.19
  GeometryList.jsx
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Material Components
import { ListItem, ListItemText, ListItemMeta } from '@material/react-list';
import Checkbox from '@material/react-checkbox';
// My components
import RadioInput from '../misc/RadioInput';

/*
  List item of radio buttons inserted into drawer
*/

class GeometryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  render() {
    const { checked } = this.state;
    const { onChange } = this.props;
    // Geometries contents
    const geometries = [
      { name: 'Cone', image: 'http://showcase.iadt.ie/assets/CC3/Headshot/N00153748_Profile.jpg' },
      { name: 'Cube', image: 'http://showcase.iadt.ie/assets/CC3/Headshot/N00153748_Profile.jpg' },
      { name: 'Cylinder', image: 'http://showcase.iadt.ie/assets/CC3/Headshot/N00150552_Profile.jpg' },
      { name: 'Dodecahedron', image: 'http://showcase.iadt.ie/assets/CC3/Headshot/N00150552_Profile.jpg' },
      { name: 'Icosahedron', image: 'http://showcase.iadt.ie/assets/CC3/Headshot/N00150552_Profile.jpg' },
      { name: 'Octahedron', image: 'http://showcase.iadt.ie/assets/CC3/Headshot/N00153748_Profile.jpg' },
      { name: 'Tetrahedron', image: 'http://showcase.iadt.ie/assets/CC3/Headshot/N00152737_Profile.jpg' },
      { name: 'Torus', image: 'http://showcase.iadt.ie/assets/CC3/Headshot/N00153748_Profile.jpg' },
    ];
    // Passing Props to generate list
    const geometriesList = geometries.map(g => (
      <RadioInput
        key={g.name}
        name={g.name}
        image={g.image}
        onChange={onChange}
      />
    ));
    return (
      <React.Fragment>
        {geometriesList}
        <ListItem className="drawer-list-item">
          <ListItemText primaryText="Wireframe" />
          <ListItemMeta meta=<Checkbox
            className="checkbox-alternate"
            name="wireframe"
            checked={checked}
            value={checked}
            onChange={onChange}
          />
          />
        </ListItem>
      </React.Fragment>
    );
  }
}

GeometryList.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default GeometryList;
