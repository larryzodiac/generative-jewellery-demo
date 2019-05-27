/*
  Evan MacHale - N00150552
  27.05.19
  SavesCard.jsx
*/

import React from 'react';
import PropTypes from 'prop-types';
// Material Design Components
import Card, {
  CardActions,
  CardActionIcons,
} from '@material/react-card';
import { Cell, Row } from '@material/react-layout-grid';
import MaterialIcon from '@material/react-material-icon';
import IconButton from '@material/react-icon-button';
import { Body1 } from '@material/react-typography';

/*
  Card displays a saved geometry's weights
  Mapped over in Saves.js
*/

const SavesCard = (props) => {
  const {
    name,
    loadWeights,
    deleteWeights,
    data,
  } = props;
  return (
    <React.Fragment>
      <Row>
        <Cell desktopColumns={4} tabletColumns={3} />
        <Cell desktopColumns={4} tabletColumns={2} phoneColumns={4}>
          <Card>
            <CardActions>
              <Body1 className="type-heavy">{name}</Body1>
              <CardActionIcons>
                <IconButton onClick={() => deleteWeights(data.weightId)}>
                  <MaterialIcon className="card-delete" icon="fiber_manual_record" />
                </IconButton>
                <IconButton onClick={() => loadWeights(data)}>
                  <MaterialIcon className="card-play" icon="play_arrow" />
                </IconButton>
              </CardActionIcons>
            </CardActions>
          </Card>
        </Cell>
        <Cell desktopColumns={4} tabletColumns={3} />
      </Row>
    </React.Fragment>
  );
};

SavesCard.propTypes = {
  name: PropTypes.string.isRequired,
  loadWeights: PropTypes.func.isRequired,
  deleteWeights: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default SavesCard;
