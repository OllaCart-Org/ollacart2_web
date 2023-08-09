import React, { useState, useEffect, useCallback } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { useToasts } from 'react-toast-notifications';
import api from '../../../api';

const Partners = () => {
  const { addToast } = useToasts();

  const [ partners, setPartners ] = useState([]);
  const [countPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(1);
  const [page, setPage] = useState(1);
  
  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);

  const fetchPartners = useCallback(() => {
    api.getPartnerRequests({ page, countPerPage })
      .then((data) => {
        console.log(data)
        setPartners(data.partners);
        setTotalCount(Math.floor((data.total - 1) / countPerPage) + 1);
      })
      .catch(err => showToast(err.message));
  }, [page, countPerPage, showToast])

  useEffect(() => {
    fetchPartners();
  }, [page, fetchPartners])

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
            {partners.map((partner, idx) => (
              <TableRow key={idx}>
                <TableCell>{partner.email}</TableCell>
                <TableCell align="center">{partner.name}</TableCell>
                <TableCell align="center">{partner.company}</TableCell>
                <TableCell align="center" className='break-spaces'>{partner.comment}</TableCell>
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

export default Partners;