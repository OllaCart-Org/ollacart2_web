import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useToasts } from 'react-toast-notifications';
import Card from '../components/card';
import NoCard from '../components/nocard';
import api from '../api';
import QuickView from '../components/quickview';
import EmailModal from './Modals/EmailModal';
import './cards.scss';

const Cards = (props) => {
  const { filter, readonly, hideThumbs, page } = props;
  const [limit] = useState(props.limit || 12);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [quickViewCardIdx, setQuickViewCardIdx] = useState(-1);
  const [emailModalForm, setEmailModalForm] = useState({});
  const [dragStartIdx, setDragStartIdx] = useState(-1);
  const [dragEndIdx, setDragEndIdx] = useState(-1);

  const { _id } = useSelector(state => state.auth);
  const { addToast } = useToasts();
  
  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);

  useEffect(() => {
    api.me().then(data => { setUser(data.user) })
  }, [])

  useEffect(() => {
    const loadCards = () => {
      api.getProducts({ skip: 0, limit, ...filter })
        .then((data) => {
          console.log(data)
          setCards(data.data);
          setSize(data.size);
          setSkip(0);
        })
        .catch(err => showToast(err.message));
    };

    loadCards();
  }, [limit, showToast, filter])

  const loadMore = () => {
    let toSkip = skip + limit;
    api.getProducts({ skip: toSkip, limit, ...filter })
      .then((data) => {
        console.log(cards, data)
        setCards([...cards, ...data.data]);
        setSize(data.size);
        setSkip(toSkip);
      })
      .catch(err => showToast(err.message));
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <Button onClick={loadMore} variant='contained' className='more-btn color-light'>
          more <Add />
        </Button>
      )
    );
  };

  const checkFilter = (card) => {
    if (page === 'share' && !card.shared) return false;
    if (page === 'purchase' && !card.purchased) return false;
    return true;
  }

  const updateProduct = (_id, detail) => {
    api.updateProduct(_id, detail)
      .then((data) => {
        const idx = cards.findIndex(itm => itm._id === data._id)
        if (idx < 0) return;
        
        if (checkFilter(data)) {
          cards[idx] = data;
        } else {
          cards.splice(idx, 1);
          setQuickViewCardIdx(-1);
        }

        setCards([ ...cards ]);
      })
      .catch(err => showToast(err.message));
  }

  const remove = (card) => {
    api.removeProduct(card._id)
      .then(() => {
        const idx = cards.findIndex(itm => itm._id === card._id)
        if (idx < 0) return
        if (idx === quickViewCardIdx && idx === cards.length - 1) setQuickViewCardIdx(idx - 1);
        cards.splice(idx, 1);
        setCards([...cards]);
      })
      .catch(err => showToast(err.message));
  }
  
  const removeClicked = (card) => {
    if (page === 'share' || page === 'purchase') {
      if (page === 'share') putCart(card._id, 0, card.purchased);
      if (page === 'purchase') putCart(card._id, card.shared, 0);
      
      const idx = cards.findIndex(itm => itm._id === card._id)
      if (idx < 0) return;
      cards.splice(idx, 1);
      setCards([...cards]);
    } else {
      remove(card);
    }
  }

  const putCart = (_id, shared, purchased) => {
    updateProduct(_id, { shared, purchased });
  }

  const save = (card) => {
    updateProduct(card._id, { description: card.description })
  }

  const itemClicked = (card) => {
    if (page !== 'home') {
      return quickView(cards.indexOf(card));
    }
    if (!card.shared && !card.purchased) {
      putCart(card._id, 0, 1);
    } else if (card.shared && card.purchased) {
      putCart(card._id, 0, 0);
    } else if (card.purchased) {
      putCart(card._id, 1, 0);
    } else {
      putCart(card._id, 1, 1);
    }
  }

  const shareClicked = (card) => {
    putCart(card._id, (card.shared ? 0 : 1), card.purchased);
  }

  const singleShareClicked = (card) => {
    setEmailModalForm({ type: 'singleshare', card, open: true })
  }

  const anonymousShareClicked = (card) => {
    if (!user?.status?.anonymous_username) {
      showToast('Toggle this feature on from account settings first.');
      return;
    }
    setEmailModalForm({ type: 'anonymousshare', card, open: true })
  }

  const putPurchaseClicked = (card) => {
    putCart(card._id, card.shared, (card.purchased ? 0 : 1));
  }

  const quickView = (idx) => {
    setQuickViewCardIdx(idx);
  }

  const previousQuickView = () => {
    if (quickViewCardIdx < 1) return;
    setQuickViewCardIdx(quickViewCardIdx - 1);
  }

  const nextQuickView = () => {
    if (quickViewCardIdx > cards.length - 2) {
      loadMore();
      return ;
    }
    setQuickViewCardIdx(quickViewCardIdx + 1);
  }

  const dragEnd = () => {
    if (dragStartIdx === dragEndIdx) return ;

    const sig = (dragStartIdx < dragEndIdx) ? 1 : -1;
    const ret = [];
    
    const last_sequence = cards[dragEndIdx].sequence || new Date(cards[dragEndIdx].createdAt).getTime();
    for (let i = dragEndIdx; i !== dragStartIdx; i -= sig) {
      cards[i].sequence = cards[i - sig].sequence || new Date(cards[i - sig].createdAt).getTime();
    }
    cards[dragStartIdx].sequence = last_sequence;

    for (let i = dragStartIdx; i !== dragEndIdx + sig; i += sig) {
      ret.push({
        _id: cards[i]._id,
        sequence: cards[i].sequence
      })
    }
    console.log(ret)

    api.updateProductSequence(ret)
      .then(() => {
        const card = cards[dragStartIdx];
        cards.splice(dragStartIdx, 1);
        cards.splice(dragEndIdx, 0, card);
        setCards([...cards]);
      })
      .catch(err => showToast(err.message));
  }

  const updateProductLogo = (card, idx) => {
    api.updateProductLogo(card._id, card.photos[idx]);
    const t_photo = card.photo;
    card.photo = card.photos[idx];
    card.photos[idx] = t_photo;
    setCards([...cards]);
  }

  const fork = (card, email = '') => {
    if (!_id && !email) return setEmailModalForm({ type: 'fork', card, open: true });
    api.forkProduct(card._id, email)
      .then(() => showToast('Added product to your Cart', 'success'))
      .catch(err => showToast(err.message));
  }

  const thumbup = (card, email = '') => {
    if (!_id && !email) return setEmailModalForm({ type: 'thumbup', card, open: true });
    api.thumbup(card._id, email)
      .then((data) => {
        const card = data.product;
        const idx = cards.findIndex(c => c._id === card._id);
        cards[idx] = card;
        setCards([...cards]);
      })
      .catch(err => showToast(err.message));
  }

  const thumbdown = (card, email = '') => {
    if (!_id && !email) return setEmailModalForm({ type: 'thumbdown', card, open: true });
    api.thumbdown(card._id, email)
      .then((data) => {
        const card = data.product;
        const idx = cards.findIndex(c => c._id === card._id);
        cards[idx] = card;
        setCards([...cards]);
      })
      .catch(err => showToast(err.message));
  }

  const singleShare = (card, email) => {
    api.singleShare(card._id, email)
      .then(() => showToast('Shared successfully', 'success'))
      .catch(err => showToast(err.message));
  }

  const anonymousShare = (card, email) => {
    api.anonymousShare(card._id, email)
      .then(() => showToast('Shared successfully', 'success'))
      .catch(err => showToast(err.message));
  }

  const getEmailModalTitle = useCallback(() => {
    if (emailModalForm.type === 'fork') return 'Add to your OllaCart';
    if (emailModalForm.type === 'thumbup') return 'ThumbUp';
    if (emailModalForm.type === 'thumbdown') return 'ThumbDown';
    if (emailModalForm.type === 'singleshare') return 'Direct Share'
    if (emailModalForm.type === 'anonymousshare') return 'Anonymous Share'
  }, [emailModalForm]);
  const getEmailModalButtonName = useCallback(() => {
    if (emailModalForm.type === 'fork') return 'Add';
    if (emailModalForm.type === 'thumbup') return 'ThumbUp';
    if (emailModalForm.type === 'thumbdown') return 'ThumbDown';
    if (emailModalForm.type === 'singleshare') return 'Share';
    if (emailModalForm.type === 'anonymousshare') return 'Share';
  }, [emailModalForm]);

  const onSubmitWithEmail = (email) => {
    if(emailModalForm.type === 'fork') {
      fork(emailModalForm.card, email);
    } else if(emailModalForm.type === 'thumbup') {
      thumbup(emailModalForm.card, email);
    } else if(emailModalForm.type === 'thumbdown') {
      thumbdown(emailModalForm.card, email);
    } else if(emailModalForm.type === 'singleshare') {
      singleShare(emailModalForm.card, email);
    } else if(emailModalForm.type === 'anonymousshare') {
      anonymousShare(emailModalForm.card, email);
    }
    setEmailModalForm({});
  }

  const getShopItemClassName = useCallback((card) => {
    let ret = 'shop-item';
    if (page !== 'home') return ret;
    if (card.shared) ret += ' shared';
    if (card.purchased) ret += ' purchased';
    return ret;
  }, [page]);

  return (
    <div>
      <div>
        <div className='d-flex flex-wrap justify-content-center'>
          {cards.map((card, i) => (
            <div key={i}
              className={getShopItemClassName(card)}
              onClick={() => itemClicked(card)}
              onDragStart={() => setDragStartIdx(i)}
              onDragEnter={() => setDragEndIdx(i)}
              onDragEnd={dragEnd}
              >
                <Card
                  card={card}
                  editable={!readonly}
                  showFullControl={page === 'home'}
                  hideThumbs={hideThumbs}
                  remove={() => removeClicked(card)}
                  fork={() => fork(card)}
                  quickView={() => quickView(i)} />
            </div>
          ))}
        </div>
        {loadMoreButton()}
      </div>
      {!cards.length && <NoCard page={page} />}
      {(quickViewCardIdx > -1) && <QuickView card={cards[quickViewCardIdx]}
        editable={!readonly}
        fork={fork}
        thumbup={thumbup}
        thumbdown={thumbdown}
        previous={previousQuickView}
        next={nextQuickView}
        share={shareClicked}
        singleShare={singleShareClicked}
        anonymousShare={anonymousShareClicked}
        anonymousShareAllowed={!!user?.status?.anonymous_username}
        save={save}
        remove={removeClicked}
        putPurchase={putPurchaseClicked}
        updateLogo={updateProductLogo}
        close={()=>setQuickViewCardIdx(-1)} />}
      <EmailModal open={!!emailModalForm.open} onClose={() => setEmailModalForm({})} title={getEmailModalTitle()} buttonName={getEmailModalButtonName()} onSubmit={onSubmitWithEmail} />
    </div>
  );
};

export default Cards;
