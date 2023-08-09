import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, IconButton, Typography } from '@material-ui/core'
import { useToasts } from 'react-toast-notifications';
import AdminDialog from './modal';
import api from '../../api';
import './SuggestModal.scss';
import { Add, ThumbDownOutlined, ThumbUpOutlined } from '@material-ui/icons';
import moment from 'moment/moment';
import { useSelector } from 'react-redux';


function SuggestModal({ open, user, onClose }) {
  const { _id } = useSelector(state => state.auth);

  const [carts, setCarts] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [countPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const { addToast } = useToasts();

  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);
  
  const fetchCarts = useCallback((page) => {
    if (!_id) return ;
    api.getCarts({ page, countPerPage }, { user: _id })
      .then((data) => {
        setCarts(data.carts);
        setTotalCount(Math.floor((data.total - 1) / countPerPage) + 1);
      })
      .catch(err => showToast(err.message));
  }, [_id, countPerPage, showToast])

  useEffect(() => {
    if (user) {
      setPage(1);
    }
  }, [user]);

  useEffect(() => {
    fetchCarts(page);
  }, [page, fetchCarts])

  const previous = () => {
    if (page > 1) setPage(page - 1);
  }

  const next = () => {
    if (page < totalCount ) setPage(page + 1);
  }

  const adminAddProduct = (cart) => {
    api.adminAddProduct(user._id, cart._id)
      .then(() => showToast('Added Successfully', 'success'))
      .catch(err => showToast(err.message));
  }

  return (
    <AdminDialog title='Suggest Product' open={open} onClose={onClose}>
      <Box className='suggest-modal'>
        <Box height={400} overflow='auto'>
          {carts.map(cart => (
            <Box className='single-item' py={1} gridGap={5} key={cart._id}>
              <Box className='add-wrapper'>
                <IconButton color='secondary' size='medium' onClick={() => adminAddProduct(cart)}>
                  <Add fontSize='large' />
                </IconButton>
              </Box>
              <Box className='photo' flexShrink={0}>
                <img src={cart.photo} alt='logo' />
              </Box>
              <Box flexGrow={1}>
                <Box display='flex' justifyContent='space-between' align-items='flex-start'>
                  <Typography>{cart.name}</Typography>
                  <Typography color='primary'>${cart.price}</Typography>
                </Box>
                <Box mt={1}>
                  <Typography variant='caption' className='description'>{cart.description}</Typography>
                </Box>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                  <Box display='flex' gridGap={15}>
                    <Box display='flex' gridGap={5} alignItems='center'>
                      <ThumbUpOutlined color='disabled' fontSize='small' />
                      {cart.likes.length}
                    </Box>
                    <Box display='flex' gridGap={5} alignItems='center'>
                      <ThumbDownOutlined color='disabled' fontSize='small' />
                      {cart.dislikes.length}
                    </Box>
                  </Box>
                  <Box>
                    {moment(cart.createdAt).fromNow()}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        <Box display='flex' justifyContent='space-between' borderTop='1px solid #F0F0F0'>
          <Button onClick={previous}>Previous</Button>
          <Button onClick={next}>Next</Button>
        </Box>
      </Box>
    </AdminDialog>
  )
}

export default SuggestModal