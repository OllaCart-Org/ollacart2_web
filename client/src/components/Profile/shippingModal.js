import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import OllaCartModal from '../modal';
import { Country, State } from 'country-state-city';
import { useToasts } from 'react-toast-notifications';
import api from '../../api';

const ShippingModal = ({ open, onClose }) => {
  const { addToast } = useToasts();

  const [shipping, setShipping] = useState({});
  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);

  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);

  useEffect(() => {
    api.getAccountSettings()
      .then(data => {
        setShipping({
          ...data?.user?.shipping,
          name: data?.user?.name || ''
        });
      })
      .catch(err => showToast(err.message));
  }, [showToast])

  useEffect(() => {
    setStates(State.getStatesOfCountry(shipping.country));
  }, [shipping]);

  const shippingValueChanged = (e) => {
    shipping[e.target.name] = e.target.value;
    if (e.target.name === 'country') shipping.state = '';
    setShipping({ ...shipping });
  }

  const saveShippingAddress = () => {
    api.updateAccountSettings({ shipping, name: shipping.name })
      .then(() => {
        showToast('Saved shipping address', 'success');
      })
      .catch(err => showToast(err.message));
  }

  return (
    <OllaCartModal open={open} onClose={onClose} title='Shopping Recommendation'>
      <Box width={350} maxWidth='100%' paddingY={1}>
        <Typography variant='h5'>Please fill in shipping information before purchase!</Typography>
        <div className='form-content'>
          <TextField className='form-input' label='Full Name' size='small' variant='outlined' fullWidth color='primary' name='name'
            value={shipping.name || ''} onChange={shippingValueChanged} />
          <div className='two-inputs'>
            <FormControl className='form-control' variant="outlined" fullWidth size='small'>
              <InputLabel id="country-label">Country</InputLabel>
              <Select className='form-input' labelWidth={60} labelId='country-label' name='country' value={shipping.country || ''} onChange={shippingValueChanged}>
                {countries.map((c, idx) => (
                  <MenuItem key={idx} value={c.isoCode}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className='form-control' variant="outlined" fullWidth size='small'>
              <InputLabel id="state-label">State</InputLabel>
              <Select className='form-input' labelWidth={40} labelId='state-label' name='state' value={shipping.state || ''} onChange={shippingValueChanged}>
                {states.map((c, idx) => (
                  <MenuItem key={idx} value={c.isoCode}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <TextField className='form-input' label='City' size='small' variant='outlined' fullWidth color='primary' name='city'
            value={shipping.city || ''} onChange={shippingValueChanged} />
          <TextField className='form-input' label='Address Line 1' size='small' variant='outlined' fullWidth color='primary' name='line1'
            value={shipping.line1 || ''} onChange={shippingValueChanged} />
          <TextField className='form-input' label='Address Line 2' size='small' variant='outlined' fullWidth color='primary' name='line2'
            value={shipping.line2 || ''} onChange={shippingValueChanged} />
          <TextField className='form-input' label='Postal Code' size='small' variant='outlined' fullWidth color='primary' name='postal_code'
            value={shipping.postal_code || ''} onChange={shippingValueChanged} />
          <div className='bottom-buttons'>
            <Button variant='contained' color='primary' size='small' startIcon={<saveShippingAddress />} onClick={saveShippingAddress}>Save</Button>
          </div>
        </div>
      </Box>
    </OllaCartModal>
  )
}

export default ShippingModal;