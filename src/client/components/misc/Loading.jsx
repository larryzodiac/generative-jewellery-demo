/*
  Evan MacHale - N00150552
  28.05.19
  Loading.js - Miscellaneous modular components folder🔨
*/

import React from 'react';
// Material Design Components
import { Cell, Grid, Row } from '@material/react-layout-grid';
import LinearProgress from '@material/react-linear-progress';

/*
  Loading used for async requests waiting
*/

const Loading = () => (
  <Grid className="loading-grid">
    <Row>
      <Cell desktopColumns={4} tabletColumns={3} phoneColumns={1} />
      <Cell desktopColumns={4} tabletColumns={2} phoneColumns={2}>
        <LinearProgress className="linear-progress-alternative" indeterminate />
      </Cell>
      <Cell desktopColumns={4} tabletColumns={3} phoneColumns={1} />
    </Row>
  </Grid>
);

export default Loading;
