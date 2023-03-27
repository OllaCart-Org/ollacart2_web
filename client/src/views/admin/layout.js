import React from 'react';
import { AppBar, Button, Toolbar, Box, Avatar } from '@material-ui/core';
import { useHistory } from 'react-router-dom'
import { useSelector } from "react-redux"
import OllaCartMultiLogo from '../../components/Logo/ollacartmulti';

import './layout.scss';

const Layout = ({ children }) => {
  const history = useHistory();
  const { email } = useSelector(state => state.auth)

  const goTo = (url) => {
    history.push(url);
  }
  return (
    <Box className='admin-container'>
      <AppBar position="static">
        <Toolbar>
          <Button className='logo-btn' onClick={() => goTo('/')}>
            <OllaCartMultiLogo />
          </Button>
          <Box mr='auto' />
          <Button color="inherit" onClick={() => goTo('/admin/analytics')}>Analytics</Button>
          <Button color="inherit" onClick={() => goTo('/admin/users')}>Users</Button>
          <Button color="inherit" onClick={() => goTo('/admin/carts')}>Items</Button>
          <Button color="inherit" onClick={() => goTo('/admin/orders')}>Orders</Button>
          <Button color="inherit" onClick={() => goTo('/admin/contracts')}>Contracts</Button>
          <Button color="inherit" onClick={() => goTo('/admin/feedbacks')}>Feedbacks</Button>
          <Avatar className='avatar'>{email.toUpperCase()[0]}</Avatar>
        </Toolbar>
      </AppBar>
      <Box className='container'>
        {children}
      </Box>
    </Box>
  )
}

export default Layout;