import React, { useState, useEffect, useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';

import Card from '../components/card';
import NoCard from '../components/nocard';
import Layout from './layout';
import api from '../api';
import OllaCartModal from '../components/modal';

import './order.scss';

const Order = () => {
  const [cards, setCards] = useState([]);
  const [detailCard, setDetailCard] = useState(null);

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

  const showDetail = (card) => {
    setDetailCard(card);
  }

  return (
    <Layout>
      <div>
        <div className='d-flex flex-wrap justify-content-center'>
          {cards.map((card, i) => (
            <div key={i} className={'shop-item'} onClick={() => showDetail(card)}>
              <Card card={card} showPrice={true} orderStatus={card.orderStatus} />
            </div>
          ))}
        </div>
      </div>
      {!cards.length &&<NoCard page="order" />}
      <OllaCartModal>
        <div className='order-modal-content'>
          <div className='part'>
            <div className='logo-img'>
              <img src={detailCard.img} alt="logo" />
            </div>
          </div>
        </div>
      </OllaCartModal>
    </Layout>
  );
};

export default Order;
