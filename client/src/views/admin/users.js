import React, { useState, useEffect, useCallback } from 'react';
import Layout from './layout'
import { Typography, Box, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { useToasts } from 'react-toast-notifications';
import api from '../../api';
import { Add } from '@material-ui/icons';
import SuggestModal from '../../components/Admin/SuggestModal';

const Users = () => {
  const { addToast } = useToasts();

  const [ users, setUsers ] = useState([]);
  const [countPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(1);
  const [page, setPage] = useState(1);
  const [suggestModalInfo, setSuggestModalInfo] = useState({open: false});
  
  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);

  const fetchUsers = useCallback(() => {
    api.getUsers({ page, countPerPage })
      .then((data) => {
        console.log(data)
        setUsers(data.users);
        setTotalCount(Math.floor((data.total - 1) / countPerPage) + 1);
      })
      .catch(err => showToast(err.message));
  }, [page, countPerPage, showToast])

  useEffect(() => {
    fetchUsers();
  }, [page, fetchUsers])

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const showSuggestModal = (user) => {
    setSuggestModalInfo({ open: true, user });
  }

  const closeSuggestModal = () => {
    setSuggestModalInfo({ open: false });
  }

  return (
    <Layout>
      <Box marginY={1}>
        <Typography variant='h4'>OllaCart Users</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width={80}></TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">Extension ID</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Suggest Product</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, idx) => (
              <TableRow key={idx}>
                <TableCell><Avatar className='avatar'>{user.email[0].toUpperCase()}</Avatar></TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="center">{(user.role === 'admin') ? 'Administrator' : 'User'}</TableCell>
                <TableCell align="center">{user.ce_id}</TableCell>
                <TableCell align="center">
                  <Box display='flex' flexWrap='wrap' justifyContent='center' gridGap='5px' >
                    {user.status?.secure && <Chip size='small' color='primary' label='SECURE' />}
                    {user.status?.tax && <Chip size='small' color='secondary' label='TAX' />}
                    {user.status?.promo_code && <Chip size='small' color='secondary' label='PROMO' />}
                    {user.status?.shopping_recommendation && <Chip size='small' color='secondary' label='PSR' />}
                    {user.status?.anonymous_shopping && <Chip size='small' color='secondary' label='Anonymous' />}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton color='secondary' size='small' onClick={() => showSuggestModal(user)}><Add /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className='pagination-wrapper'>
        <Pagination count={totalCount} page={page} onChange={handlePageChange} color="primary" showFirstButton showLastButton />
      </Box>
      <SuggestModal open={suggestModalInfo.open} onClose={closeSuggestModal} user={suggestModalInfo.user} />
    </Layout>
  )
}

export default Users;