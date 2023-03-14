import React, { useEffect } from 'react';
import { useDispatch } from "react-redux"
import { actions } from '../redux/_actions';

const Secure = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.match.params.uid)
      dispatch(actions.verifySignin({ uid: props.match.params.uid }))
  }, [props.match.params.uid, dispatch]);
 
  return (
    <>
    </>
  )
}

export default Secure;
