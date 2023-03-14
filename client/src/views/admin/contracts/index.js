import React, { useState } from 'react';
import Layout from '../layout'
import { Typography, Box, Tabs, Tab } from '@material-ui/core';
import Investors from './investors';
import Partners from './partners';

const Users = () => {
  const [tab, setTab] = useState('investors');

  const handleChange = (e, _tab) => {
    setTab(_tab);
  }

  return (
    <Layout>
      <Box marginY={1}>
        <Typography variant='h4'>Contracts</Typography>
      </Box>
      <Tabs value={tab} onChange={handleChange}>
        <Tab label="Investors" value='investors' />
        <Tab label="Partners" value='partners' />
      </Tabs>
      <Box hidden={tab !== 'investors'}>
        <Investors />
      </Box>
      <Box hidden={tab !== 'partners'}>
        <Partners />
      </Box>
    </Layout>
  )
}

export default Users;