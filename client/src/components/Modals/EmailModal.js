import { Box, Button, TextField } from '@material-ui/core';
import React, { useState, useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';
import utils from '../../utils';
import CartMultiLogo from '../Logo/cartmulti';
import OllaCartModal from '../modal';

const EmailModal = ({ open, onClose, title, buttonName, onSubmit }) => {
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
      <TextField className='form-input' label='Email Address' size='small' variant='outlined' fullWidth color='primary'
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <Box pt={1} display='flex' justifyContent='end'>
        <Button variant='contained' color='primary' size='small' startIcon={<CartMultiLogo />} onClick={onClick}>{buttonName || 'Submit'}</Button>
      </Box>
    </OllaCartModal>
  )
}

export default EmailModal;