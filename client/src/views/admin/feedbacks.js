import React, { useState, useEffect, useCallback } from 'react';
import Layout from './layout'
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { useToasts } from 'react-toast-notifications';
import api from '../../api';

const Feedbacks = () => {
  const { addToast } = useToasts();

  const [ feedbacks, setFeedbacks ] = useState([]);
  const [countPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(1);
  const [page, setPage] = useState(1);
  
  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);

  const fetchFeedbacks = useCallback(() => {
    api.getFeedbacks({ page, countPerPage })
      .then((data) => {
        console.log(data)
        setFeedbacks(data.feedbacks);
        setTotalCount(Math.floor((data.total - 1) / countPerPage) + 1);
      })
      .catch(err => showToast(err.message));
  }, [page, countPerPage, showToast])

  useEffect(() => {
    fetchFeedbacks();
  }, [page, fetchFeedbacks])

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Layout>
      <Box marginY={1}>
        <Typography variant='h4'>Feedbacks</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbacks.map((feedback, idx) => (
              <TableRow key={idx}>
                <TableCell>{feedback.email}</TableCell>
                <TableCell align="center">{feedback.name}</TableCell>
                <TableCell align="center" className='break-spaces'>{feedback.comment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className='pagination-wrapper'>
        <Pagination count={totalCount} page={page} onChange={handlePageChange} color="primary" showFirstButton showLastButton />
      </Box>
    </Layout>
  )
}

export default Feedbacks;