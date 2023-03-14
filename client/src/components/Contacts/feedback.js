import React, { useState, useCallback } from 'react';
import { Box, Button, TextField, Typography } from '@material-ui/core';
import { useToasts } from 'react-toast-notifications';
import utils from '../../utils';
import './contact.scss';
import api from '../../api';

const Feedback = ({ onClose }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    comment: '',
  });

  const { addToast } = useToasts();
  
  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast])

  const inputValueChanged = (e) => {
    form[e.target.name] = e.target.value;
    setForm({ ...form });
  }

  const submitHandler = () => {
    if (!form.name) return showToast('Please input name');
    if (!utils.validateEmail(form.email)) return showToast('Please input valid email');
    if (!form.comment) return showToast('Please input comments');

    api.sendFeedback(form)
      .then(() => {
        showToast('Feedback sent', 'success');
        onClose();
      })
      .catch(err => showToast(err.message));
  }

  return (
    <Box className='contact-form'>
      <Typography>Thanks in advance for your help in making OllaCart better. We are excited to hear from you.</Typography>
      <TextField className='form-input' label='Name' size='small' variant='outlined' fullWidth color='primary' name='name' onChange={inputValueChanged} />
      <TextField className='form-input' label='Email' size='small' variant='outlined' fullWidth color='primary' name='email' onChange={inputValueChanged} />
      <TextField className='form-input' label='Comment' size='small' variant='outlined' fullWidth color='primary' name='comment' onChange={inputValueChanged} multiline rows={4} />
      <Box className='bottom-buttons'>
        <Button variant='contained' color='primary' onClick={submitHandler}>Submit</Button>
        <Button variant='contained' onClick={onClose}>Cancel</Button>
      </Box>
    </Box>
  )
}

export default Feedback;