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
  const [user, setUser] = useState(null);

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

    api.me()
      .then(data => {
        setUser(data.user);
      })
      .catch(err => showToast(err.message));
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

  const showDetail = (card) => {
    setDetailCard(card);
  }

  const noteClicked = () => {
    if(!utils.checkURL(detailCard.shippingNote)) return;
    utils.openLink(detailCard.shippingNote);
  }

  return (
    <Layout>
      <div>
        <div className='d-flex flex-wrap justify-content-center'>
          {cards.map((card, i) => (
            <div key={i} className={'shop-item'} onClick={() => showDetail(card)}>
              <Card card={card} showPrice={true} orderStatus={card.orderStatus} hideThumbs={true} />
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
            {detailCard.promoCode && <div className='shipping-note'>
              <div className='title'>Promo Code</div>
              <div className={'note' + (utils.checkURL(detailCard.promoCode) ? ' link' : '')} onClick={noteClicked}>{detailCard.promoCode}</div>
            </div>}
            {detailCard.shippingNote && <div className='shipping-note'>
              <div className='title'>Shipping Note</div>
              <div className={'note' + (utils.checkURL(detailCard.shippingNote) ? ' link' : '')} onClick={noteClicked}>{detailCard.shippingNote}</div>
            </div>}
            <div className='price-list'>
              <div className='title'>Price Summary</div>
              <div className='price'>
                <span>Product Price</span>
                <span>${utils.commaPrice(detailCard.price)}</span>
              </div>
              {user?.status.tax && (detailCard.taxRate > -1) && <div className='price'>
                <span>Tax ({utils.commaPrice(detailCard.taxRate * 100)}%)</span>
                <span>+ ${utils.commaPrice(detailCard.taxPrice)}</span>
              </div>}
              {detailCard.anonymousPrice && <div className='price'>
                <span>Anonymous Shopping</span>
                <span>+ ${utils.commaPrice(detailCard.anonymousPrice)}</span>
              </div>}
              <div className='price'>
                <span>Shipping Cost</span>
                <span>+ ${utils.commaPrice(detailCard.shippingPrice)}</span>
              </div>
              <div className='spacer' />
              <div className='price'>
                <span>Total</span>
                <span className='total-price'>${utils.commaPrice(utils.getTotalPrice(detailCard, user?.status?.tax))}</span>
              </div>
            </div>
          </div>
        </div>}
      </OllaCartModal>
    </Layout>
  );
};

export default Order;
