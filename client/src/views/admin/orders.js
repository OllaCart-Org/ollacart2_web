import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Box, Link, IconButton, Collapse, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, Chip, Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import { useToasts } from 'react-toast-notifications';
import { KeyboardArrowUp, KeyboardArrowDown, Check, NoteAdd, Update, Close } from '@material-ui/icons';
import Layout from './layout'
import AdminDialog from '../../components/Admin/modal';
import api from '../../api';

const useStyles = makeStyles(() => ({
  tableBox: {
    marginTop: 25
  },
  table: {
    width: '100%'
  },
  paginationWrapper: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center'
  }
}));

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  orderUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  avatar: {
    color: 'var(--fg)',
    backgroundColor: 'orangered'
  },
  productImage: {
    width: '40px',
    height: '40px',
    objectFit: 'contain'
  }
});

const OrderRow = (props) => {
  const { order, orderStatusChanged, openShippingNotesModal} = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  const getShippingDetail = (info) => {
    return Object.keys(info).map((key, idx) => (
      <TableRow key={idx}>
        <TableCell align="left">{key}</TableCell>
        <TableCell align="left">{info[key]}</TableCell>
      </TableRow>
    ))
  }

  const orderStatusDetail = (status) => {
    let label, color;
    if(status === 1) {
      label = 'Order Placed';
      color = 'secondary';
    } else if(status === 2) {
      label = 'Shipped';
      color = 'primary';
    } else if(status === 3) {
      label = 'Order Closed';
      color = 'default';
    }
    else return '';
    return <Chip
      size="small"
      icon={<Check />}
      label={label}
      color={color}
    />
  }

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell align="left">
          <Box className={classes.orderUser}>
            <Avatar className={classes.avatar}>{order.user.email[0].toUpperCase()}</Avatar>
            <Typography>{order.user.email}</Typography>
          </Box>
        </TableCell>
        <TableCell align="center">$ {order.products.length * 14}</TableCell>
        <TableCell align="center">$ {order.totalFee}</TableCell>
        <TableCell align="center">$ {order.totalPrice}</TableCell>
        <TableCell align="center">{order.products.length}</TableCell>
        <TableCell align="center">{orderStatusDetail(order.orderStatus)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} marginLeft='auto' maxWidth={400}>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {getShippingDetail(order.shipping)}
                </TableBody>
              </Table>
            </Box>
            <Box margin={1} marginLeft={10}>
              <Typography variant="h6" gutterBottom component="div">
                Items
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell width={80}></TableCell>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Shopping Site</TableCell>
                    <TableCell align="center">Size</TableCell>
                    <TableCell align="center">Order Placed</TableCell>
                    <TableCell align="center">Shipped</TableCell>
                    <TableCell align="center">Order Closed</TableCell>
                    <TableCell align="center">Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.products.map((product, idx) => (
                    <TableRow key={idx}>
                      <TableCell><img className={classes.productImage} src={product.photo} alt="logo" /></TableCell>
                      <TableCell align="left"><Link href={product.url} target='_blank'>{product.name}</Link></TableCell>
                      <TableCell align="center">$ {product.price}</TableCell>
                      <TableCell align="center"><Link href={product.domain} target='_blank'>{product.domain}</Link></TableCell>
                      <TableCell align="center">{product.size}</TableCell>
                      <TableCell align="center"><Switch checked={product.orderStatus > 0} onChange={(e) => orderStatusChanged(e.target.checked, 0, order._id, idx)}/></TableCell>
                      <TableCell align="center"><Switch checked={product.orderStatus > 1} onChange={(e) => orderStatusChanged(e.target.checked, 1, order._id, idx)}/></TableCell>
                      <TableCell align="center"><Switch checked={product.orderStatus > 2} onChange={(e) => orderStatusChanged(e.target.checked, 2, order._id, idx)}/></TableCell>
                      <TableCell align="center">
                        {product.orderStatus > 1 &&
                          <IconButton aria-label="Shipping Notes" size='small' onClick={() => openShippingNotesModal(order._id, idx)}>
                            <NoteAdd />
                          </IconButton>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const Orders = () => {
  const classes = useStyles();
  const { addToast } = useToasts();

  const [ orders, setOrders ] = useState([]);
  const [countPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(1);
  const [page, setPage] = useState(1);
  const [shippingNotesModalInfo, setShippingNoteModalInfo] = useState({});
  const [shippingNote, setShippingNote] = useState('');

  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast]);

  const fetchOrders = useCallback(() => {
    api.getOrders({ page, countPerPage })
      .then((data) => {
        setOrders(data.orders);
        setTotalCount(Math.floor((data.total - 1) / countPerPage) + 1);
      })
      .catch(err => showToast(err.message));
  }, [page, countPerPage, showToast])

  useEffect(() => {
    fetchOrders();
  }, [page, fetchOrders])

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const orderStatusChanged = (value, type, orderId, productIdx) => {
    api.updateOrderStatusByProduct({ status: value + type, orderId, productIdx })
      .then((data) => {
        const orderIdx = orders.findIndex(o => o._id === orderId);
        if (orderIdx < 0) return ;
        orders[orderIdx] = data.order;
        setOrders([...orders]);
      })
      .catch(err => showToast(err.message));
  }

  const openShippingNotesModal = (_id, idx) => {
    const order = orders.find(itm => itm._id === _id);
    setShippingNoteModalInfo({ _id, idx });
    const product = order.products[idx];
    setShippingNote(product.shippingNote)
  }

  const closeShippingNoteModal = () => {
      setShippingNoteModalInfo({});
  }

  const saveShippingNote = () => {
    api.updateShippingNote(shippingNotesModalInfo._id, shippingNotesModalInfo.idx, shippingNote)
      .then((data) => {
        const orderIdx = orders.findIndex(o => o._id === data.order?._id);
        if (orderIdx < 0) return ;
        orders[orderIdx].products = data.order.products;
        setOrders([...orders]);
        closeShippingNoteModal();
      })
      .catch(err => showToast(err.message));
  }

  return (
    <Layout>
      <Box marginY={1}>
        <Typography variant='h4'>All Orders</Typography>
      </Box>
      <TableContainer component={Paper} className={classes.tableBox}>
        <Table stickyHeader className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width={80}></TableCell>
              <TableCell align="center">User</TableCell>
              <TableCell align="center">Shipping Cost</TableCell>
              <TableCell align="center">Stripe Fee</TableCell>
              <TableCell align="center">Total Price</TableCell>
              <TableCell align="center">Items</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, idx) => (
              <OrderRow
                key={idx}
                order={order}
                orderStatusChanged={orderStatusChanged}
                openShippingNotesModal={openShippingNotesModal} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className={classes.paginationWrapper}>
        <Pagination count={totalCount} page={page} onChange={handlePageChange} color="primary" showFirstButton showLastButton />
      </Box>
      <AdminDialog title='Shipping Note' open={!!shippingNotesModalInfo._id} onClose={closeShippingNoteModal}>
        <Box mt={1}>
          <TextField label="Shipping Note" size="small" variant="outlined" multiline rows={5} fullWidth value={shippingNote} onChange={e => setShippingNote(e.target.value)} />
          <Box display='flex' gridGap='10px' justifyContent='flex-end' mt={2}>
            <Button variant="contained" color="primary" size="small" startIcon={<Update />} onClick={saveShippingNote}>Save</Button>
            <Button variant="contained" size="small" startIcon={<Close />} onClick={closeShippingNoteModal}>Close</Button>
          </Box>
        </Box>
      </AdminDialog>
    </Layout>
  )
}

export default Orders;