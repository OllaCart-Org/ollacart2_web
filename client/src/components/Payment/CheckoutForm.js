import React, { useEffect, useState, useCallback } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
  AddressElement
} from "@stripe/react-stripe-js";
import commaNumber from "comma-number";
import { useSelector } from "react-redux";
import { useToasts } from 'react-toast-notifications';

import api from "../../api";

import './payment.scss'
import { IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";

const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;

export default function CheckoutForm(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  // const [totalFee, setTotalFee] = useState(0);
  const [defaultLoaded, setDefaultLoaded] = useState(false);
  const [defaultShipping, setDefaultShipping] = useState({});
  const [shipping, setShipping] = useState({});
  
  const { email } = useSelector(state => state.auth);
  const stripe = useStripe();
  const elements = useElements();
  const { addToast } = useToasts();

  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance });
  }, [addToast])

  const fetchProducts = useCallback(async () => {
    api.fetchProductsByClientSecret(props.clientSecret)
        .then((data) => {
          setProducts([{
              photo: 'https://i.postimg.cc/PJfjfcJq/stripe-icon.png',
              name: 'Processing Fee',
              price: data.totalFee,
              description: 'Stripe Fee (2.9% + 30¢)'
            },
            ...data.products.map(itm => {
              itm.description = 'Shipping Cost:  +$14';
              itm.price += 14;
              return itm;
            })
          ]);
          setTotalPrice(data.totalPrice);
          // setTotalFee(data.totalFee);
        })
        .catch(err => showToast(err.message));
  }, [props.clientSecret, showToast])

  useEffect(() => {
    api.getAccountSettings()
      .then(data => {
        const user = data?.user;
        const ship = data?.user?.shipping;
        setDefaultShipping({
          name: user.name || '',
          phone: user.phone || '',
          address: {
            line1: ship?.line1 || '',
            line2: ship?.line2 || '',
            country: ship?.country || '',
            city: ship?.city || '',
            state: ship?.state || '',
            postal_code: ship?.postal_code || '',
          }
        });
        setDefaultLoaded(true);
      })
      .catch(err => showToast(err.message));
  }, [showToast])

  useEffect(() => {
    if (!stripe || !props.clientSecret) {
      return;
    }
    
    showToast('Please note. Shipping is estimated and the difference in actual cost of shipping will be refunded. Currently, all purchase orders are refundable except stripe processing fee.', 'success');
    fetchProducts();

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );    

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          showToast("Payment succeeded!", 'success');
          break;
        case "processing":
          showToast("Your payment is processing.", 'warning');
          break;
        case "requires_payment_method":
          showToast("Your payment was not successful, please try again.");
          break;
        default:
          showToast("Something went wrong.");
          break;
      }
    });
  }, [stripe, props.clientSecret, fetchProducts, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    
    api.updateAccountSettings({ name: shipping.name, phone: shipping.phone, shipping: shipping.address })
      .then(async () => {
        setIsLoading(true);
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            // Make sure to change this to your payment completion page
            return_url: PUBLIC_URL + '/order',
          },
        });
    
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
          showToast(error.message);
        } else {
          showToast("An unexpected error occurred.");
        }
    
        setIsLoading(false);
      })
      .catch(err => showToast(err.message));
  };

  const paymentElementOptions = {
    layout: "tabs"
  }

  const addressElementChanged = (event) => {
    setShipping(event.value)
  }

  if (!defaultLoaded) return '';

  return (
    <div className='Payment-App'>
      <IconButton aria-label="Close" className='close-button' onClick={props.onClose}>
        <Close />
      </IconButton>
      <div className="payment-details">
        <div className="payment-total-price">${commaNumber(totalPrice.toFixed(2))}</div>
        <div className="payment-products">
          {products.map((itm, idx) => (
            <div key={idx}>
              <div className="payment-product">
                <div className="payment-product-img">
                  {itm.photo && <img src={itm.photo} alt="logo" />}
                </div>
                <div className="payment-product-detail">
                  <div className="payment-product-name">{itm.name}</div>
                  <div className="payment-product-description">{itm.description || ''}</div>
                </div>
                <div className="payment-product-price">${commaNumber(itm.price.toFixed(2))}</div>
              </div>
              {(idx === 0) && <hr />}
            </div>
          ))}
        </div>
      </div>
      <form id="payment-form" onSubmit={handleSubmit}>
        <LinkAuthenticationElement options={{defaultValues: {email}}} id="link-authentication-element" />
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <AddressElement id="address-element" options={{mode: 'shipping', fields: { phone: 'always' }, defaultValues: defaultShipping}} onChange={addressElementChanged} />
        <button id="pay-now-element" disabled={isLoading || !stripe || !elements}>
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
          </span>
        </button>
      </form>
    </div>
  );
}