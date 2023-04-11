import React, { useCallback, useEffect, useState } from 'react';
import { Typography, Box, Tabs, Tab } from '@material-ui/core';
import { useToasts } from 'react-toast-notifications';
import Layout from '../layout'
import Categories from './categories';
import Taxes from './taxes';
import api from '../../../api';

const Users = () => {
  const { addToast } = useToasts();

  const [tab, setTab] = useState('taxes');
  const [categories, setCategories] = useState([]);
  
  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);

  const fetchCategories = useCallback(() => {
    api.getCategories()
      .then((data) => {
        setCategories(data.categories);
      })
      .catch(err => showToast(err.message));
  }, [showToast])

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories])

  const handleChange = (e, _tab) => {
    setTab(_tab);
  }

  return (
    <Layout>
      <Box marginY={1}>
        <Typography variant='h4'>Taxes</Typography>
      </Box>
      <Tabs value={tab} onChange={handleChange}>
        <Tab label="Categories" value='categories' />
        <Tab label="Update Tax Rates by Location" value='taxes' />
      </Tabs>
      <Box hidden={tab !== 'categories'}>
        <Categories categories={categories} fetchCategories={fetchCategories} />
      </Box>
      <Box hidden={tab !== 'taxes'}>
        <Taxes categories={categories} />
      </Box>
    </Layout>
  )
}

export default Users;