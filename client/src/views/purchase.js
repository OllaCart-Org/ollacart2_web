import React, { useState, useEffect, useCallback } from 'react';
import { Drawer } from '@material-ui/core';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useToasts } from 'react-toast-notifications';

import Layout from './layout';
import api from '../api';
import CheckoutForm from '../components/Payment/CheckoutForm';

import Cards from '../components/cards';

const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const Purchase = (props) => {
  const [filter] = useState({purchased: 1});
  const [openPayment, setOpenPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const { addToast } = useToasts();

  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast])

  useEffect(() => {    
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }
    setClientSecret(clientSecret);
    setOpenPayment(true);
  }, [])
  
  const createPaymentIntent = () => {
    api.createPaymentIntent()
      .then((data) => {
        setClientSecret(data.clientSecret);
        setOpenPayment(true);
      })
      .catch(err => showToast(err.message));
  }

  const togglePayment = (value) => {
    if (value) createPaymentIntent();
  }

  return (
    <Layout>
      {<div className='input-button purchase-button' onClick={() => togglePayment(true)}>
        Purchase items
      </div>}
      <Drawer style={{zIndex: 999}} anchor='right' open={openPayment} onClose={() => togglePayment(false)}>
        { clientSecret &&
          <Elements options={{clientSecret, appearance: { theme: 'stripe' }}} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements> }
      </Drawer>
      <Cards
        page='purchase'
        filter={filter}
      />
    </Layout>
  );
};

export default Purchase;
