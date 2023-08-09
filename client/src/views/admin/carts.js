import React, { useState, useEffect, useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Typography, Box, Card, CardContent, Link, Button, TextField, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Close, Delete, Edit, FileCopy, Launch, Update } from '@material-ui/icons';
import Pagination from '@material-ui/lab/Pagination';
import { TagsInput } from 'react-tag-input-component';
import Layout from './layout'
import api from '../../api';
import AdminDialog from '../../components/Admin/modal';
import './carts.scss'
import copy from 'copy-to-clipboard';

const Carts = () => {
  const [carts, setCarts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [countPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(1);
  const [page, setPage] = useState(1);
  const [editingCart, setEditingCart] = useState(null);

  const { addToast } = useToasts();

  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);

  const fetchCarts = useCallback((page) => {
    api.getCarts({ page, countPerPage })
      .then((data) => {
        setCarts(data.carts);
        setTotalCount(Math.floor((data.total - 1) / countPerPage) + 1);
      })
      .catch(err => showToast(err.message));
  }, [countPerPage, showToast])

  const fetchCategories = useCallback(() => {
    api.getCategories()
      .then((data) => {
        setCategories(data.categories);
      })
      .catch(err => showToast(err.message));
  }, [showToast])

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchCarts(page);
  }, [page, fetchCarts]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const removeClicked = (cart) => {
    api.removeProduct(cart._id)
      .then(() => {
        fetchCarts(page);
      })
      .catch(err => showToast(err.message));
  }

  const editClicked = (cart) => {
    setEditingCart({
      ...cart,
      photos: [ ...cart.photos ],
      keywords: [...cart.keywords]
    })
  }

  const closeModal = () => {
    setEditingCart(null);
  }

  const inputValueChanged = (e) => {
    editingCart[e.target.name] = e.target.value;
    setEditingCart({ ...editingCart });
  }

  const removeEditingCartPhoto = (idx, e) => {
    e.stopPropagation();
    editingCart.photos.splice(idx, 1);
    setEditingCart({ ...editingCart });
  }

  const setEditingCartLogo = (idx) => {
    if (!editingCart.photos[idx]) return;
    const temp = editingCart.photo;
    editingCart.photo = editingCart.photos[idx];
    editingCart.photos[idx] = temp;
    setEditingCart({ ...editingCart });
  }

  const updateInfo = () => {
    api.updateProduct(editingCart._id, {
      name: editingCart.name,
      size: editingCart.size,
      price: editingCart.price,
      description: editingCart.description,
      url: editingCart.url,
      keywords: editingCart.keywords,
      category: editingCart.category || null,
      photo: editingCart.photo,
      photos: editingCart.photos
    })
      .then((data) => {
        console.log(data);
        const idx = carts.findIndex(cart => cart._id === data._id);
        if (idx === -1) return;
        carts[idx] = data;
        setCarts([...carts]);
        closeModal();
      })
      .catch(err => showToast(err.message));
  }

  const getCategoryName = (_id) => {
    const category = categories.find(cat => cat._id === _id);
    return category?.name;
  }

  return (
    <Layout>
      <Box className='admin-carts-container'>
        <Box marginY={1}>
          <Typography variant='h4'>All Carts</Typography>
        </Box>
        <Box className='list-box'>
          {carts.map((cart, idx) => (
            <Card className='card' key={cart.name + idx}>
              <CardContent className='card-content'>
                <Box className='photo'>
                  <img src={cart.photo} alt="logo" />
                </Box>
                <Box className='card-body'>
                  <Box className='action-buttons'>
                    <Button variant="contained" color="primary" size="small" startIcon={<Edit />} onClick={() => editClicked(cart)}>Edit</Button>
                    <Button variant="contained" color="secondary" size="small" startIcon={<Delete />} onClick={() => removeClicked(cart)}>Delete</Button>
                  </Box>
                  <Box className='card-name-price'>
                    <Typography variant="h5" component="h2">{cart.name}</Typography>
                    <Typography variant="h4" component="h2">${cart.price}</Typography>
                  </Box>
                  <Box display='flex' justifyContent='space-between' alignItems='center'>
                    {cart.category && <Box className='category'>{getCategoryName(cart.category)}</Box>}
                    {cart.size && <Box className='size'>
                      Size: <span>{cart.size}</span>
                    </Box>}
                  </Box>
                  <Box className='description'>
                    <Typography className='break-spaces'>{cart.description}</Typography>
                  </Box>
                  <Box className='photos'>
                    {cart.photos.map((photo, idx) => (
                      <Box className='additional-photo' key={idx}>
                        <img src={photo} alt="Additional" />
                      </Box>
                    ))}
                  </Box>
                  <Box marginTop={1}>
                    <Link href={cart.url} target="_blank">{cart.url}</Link>
                  </Box>
                  <Box className='keywords'>
                    {cart.keywords.map((keyword, idx) => (
                      <Box className='keyword' key={idx}>{keyword}</Box>
                    ))}
                  </Box>
                  <Box className='info'>
                    <Typography>{cart.user && cart.user.email}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
        <Box className='pagination-wrapper'>
          <Pagination count={totalCount} page={page} onChange={handlePageChange} color="primary" showFirstButton showLastButton />
        </Box>
        {editingCart && <AdminDialog title='Update Information' open={!!editingCart} onClose={closeModal}>
          <Box className='update-info-modal'>
            <Box className='content'>
              <Box className='top-email'>{editingCart.user && editingCart.user.email}</Box>
              <Box className='fields'>
                <TextField label="Product Name" size="small" variant="outlined" fullWidth value={editingCart.name}
                  name='name' onChange={inputValueChanged} />
              </Box>
              <Box className='fields'>
                <TextField label="Size" size="small" variant="outlined" fullWidth value={editingCart.size}
                  name='size' onChange={inputValueChanged} />
                <TextField label="Price" size="small" type="number" variant="outlined" fullWidth value={editingCart.price}
                  name='price' onChange={inputValueChanged}
                  InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
              </Box>
              <Box className='fields'>
                <FormControl variant="outlined" fullWidth size='small'>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select labelWidth={70} labelId='category-label' name='category' value={editingCart.category || ''} onChange={inputValueChanged}>
                    <MenuItem value=''>No Category</MenuItem>
                    {categories.map((c, idx) => (
                      <MenuItem key={idx} value={c._id}>{c.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box className='fields'>
                <TextField label="Description" size="small" variant="outlined" multiline rows={5} fullWidth value={editingCart.description}
                  name='description' onChange={inputValueChanged} />
              </Box>
              {editingCart.original_url && <Box className='fields'>
                <TextField label="Picked Link" size="small" variant="outlined" fullWidth value={editingCart.original_url} disabled InputProps={{
                  endAdornment: <InputAdornment position='end'><IconButton onClick={() => copy(editingCart.original_url)}><FileCopy /></IconButton></InputAdornment>
                }} />
              </Box>}
              <Box className='fields'>
                <TextField label="Item Link" size="small" variant="outlined" fullWidth value={editingCart.url}
                  name='url' onChange={inputValueChanged} InputProps={{
                    endAdornment: <InputAdornment position='end'><IconButton onClick={() => window.open(editingCart.url, '_blank')}><Launch /></IconButton></InputAdornment>
                  }} />
              </Box>
              <Box className='fields'>
                <TagsInput value={editingCart.keywords} onChange={val => editingCart.keywords = val} placeHolder="keyword" />
              </Box>
              <Box className='photos'>
                <Box className='photo logo'>
                  <img src={editingCart.photo} alt='logo' />
                </Box>
                {editingCart.photos.map((photo, idx) => (
                  <Box className='photo' key={idx} onClick={() => setEditingCartLogo(idx)}>
                    <img src={photo} alt="Additional" />
                    <IconButton className='remove-button' size='small' onClick={(e) => removeEditingCartPhoto(idx, e)}>
                      <Close />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box className='footer'>
              <Button variant="contained" color="primary" size="small" startIcon={<Update />} onClick={updateInfo}>Update</Button>
              <Button variant="contained" size="small" startIcon={<Close />} onClick={closeModal}>Close</Button>
            </Box>
          </Box>
        </AdminDialog>}
      </Box>
    </Layout>
  )
}

export default Carts;