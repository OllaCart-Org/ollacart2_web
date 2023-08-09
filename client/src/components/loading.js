import { CircularProgress } from '@material-ui/core';
import React from 'react';
import './loading.scss';

const Loading = () => {
  return (
    <div className="loading-container">
      <CircularProgress className='loading-spinner' />
    </div>
  );
};

export default Loading;
