import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import { useToasts } from 'react-toast-notifications';
import api from '../api';
import { actions } from '../redux/_actions';
import './signin.scss';

const Signin = () => {
  const [value, setValue] = useState('');
  const [interv, setInterv] = useState(null);
  
  const { verifying, secure_identity } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);

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
          })
          .catch(err => showToast(err.message));
      }

      if (interv) clearInterval(interv);
      const interval = setInterval(checkSecureVerified, 5000);
      setInterv(interval)
    }
  }, [verifying, interv, secure_identity, dispatch, showToast])

  const signin = () => {
    dispatch(actions.signin({ email: value }))
  }

  return (
    <div>
      <div className='sign-in'>
        <h3 className="input-label">
          Sign in with your email
        </h3>
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
        {verifying ? <div className='verify-container'>
          This account is secured.<br/>Please check your email to complete login.
        </div> : ''}
      </div>
    </div>
  )
}

export default Signin;
