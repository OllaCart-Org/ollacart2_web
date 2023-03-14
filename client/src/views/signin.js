import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import { Snackbar } from '@material-ui/core';
import api from '../api';
import { actions } from '../redux/_actions';
import Layout from './layout';

const Signin = () => {
  const [value, setValue] = useState('');
  const [interv, setInterv] = useState(null);
  
  const dispatch = useDispatch();
  const { error, verifying, secure_identity } = useSelector(state => state.auth);

  useEffect(() => {
    if (verifying && !interv) {
      const checkSecureVerified = () => {
        api.checkSecureVerified(secure_identity)
          .then((data) => {
            if(data.success) {
              clearInterval(interv);
              setInterv(null);
              dispatch(actions.verifySignin({ uid: secure_identity }))
            }
          });
      }

      if (interv) clearInterval(interv);
      const interval = setInterval(checkSecureVerified, 5000);
      setInterv(interval)
    }
  }, [verifying, interv, secure_identity, dispatch])

  const signin = () => {
    dispatch(actions.signin({ email: value }))
  }

  return (
    <Layout>
      <div className='sign-in'>
        <div className="input-label">
          Sign in with your email
        </div>
        <div className="input-description">
          To create an account just enter your email and sign in.<br/>
          On your browser, download the extension from the chrome web store to sign up.
        </div>
        <div className="input-text">
          <input value={value} onChange={(e) => setValue(e.target.value)}/>
        </div>
        <button className="input-button" onClick={signin}>
          Sign In
        </button>
        
        <div className="input-description">
          Signing up signifies that you have read and agree to the <Link to="/terms-of-service">Terms of Service</Link> and our <Link to="/privacy-policy">Privacy Policy</Link>.
        </div>
        {verifying && <div className='verify-container'>
          This account is secured.<br/>Please check your email to complete login.
        </div>}
      </div>
      <Snackbar open={!!error} autoHideDuration={6000} anchorOrigin={{vertical: 'top', horizontal: 'center'}} onClose={() => dispatch(actions.setError(''))}>
        <div className="error-msg">{error}</div>
      </Snackbar>
    </Layout>
  )
}

export default Signin;
