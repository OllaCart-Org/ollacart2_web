import React, { useState, useCallback } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, TextField } from '@material-ui/core';
import { useToasts } from 'react-toast-notifications';
import api from '../../../api';
import utils from '../../../utils';
import { Add, Delete, Edit } from '@material-ui/icons';
import AdminDialog from '../../../components/Admin/modal';

const Categories = ({ categories, fetchCategories }) => {
  const { addToast } = useToasts();

  const [categoryModalInfo, setCategoryModalInfo] = useState({});
  const [name, setName] = useState('');
  
  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);


  const updateCategory = () => {
    api.updateCategory(categoryModalInfo._id, { name })
      .then(fetchCategories)
      .catch(err => showToast(err.message));
  }

  const createCategory = () => {
    api.createCategory({ name })
      .then(fetchCategories)
      .catch(err => showToast(err.message));
  }

  const removeCategory = (category) => {
    api.removeCateogory(category._id)
      .then(fetchCategories)
      .catch(err => showToast(err.message));
  }

  const updateCategoryModalOpen = (category) => {
    setCategoryModalInfo({
      open: true,
      _id: category._id,
    })
    setName(category.name);
  }

  const createCategoryModalOpen = () => {
    setCategoryModalInfo({ open: true });
  }

  const updateCategoryClicked = () => {
    if(categoryModalInfo._id) {
      updateCategory();
    } else {
      createCategory();
    }
    closeCategoryModal();
  }

  const closeCategoryModal = () => {
    setCategoryModalInfo({});
  }

  return (
    <>
      <Box display='flex' justifyContent='flex-end' marginY={2}>
        <Button variant='contained' startIcon={<Add />} color='primary' onClick={createCategoryModalOpen}>Add Category</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Created By</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, idx) => (
              <TableRow key={idx}>
                <TableCell align="center">{category.name}</TableCell>
                <TableCell align="center">{utils.getUsername(category.user)}</TableCell>
                <TableCell align="center">
                  <Box display='flex' justifyContent='center' gridGap={5}>
                    <IconButton size='small' color='primary' onClick={() => updateCategoryModalOpen(category)}>
                      <Edit />
                    </IconButton>
                    <IconButton size='small' color='secondary' onClick={() => removeCategory(category)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AdminDialog title='Category' open={!!categoryModalInfo.open} onClose={closeCategoryModal}>
        <Box mt={1}>
          <TextField label="Name" size="small" variant="outlined" fullWidth value={name} onChange={e => setName(e.target.value)} />
          <Box display='flex' gridGap='10px' justifyContent='flex-end' mt={2}>
            { categoryModalInfo._id ?
              <Button variant="contained" color="primary" size="small" startIcon={<Edit />} onClick={updateCategoryClicked}>Update</Button>
            :
              <Button variant="contained" color="primary" size="small" startIcon={<Add />} onClick={updateCategoryClicked}>Add</Button>
            }
          </Box>
        </Box>
      </AdminDialog>
    </>
  )
}

export default Categories;