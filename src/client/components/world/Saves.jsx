/*
  Evan MacHale - N00150552
  27.05.19
  Saves.jsx
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
// Material Design Components
import Card, {
  CardActions,
  CardActionIcons,
} from '@material/react-card';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import MaterialIcon from '@material/react-material-icon';
import IconButton, { IconToggle } from '@material/react-icon-button';
import { Headline4, Body1 } from '@material/react-typography';
// My Components
import SavesCard from '../misc/SavesCard';
import Loading from '../misc/Loading';

/*
  Saves displays data for the logged in user
*/

class Saves extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weights: [],
      loading: true,
    };
    this.fetchWeights = this.fetchWeights.bind(this);
    this.deleteWeights = this.deleteWeights.bind(this);
  }

  componentDidMount() {
    this.fetchWeights();
  }

  fetchWeights() {
    const { id } = this.props;
    axios.get(`api/users/${id}`)
      .then((response) => {
        this.setState({ loading: true });
        if (response.status === 200) {
          this.setState({
            weights: response.data.weights,
            loading: false,
          });
        }
      })
      .catch((err) => {
        if (err) {
          this.setState({
            loading: false,
          });
        }
      });
  }

  deleteWeights(id) {
    const { handleDelete } = this.props;
    axios.put(`api/users/delete/${id}`)
      .then((response) => {
        if (response.status === 200) {
          this.fetchWeights();
          handleDelete();
        }
      });
  }

  render() {
    const { weights, loading } = this.state;
    const { id, loadWeights } = this.props;
    const weightsList = weights.map(w => (
      <SavesCard
        key={w.name}
        id={id}
        loadWeights={loadWeights}
        deleteWeights={this.deleteWeights}
        name={w.name}
        data={{
          weightId: w.weight_id,
          name: w.name,
          geometry: w.geometry,
          subdivisions: w.subdivisions,
          adjacentWeight: w.adjacentWeight,
          edgePointWeight: w.edgePointWeight,
          connectingEdgesWeight: w.connectingEdgesWeight,
        }}
      />
    ));
    return (
      <Grid align="right">
        <Row>
          <Cell desktopColumns={4} tabletColumns={3} />
          <Cell desktopColumns={4} tabletColumns={2}>
            <Headline4 className="saves-header type-heavy">Saved Geometries</Headline4>
          </Cell>
          <Cell desktopColumns={4} tabletColumns={3} />
        </Row>
        {weightsList}
        <Row>
          <Cell desktopColumns={4} tabletColumns={3} />
          <Cell desktopColumns={4} tabletColumns={2} phoneColumns={4}>
            <Card className="card-empty">
              <CardActions>
                <Body1 />
                <CardActionIcons>
                  <IconButton disabled>
                    <MaterialIcon className="card-empty-delete material-icons-outlined" icon="fiber_manual_record" />
                  </IconButton>
                  <IconButton disabled>
                    <MaterialIcon className="card-empty-play material-icons-outlined" icon="play_arrow" />
                  </IconButton>
                </CardActionIcons>
              </CardActions>
            </Card>
          </Cell>
          <Cell desktopColumns={4} tabletColumns={3} />
        </Row>
      </Grid>
    );
  }
}

Saves.propTypes = {
  id: PropTypes.string.isRequired,
  loadWeights: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Saves;
