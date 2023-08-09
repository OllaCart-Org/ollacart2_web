import React, { useState, useEffect, useCallback } from 'react';
import Layout from './layout'
import { Typography, Box, Table, TableBody, TableCell, TableSortLabel, TableContainer, TableHead, TableRow, Paper, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useToasts } from 'react-toast-notifications';
import api from '../../api';
import { AddShoppingCart, Language, NoMeetingRoom, People, Share, Storefront } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  tableBox: {
    maxHeight: '500px',
    overflowY: 'auto'
  },
  table: {
    width: '100%'
  },
  avatar: {
    color: 'var(--fg)',
    backgroundColor: 'orangered'
  },
  tableWrapper: {
    marginTop: 50,
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px'
  },
  anlyticsWrapper: {
    marginTop: 25,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px'
  },
  analytics: {
    width: '120px',
    height: '120px',
    textAlign: 'center',
    padding: '10px',
    cursor: 'pointer'
  },
  purchaseAnalytics: {
    width: '240px',
    height: '80px',
    textAlign: 'left',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    cursor: 'pointer'
  },
  purchaseStatus: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  icon: {
    width: '40px',
    height: '40px'
  }
}));

const Analytics = () => {
  const classes = useStyles();
  const { addToast } = useToasts();

  const [analytics, setAnalytics] = useState({});
  const [domains, setDomains] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [domainOrder, setDomainOrder] = useState('desc');
  const [domainOrderBy, setDomainOrderBy] = useState('createdAt');
  const [productOrder, setProductOrder] = useState('desc');
  const [productOrderBy, setProductOrderBy] = useState('createdAt');

  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);

  const fetchAnalytics = useCallback(() => {
    api.getAnalytics()
      .then((data) => {
        setAnalytics(data.analytics);
        setDomains(data.domains.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1));
        setProductNames(data.productNames.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1));
      })
      .catch(err => showToast(err.message));
  }, [showToast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const sortDomains = (key) => {
    const isAsc = domainOrderBy === key && domainOrder === 'asc';
    setDomainOrder(isAsc ? 'desc' : 'asc');
    setDomainOrderBy(key);
    setDomains(domains.sort((a, b) => {
      return isAsc ? (a[key] > b[key] ? -1 : 1) : (a[key] > b[key] ? 1 : -1);
    }))
  }

  const sortProducts = (key) => {
    const isAsc = productOrderBy === key && productOrder === 'asc';
    setProductOrder(isAsc ? 'desc' : 'asc');
    setProductOrderBy(key);
    setProductNames(productNames.sort((a, b) => {
      return isAsc ? (a[key] > b[key] ? -1 : 1) : (a[key] > b[key] ? 1 : -1);
    }))
  }

  return (
    <Layout>
      <Box marginY={1}>
        <Typography variant='h4'>Analytics</Typography>
      </Box>
      <Box className={classes.anlyticsWrapper}>
        <Paper className={classes.analytics} elevation={3} >
          <Typography>Users</Typography>
          <People className={classes.icon} />
          <Typography>{analytics.userCount || 0}</Typography>
        </Paper>
        <Paper className={classes.analytics} elevation={3} >
          <Typography>Items</Typography>
          <Storefront className={classes.icon} />
          <Typography>{analytics.productCount || 0}</Typography>
        </Paper>
        <Paper className={classes.analytics} elevation={3} >
          <Typography>Shared</Typography>
          <Share className={classes.icon} />
          <Typography>{analytics.sharedProductCount || 0}</Typography>
        </Paper>
        <Paper className={classes.analytics} elevation={3} >
          <Typography>Purchase</Typography>
          <AddShoppingCart className={classes.icon} />
          <Typography>{analytics.purchasedProductCount || 0}</Typography>
        </Paper>
        <Paper className={classes.analytics} elevation={3} >
          <Typography>Sites</Typography>
          <Language className={classes.icon} />
          <Typography>{domains.length}</Typography>
        </Paper>
      </Box>
      <Box className={classes.anlyticsWrapper}>
        <Paper className={classes.purchaseAnalytics} elevation={3} >
          <NoMeetingRoom className={classes.icon} />
          <Box>
            <Typography>Not Placed Orders</Typography>
            <Box className={classes.purchaseStatus}>
              <Typography>{analytics?.ordersNotPlacedSummary?.count}</Typography>
              <Typography color='secondary'>${parseFloat(analytics?.ordersNotPlacedSummary?.price || 0).toFixed(2)}</Typography>
            </Box>
          </Box>
        </Paper>
        <Paper className={classes.purchaseAnalytics} elevation={3} >
          <NoMeetingRoom className={classes.icon} />
          <Box>
            <Typography>Not Placed Products</Typography>
            <Box className={classes.purchaseStatus}>
              <Typography>{analytics?.productsNotPlacedSummary?.count}</Typography>
              <Typography color='secondary'>${parseFloat(analytics?.productsNotPlacedSummary?.price || 0).toFixed(2)}</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Box className={classes.tableWrapper}>
        <Box width='50%'>
          <Typography variant='h6'>Shopping Sites ({domains.length})</Typography>
          <TableContainer component={Paper} className={classes.tableBox}>
            <Table stickyHeader className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={domainOrderBy === '_id'}
                      direction={domainOrderBy === '_id' ? domainOrder : 'asc'}
                      onClick={() => sortDomains('_id')}
                    >
                      Domain
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={domainOrderBy === 'count'}
                      direction={domainOrderBy === 'count' ? domainOrder : 'asc'}
                      onClick={() => sortDomains('count')}
                    >
                      Count
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {domains.map((domain, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Link href={domain._id} target='_blank'>{domain._id}</Link></TableCell>
                    <TableCell align="center">{domain.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box width='50%'>
          <Typography variant='h6'>Product Names ({productNames.length})</Typography>
          <TableContainer component={Paper} className={classes.tableBox}>
            <Table stickyHeader className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={productOrderBy === '_id'}
                      direction={productOrderBy === '_id' ? productOrder : 'asc'}
                      onClick={() => sortProducts('_id')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={productOrderBy === 'count'}
                      direction={productOrderBy === 'count' ? productOrder : 'asc'}
                      onClick={() => sortProducts('count')}
                    >
                      Count
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productNames.map((productName, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{productName._id}</TableCell>
                    <TableCell align="center">{productName.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Layout>
  )
}

export default Analytics;