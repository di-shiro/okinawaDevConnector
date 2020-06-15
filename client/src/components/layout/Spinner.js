import React, { Fragment } from 'react';
import spinner from './Spinner-1s-200px.svg';

export default () => (
  <Fragment>
    <img
      src={spinner}
      style={{ width: '200px', margin: 'auto', display: 'block' }}
      alt='Loading...'
    />
  </Fragment>
);
