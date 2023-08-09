import React, { useEffect, useState, useCallback } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useToasts } from 'react-toast-notifications';
import OllaCartModal from "../modal";
import './payment.scss'

const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;
const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const SimplePurchase = ({ clientSecret, redirect }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { addToast } = useToasts();

  const [isLoading, setIsLoading] = useState(false);
  
  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance });
  }, [addToast])
  
  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }
  }, [stripe, clientSecret]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: PUBLIC_URL + redirect,
      },
    });
    
    if (error.type === "card_error" || error.type === "validation_error") {
      showToast(error.message);
    } else {
      showToast("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs"
  }

  if (!clientSecret) return '';
  
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button id="pay-now-element" disabled={isLoading || !stripe || !elements}>
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
    </form>
  )
}

const SimplePurchaseModal = ({ clientSecret, redirect, open, onClose, title }) => {
  if (!clientSecret) return '';
  return (
    <OllaCartModal open={open} onClose={onClose} title={title}>
      <Elements options={{clientSecret, appearance: { theme: 'night' }}} stripe={stripePromise}>
        <SimplePurchase clientSecret={clientSecret} redirect={redirect} />
      </Elements>
    </OllaCartModal>
  )
}

export default SimplePurchaseModal;