import React, { useEffect, useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';
import api from '../api';

const Secure = (props) => {
  const { addToast } = useToasts();

  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);

  const verifyEmail = useCallback((uid) => {
    api.verifySecure(uid)
      .then(() => {
        window.location.href = '/profile';
      })
      .catch(err => showToast(err.message));
  }, [showToast]);

  useEffect(() => {
    if(!props.match.params.uid) return ;
    verifyEmail(props.match.params.uid);
  }, [props.match.params.uid, verifyEmail]);
 
  return (
    <>
    </>
  )
}

export default Secure;
