import React, { useState, useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';
import utils from '../../utils';
import OllaCartModal from '../modal';

const EmailModal = ({ open, onClose, title, onSubmit }) => {
  const [email, setEmail] = useState('');

  const { addToast } = useToasts();
  
  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast])

  const onClick = () => {
    const _email = (email || '').replace(/ /g, '').toLocaleLowerCase();
    if (!_email) return showToast('Input valid email address');
    if (!utils.validateEmail(_email)) return showToast('Input valid email address');
    onSubmit(_email);
  }

  return (
    <OllaCartModal open={open} onClose={onClose} title={title}>
      <div className="input-label"> Input your email address </div>
      <div className="input-text">
        <input value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <button className="input-button" onClick={onClick}>
        Follow
      </button>
    </OllaCartModal>
  )
}

export default EmailModal;