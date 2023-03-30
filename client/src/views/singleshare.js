import React, { useState, useEffect, useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';
import Layout from './layout';
import api from '../api';
import { Box, Typography, Link, Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import utils from '../utils';
import './singleshare.scss';
import { ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from '@material-ui/icons';
import EmailModal from '../components/Modals/EmailModal';
import OllaCartAdd from '../components/Logo/ollacartadd';

const SingleShare = (props) => {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState(null);
  const [logo, setLogo] = useState('');
  // const [followStatus, setFollowStatus] = useState(false);
  // const [followedCount, setFollowedCount] = useState(0);
  const [emailModalForm, setEmailModalForm] = useState({});

  const { addToast } = useToasts();
  const { _id } = useSelector(state => state.auth);

  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);
  
  const fetchProductDetail = useCallback(() => {
    if (!productId) return;
    api.getProduct(productId)
      .then(data => {
        setProduct(data.product);
        setLogo(data.product.photo)
      })
      .catch(err => showToast(err.message))
  }, [productId, showToast])

  const fetchShareStatus = useCallback(() => {
    if (!product?.user?._id) return;
    api.getShareStatus(product?.user?._id)
      .then(data => {
        // setSharedUserName(data.username);
        // setFollowStatus(data.followStatus);
        // setFollowedCount(data.followedCount);
      })
      .catch(err => showToast(err.message))
  }, [product, showToast])

  useEffect(() => {
    const productid = props.match.params.productid;
    setProductId(productid);
  }, [props]);

  useEffect(() => {
    fetchShareStatus();
  }, [fetchShareStatus])

  useEffect(() => {
    if (!productId) return
    fetchProductDetail();
  }, [productId, fetchProductDetail]);

  const imgClicked = (idx) => {
    setLogo(product.photos[idx]);
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
        setProduct(card);
      })
      .catch(err => showToast(err.message));
  }

  const thumbdown = (card, email = '') => {
    if (!_id && !email) return setEmailModalForm({ type: 'thumbdown', card, open: true });
    api.thumbdown(card._id, email)
      .then((data) => {
        const card = data.product;
        setProduct(card);
      })
      .catch(err => showToast(err.message));
  }
  
  const getEmailModalTitle = useCallback(() => {
    if (emailModalForm.type === 'fork') return 'Add to your OllaCart';
    if (emailModalForm.type === 'thumbup') return 'ThumbUp';
    if (emailModalForm.type === 'thumbdown') return 'ThumbDown';
    if (emailModalForm.type === 'follow') return 'Follow';
  }, [emailModalForm]);
  const getEmailModalButtonName = useCallback(() => {
    if (emailModalForm.type === 'fork') return 'Add';
    if (emailModalForm.type === 'thumbup') return 'ThumbUp';
    if (emailModalForm.type === 'thumbdown') return 'ThumbDown';
    if (emailModalForm.type === 'follow') return 'Follow';
  }, [emailModalForm]);

  const onSubmitWithEmail = (email) => {
    if(emailModalForm.type === 'fork') {
      fork(emailModalForm.card, email);
    } else if(emailModalForm.type === 'thumbup') {
      thumbup(emailModalForm.card, email);
    } else if(emailModalForm.type === 'thumbdown') {
      thumbdown(emailModalForm.card, email);
    } else if(emailModalForm.type === 'follow') {
      followUserWithEmail(email);
    }
    setEmailModalForm({});
  }

  const followUserWithEmail = (email) => {
    api.followUser(product.user._id, email)
      .then(() => {
        fetchShareStatus();
      })
      .catch(err => showToast(err.message))
  }

  // const followUser = () => {
  //   api.followUser(product.user._id)
  //     .then(fetchShareStatus)
  //     .catch(err => showToast(err.message))
  // }

  // const unFollowUser = () => {
  //   api.unFollowUser(product.user._id)
  //     .then(fetchShareStatus)
  //     .catch(err => showToast(err.message))
  // }

  // const followClicked = () => {
  //   if (product.user._id === _id) return;
  //   if (!_id) {
  //     setEmailModalForm({ type: 'follow', card: product, open: true });
  //     return;
  //   }
  //   if (!followStatus) followUser();
  //   else unFollowUser();
  // }

  if (!product) return <Layout />

  return (
    <Layout>
      <Box className='singleshare-content' mt={1}>
        <Box className='left-bar'>
          <Box className='logo-container' marginTop={1}>
            <img src={logo} alt="img"/>
          </Box>
          <Box className='photo-container'>
            {product.photos.filter(photo => !!photo).map((photo, idx) => (
              <Box className='quickview-photo' key={idx} onClick={() => imgClicked(idx)}>
                <img src={photo} alt="img"/>
              </Box>
            ))}
          </Box>
        </Box>
        <Box className='right-bar'>
          <Typography variant="h3" gutterBottom>{product.name}</Typography>
          <Typography variant="h5" gutterBottom style={{color: 'var(--color-turquoise)'}}>${product.price}</Typography>
          <Typography style={{whiteSpace: 'break-spaces'}}>{product.description}</Typography>
          <Typography className='quickview-item-link'><Link href={product.url} target='_blank'>{product.url}</Link></Typography>
          {<Box className='user-name' mt={2}><span>@{utils.getUsername(product.user)}</span></Box>}
        </Box>
      </Box>
      <Box maxWidth={750} mx='auto' mt={5}>
        <Box mt={2} display='flex' justifyContent='center' alignItems='center'>
          <Box display='flex' gridGap={5}>
            <Button variant='outlined' size='small' onClick={() => thumbup(product)}
              startIcon={product.likes.includes(_id) ? <ThumbUp /> : <ThumbUpOutlined />}>{product.likes.length}</Button>
            <Button variant='outlined' size='small' onClick={() => thumbdown(product)}
              startIcon={product.dislikes.includes(_id) ? <ThumbDown /> : <ThumbDownOutlined />}>{product.dislikes.length}</Button>
            {/* <Button variant='outlined' size='small' onClick={followClicked}
              startIcon={followStatus ? <Favorite /> : <FavoriteBorder />}>{followedCount}</Button> */}
          </Box>
        </Box>
        <Box className='ollacart-add-button' my={2} display='flex' justifyContent='center'>
          <OllaCartAdd onClick={() => fork(product)} />
        </Box>
      </Box>
      <EmailModal open={!!emailModalForm.open} onClose={() => setEmailModalForm({})} title={getEmailModalTitle()} buttonName={getEmailModalButtonName()} onSubmit={onSubmitWithEmail} />
    </Layout>
  );
};

export default SingleShare;
