import React from 'react';
import { InsertLink, Close, ZoomOutMap, Add } from '@material-ui/icons'
import './card.scss';

const Card = ({ card, editable, remove, quickView, showPrice, orderStatus, fork }) => {
  const removeClicked = (e) => {
    e.stopPropagation();
    remove();
  }
  const quickViewClicked = (e) => {
    e.stopPropagation();
    quickView();
  }

  const forkClicked = (e) => {
    e.stopPropagation();
    fork();
  }

  const getOrderStatusBadge = () => {
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

  return (
    <div className="card-container">
      <div className='product-img' >
        <img src={card.photo} alt={card.name} className='mb-3'
          style={{ objectFit: 'contain', height: '100%', width: '100%', display: 'flex', marginLeft: 'auto', marginRight: 'auto' }}
        />
        {getOrderStatusBadge()}
      </div>
      <div className='d-flex justify-content-end align-items-start'>
        <div className='item-name'>{card.name}</div>
        {showPrice ? 
          <div className='item-price'>${card.price}</div>
        :
          <>
            {!editable ?
              <>
                <div className='close-link'><span onClick={forkClicked}><Add /></span></div>
                <div className='insert-link'><a onClick={e=>e.stopPropagation()} href={card.url} rel="noopener noreferrer" target="_blank"><InsertLink /></a></div>
              </>
            :
              <>
                <div className='close-link'><span onClick={quickViewClicked} ><ZoomOutMap /></span></div>
                <div className='insert-link'><a onClick={e=>e.stopPropagation()} href={card.url} rel="noopener noreferrer" target="_blank"><InsertLink /></a></div>
                <div className='close-link'><span onClick={removeClicked} ><Close /></span></div>
              </>
            }
            
          </>
        }
      </div>
    </div>
  );
};

export default Card;
