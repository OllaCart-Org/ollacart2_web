import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux"
import { Box, Link, TextField, Typography } from '@material-ui/core';
import { Add, ChevronLeft, ChevronRight, Close, Delete, Edit, Save, Share, ShoppingCart, Telegram, ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from '@material-ui/icons'
import './quickview.scss';
import utils from '../utils';

const QuickView = ({ card, close, share, singleShare, save, remove, updateLogo, putPurchase, previous, next, editable, fork, thumbup, thumbdown }) => {
  const [logo, setLogo] = useState('');
  const [isColorShow, setIsColorShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState('');

  const { _id } = useSelector(state => state.auth);

  useEffect(() => {
    setLogo(card.photo || '')
    setIsColorShow(false);
    utils.setStoredThumbCount(card._id, {
      thumbup: card.likes.length,
      thumbdown: card.dislikes.length
    })
  }, [card])

  const goPreviewClicked = (e) => {
    e.stopPropagation();
    previous();
  }
  
  const goNextClicked = (e) => {
    e.stopPropagation();
    next();
  }

  const editClicked = () => {
    setEditMode(true);
    setDescription(card.description);
  }

  const saveClicked = () => {
    setEditMode(false);
    card.description = description;
    save(card);
  }

  const imgClicked = (idx) => {
    setLogo(card.photos[idx]);
    if (updateLogo) updateLogo(card, idx);
  }

  return (
    <Box className='quickview-container' onClick={close}>
      <Box className='quickview' onClick={(e) => e.stopPropagation()}>
        <Box className='top-nav'>
          {editable && (
            <>
              {share && <Box className={'top-nav-item ' + (card.shared ? 'active' : '')} onClick={() => share(card)}><Share /></Box>}
              {putPurchase && <Box className={'top-nav-item ' + (card.purchased ? 'active' : '')} onClick={() => putPurchase(card)}><ShoppingCart /></Box>}
              {singleShare && <Box className='top-nav-item mr-auto' onClick={() => singleShare(card)}><Telegram /></Box>}
              {save && !editMode && <Box className='top-nav-item' onClick={editClicked}><Edit /></Box>}
              {save && editMode && <Box className='top-nav-item' onClick={saveClicked}><Save /></Box>}
              {remove && <Box className='top-nav-item' onClick={() => remove(card)}><Delete /></Box>}
            </>
          )}
          {!editable &&
            <>
              {fork && <Box className='top-nav-item mr-auto' onClick={() => fork(card)}><Add /></Box>}
            </>
          }
          <Box className='top-nav-item' onClick={close}><Close /></Box>
        </Box>
        <Box className='thumb-content'>
          <Box className='label-button' onClick={() => thumbup(card)}>
            <span>{card.likes.length}</span>
            {card.likes.includes(_id) ? <ThumbUp /> : <ThumbUpOutlined />}
          </Box>
          <Box className='label-button' onClick={() => thumbdown(card)}>
            <span>{card.dislikes.length}</span>
            {card.dislikes.includes(_id) ? <ThumbDown /> : <ThumbDownOutlined />}
          </Box>
        </Box>
        <Box className='quickview-content'>
          <Box className='left-bar'>
            {/* {card.color && <Box className='custom-switcher' marginLeft='auto'>
              <Box className={'custom-switcher-left ' + (isColorShow ? '' : 'active')} onClick={() => setIsColorShow(false)}>Logo</Box>
              <Box className={'custom-switcher-right ' + (!isColorShow ? '' : 'active')} onClick={() => setIsColorShow(true)}>Color</Box>
            </Box>} */}
            <Box className='logo-container' marginTop={1}>
              <img src={isColorShow ? card.color : logo} alt="img"/>
            </Box>
            <Box className='photo-container'>
              {/* <Box className='quickview-photo' onClick={() => setLogo(card.photo)}>
                <img src={card.photo} alt="img"/>
              </Box> */}
              {card.photos.filter(photo => !!photo).map((photo, idx) => (
                <Box className='quickview-photo' key={idx} onClick={() => imgClicked(idx)}>
                  <img src={photo} alt="img"/>
                </Box>
              ))}
            </Box>
          </Box>
          <Box className='right-bar'>
            <Typography variant="h3" gutterBottom>{card.name}</Typography>
            <Typography variant="h5" gutterBottom style={{color: 'var(--color-turquoise)'}}>${card.price}</Typography>
            {editable && card.size && <Box className='size-item'><span>Size: {card.size}</span></Box>}
            {!editMode && <Typography style={{whiteSpace: 'break-spaces'}}>{card.description}</Typography>}
            {editMode && <TextField
              className='description-editor'
              label="Description"
              multiline
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
            />}
            <Typography className='quickview-item-link'><Link href={card.url} target='_blank'>{card.url}</Link></Typography>
            {<Box className='user-name' mt={2}><span>@{utils.getUsername(card.user)}</span></Box>}
          </Box>
        </Box>
      </Box>
      <Box className='quickview-left-navigator' onClick={goPreviewClicked}><ChevronLeft fontSize='large'/></Box>
      <Box className='quickview-right-navigator' onClick={goNextClicked}><ChevronRight fontSize='large' /></Box>
    </Box>
  );
};

export default QuickView;
