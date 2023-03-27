import React, { useState, useEffect, useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';
import Layout from './layout';
import api from '../api';
import { Box, Typography, Link } from '@material-ui/core';
import utils from '../utils';
import './singleshare.scss';

const SingleShare = (props) => {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState(null);
  const [logo, setLogo] = useState('');

  const { addToast } = useToasts();

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

  useEffect(() => {
    const productid = props.match.params.productid;
    setProductId(productid);
  }, [props]);

  useEffect(() => {
    if (!productId) return
    fetchProductDetail();
  }, [productId, fetchProductDetail]);

  const imgClicked = (idx) => {
    setLogo(product.photos[idx]);
  }

  if (!product) return <Layout />

  return (
    <Layout>
      <Box className='singleshare-content'>
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
    </Layout>
  );
};

export default SingleShare;
