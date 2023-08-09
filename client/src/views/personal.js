import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Snackbar } from '@material-ui/core';
import api from '../api';
import utils from '../utils';
import Layout from './layout';

const Personal = () => {  
  const [value, setValue] = useState('');  
  const [error, setError] = useState('');

  const history = useHistory();

  const request = () => {
    let email = value;
    email = (email || '').replace(/ /g, '').toLocaleLowerCase();
    if (!email) return setError('Input valid email!');
    if (!utils.validateEmail(email)) return setError('Input valid email!');
    api.request(email)
      .then(() => {
        history.push('/signin')
      });
  }

  return (
    <Layout>
      <div className='sign-in'>
        <div className="input-label">
          Request user data
        </div>
        <div className="input-text">
          <input value={value} onChange={(e) => setValue(e.target.value)}/>
        </div>
        <button className="input-button" onClick={request}>
          Request
        </button>
      </div>
      <Snackbar open={!!error} autoHideDuration={6000} anchorOrigin={{vertical: 'top', horizontal: 'center'}} onClose={() => setError('')}>
        <div className="error-msg">{error}</div>
      </Snackbar>
    </Layout>
  )
}

export default Personal;
