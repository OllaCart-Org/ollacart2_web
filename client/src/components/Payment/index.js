import React, { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useToasts } from 'react-toast-notifications';

import CheckoutForm from "./CheckoutForm";
import "./payment.css";

import api from '../../api';

const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export default function App() {
  const [clientSecret, setClientSecret] = useState("");

  const { addToast } = useToasts();

  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);

  const createPaymentIntent = useCallback(() => {
    api.createPaymentIntent()
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch(err => showToast(err.message));
  }, [showToast])

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    createPaymentIntent();
  }, [createPaymentIntent]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="Payment-App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}

