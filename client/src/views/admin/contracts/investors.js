import React, { useState, useEffect, useCallback } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { useToasts } from 'react-toast-notifications';
import api from '../../../api';

const Investors = () => {
  const { addToast } = useToasts();

  const [ investors, setInvestors ] = useState([]);
  const [countPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(1);
  const [page, setPage] = useState(1);
  
  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);

  const fetchInvestors = useCallback(() => {
    api.getInvestorRequests({ page, countPerPage })
      .then((data) => {
        console.log(data)
        setInvestors(data.investors);
        setTotalCount(Math.floor((data.total - 1) / countPerPage) + 1);
      })
      .catch(err => showToast(err.message));
  }, [page, countPerPage, showToast])

  useEffect(() => {
    fetchInvestors();
  }, [page, fetchInvestors])

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Company</TableCell>
              <TableCell align="center">Comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {investors.map((investor, idx) => (
              <TableRow key={idx}>
                <TableCell>{investor.email}</TableCell>
                <TableCell align="center">{investor.name}</TableCell>
                <TableCell align="center">{investor.company}</TableCell>
                <TableCell align="center" className='break-spaces'>{investor.comment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className='pagination-wrapper'>
        <Pagination count={totalCount} page={page} onChange={handlePageChange} color="primary" showFirstButton showLastButton />
      </Box>
    </>
  )
}

export default Investors;