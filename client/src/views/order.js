import React, { useState, useEffect, useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';

import Card from '../components/card';
import NoCard from '../components/nocard';
import Layout from './layout';
import api from '../api';
import OllaCartModal from '../components/modal';
import utils from '../utils';

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

  const getOrderStatusBadge = (orderStatus) => {
    if (!orderStatus || orderStatus < 1 || orderStatus > 3) return '';
    let label, color;
    if(orderStatus === 1) {
      label = 'Order Placed';
      color = 'color-placed';
    } else if(orderStatus === 2) {
      label = 'Shipped';
      color = 'color-shipped';
    } else if(orderStatus === 3) {
      label = 'Order Closed';
      color = 'color-closed';
    }
    return <div className={'order-status-badge ' + color}>{label}</div>
  }

  // const showProductPage = (url) => {
  //   window.open(url, '_blank');
  // }

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
      <OllaCartModal title='Order Detail' open={!!detailCard} onClose={() => setDetailCard(null)}>
        {detailCard && <div className='order-modal-content'>
          <div className='part'>
            <div className='logo-img'>
              <img src={detailCard.photo} alt="logo" />
            </div>
          </div>
          <div className='part'>
            <div className='product-title'>{detailCard.name}</div>
            {getOrderStatusBadge(detailCard.orderStatus)}
            {detailCard.shippingNote && <div className='shipping-note'>
              <div className='title'>Shipping Note</div>
              <div className='note'>{detailCard.shippingNote}</div>
            </div>}
            <div className='price-list'>
              <div className='title'>Price Summary</div>
              <div className='price'>
                <span>Product Price</span>
                <span>${utils.commaPrice(detailCard.price)}</span>
              </div>
              <div className='price'>
                <span>Shipping Cost</span>
                <span>$14</span>
              </div>
              <div className='price'>
                <span>Processing Fee</span>
                <span>${utils.commaPrice(utils.calcStripeFee(detailCard.price + 14))}</span>
              </div>
              <div className='spacer' />
              <div className='price'>
                <span>Total</span>
                <span className='total-price'>${utils.commaPrice(utils.calcPriceWithFee(detailCard.price + 14))}</span>
              </div>
            </div>
          </div>
        </div>}
      </OllaCartModal>
    </Layout>
  );
};

export default Order;
