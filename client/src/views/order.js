import React, { useState, useEffect, useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';

import Card from '../components/card';
import NoCard from '../components/nocard';
import Layout from './layout';
import api from '../api';

const Order = () => {
  const [cards, setCards] = useState([]);

  const { addToast } = useToasts();

  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);

  useEffect(() => {
    const loadCards = () => {
      api.getOrderedProducts()
        .then((data) => {
          setCards(data.products);
        })
        .catch(err => showToast(err.message));
    };
    loadCards();
  }, [showToast])

  const showProductPage = (url) => {
    window.open(url, '_blank');
  }

  return (
    <Layout>
      <div>
        <div className='d-flex flex-wrap justify-content-center'>
          {cards.map((card, i) => (
            <div key={i} className={'shop-item'} onClick={() => showProductPage(card.url)}>
              <Card card={card} showPrice={true} orderStatus={card.orderStatus} />
            </div>
          ))}
        </div>
      </div>
      {!cards.length &&<NoCard page="order" />}
    </Layout>
  );
};

export default Order;
