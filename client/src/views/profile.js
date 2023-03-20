import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { useToasts } from 'react-toast-notifications';
import { Button, FormControl, IconButton, InputLabel, MenuItem, Select, Switch, TextField } from '@material-ui/core';
import { actions } from '../redux/_actions';
import { Country, State }  from 'country-state-city';
import Layout from './layout';
import api from '../api';

import './profile.scss';
import { AccountBox, ContactMail, ExitToApp, Feedback, HorizontalSplit, LocalLibrary, PersonPin, Receipt, RotateLeft, Save, Security, Send } from '@material-ui/icons';

const Profile = () => {
  const [shipping, setShipping] = useState({});
  const [profile, setProfile] = useState({});
  const [feedback, setFeedback] = useState({});
  const [status, setStatus] = useState({
    secure: false,
    promo_code: false,
    shopping_recommendation: false,
    tax: false,
    anonymous_shopping: false
  });
  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);

  const { email } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);

  useEffect(() => {
    api.getAccountSettings()
      .then(data => {
        setShipping(data?.user?.shipping || {});
        setStatus(data?.user?.status || {});
        setProfile({
          name: data?.user?.name || '',
          username: data?.user?.username || '',
          phone: data?.user?.phone || '',
        })
      })
      .catch(err => showToast(err.message));
  }, [showToast])

  useEffect(() => {
    setStates(State.getStatesOfCountry(shipping.country));
  }, [shipping]);

  const signout = () => {
    dispatch(actions.signout())
  }

  const shippingValueChanged = (e) => {
    shipping[e.target.name] = e.target.value;
    if(e.target.name === 'country') shipping.state = '';
    setShipping({ ...shipping });
  }

  const resetShipping = () => {
    setShipping({});
  }

  const saveShippingAddress = () => {
    api.updateAccountSettings({ shipping })
    .then(() => {
        showToast('Saved shipping address', 'success');
      })
      .catch(err => showToast(err.message));
  }


  const feedbackValueChanged = (e) => {
    feedback[e.target.name] = e.target.value;
    setFeedback({ ...feedback });
  }

  const resetFeedback = () => {
    setFeedback({});
  }

  const sendFeedback = () => {
    feedback.name = '';
    feedback.email = email;
    if (!feedback.comment) return showToast('Please input comments');
    
    api.sendFeedback(feedback)
    .then(() => {
        showToast('Feedback sent', 'success');
        resetFeedback();
      })
      .catch(err => showToast(err.message));
  }

  const profileValueChanged = (e) => {
    profile[e.target.name] = e.target.value;
    setProfile({ ...profile });
  }

  const resetProfile = () => {
    setProfile({});
  }
  
  const saveProfile = () => {
    api.updateAccountSettings({ name: profile.name, phone: profile.phone, username: profile.username })
    .then(() => {
        showToast('Saved profile', 'success');
      })
      .catch(err => showToast(err.message));
  }

  const switchChanged = (e) => {
    const { name, checked } = e.target;
    api.updateAccountSettings({ status: { [name]: checked } })
    .then(() => {
        if (name === 'secure' && checked) {
          showToast('Secure email sent', 'success');
        } else {
          setStatus({
            ...status,
            [name]: checked
          })
        }
      })
      .catch(err => showToast(err.message));
  }

  return (
    <Layout>
      <div className='profile-page'>
        <div className='top-buttons-wrapper'>
          <div className='email-header'>{email}</div>
          <div className='signout-button' onClick={signout}>
            <ExitToApp />
            <span>Signout</span>
          </div>
        </div>
        <div className='profile-settings'>
          <div className='left-side'>
            <div className='switch-wrapper'>
              <Security />
              <div className='text-content'>Secure my Account</div>
              <Switch color='primary' name='secure' checked={status.secure} onChange={switchChanged} />
            </div>
            <div className='switch-wrapper'>
              <Receipt />
              <div className='text-content'>Include tax in Orders</div>
              <Switch color='primary' name='tax' checked={status.tax} onChange={switchChanged} />
            </div>
            <div className='switch-wrapper'>
              <HorizontalSplit />
              <div className='text-content'>Include Promo Codes</div>
              <Switch color='primary' name='promo_code' checked={status.promo_code} onChange={switchChanged} />
            </div>
            <div className='switch-wrapper'>
              <LocalLibrary />
              <div className='text-content'>Personal Shopping Recommendations</div>
              <Switch color='primary' name='shopping_recommendation' checked={status.shopping_recommendation} onChange={switchChanged} />
            </div>
            <div className='switch-wrapper'>
              <PersonPin />
              <div className='text-content'>Anonymous Shopping</div>
              <Switch color='primary' name='anonymous_shopping' checked={status.anonymous_shopping} onChange={switchChanged} />
            </div>
          </div>
          <div className='right-side'>
            <div className='form-wrapper'>
              <div className='switch-wrapper'>
                <AccountBox />
                <div className='text-content'>Profile</div>
                <div className='toolbox'>
                  <IconButton size='small' color='inherit' onClick={resetProfile}><RotateLeft /></IconButton>
                </div>
              </div>
              <div className='form-content'>
                <TextField className='form-input' label='Account Name' size='small' variant='outlined' fullWidth color='primary' name='username'
                  value={profile.username || ''} onChange={profileValueChanged} />
                <TextField className='form-input' label='Full Name' size='small' variant='outlined' fullWidth color='primary' name='name'
                  value={profile.name || ''} onChange={profileValueChanged} />
                <TextField className='form-input' label='Phone' size='small' variant='outlined' fullWidth name='phone'
                  value={profile.phone || ''} onChange={profileValueChanged} />
                <div className='bottom-buttons'>
                  <Button variant='contained' color='primary' size='small' startIcon={<Save />} onClick={saveProfile}>Save</Button>
                </div>
              </div>
            </div>
            <div className='form-wrapper'>
              <div className='switch-wrapper'>
                <ContactMail />
                <div className='text-content'>Shipping Address</div>
                <div className='toolbox'>
                  <IconButton size='small' color='inherit' onClick={resetShipping}><RotateLeft /></IconButton>
                </div>
              </div>
              <div className='form-content'>
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
                  <Button variant='contained' color='primary' size='small' startIcon={<Save />} onClick={saveShippingAddress}>Save</Button>
                </div>
              </div>
            </div>
            <div className='form-wrapper'>
              <div className='switch-wrapper'>
                <Feedback />
                <div className='text-content'>Give us Feedback</div>
                <div className='toolbox'>
                  <IconButton size='small' color='inherit' onClick={resetFeedback}><RotateLeft /></IconButton>
                </div>
              </div>
              <div className='form-content'>
                <TextField className='form-input' label='Feedback' size='small' variant='outlined' fullWidth color='primary' name='comment' multiline rows={4}
                  value={feedback.comment || ''} onChange={feedbackValueChanged} />
                <div className='bottom-buttons'>
                  <Button variant='contained' color='primary' size='small' startIcon={<Send />} onClick={sendFeedback}>Send</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile;
