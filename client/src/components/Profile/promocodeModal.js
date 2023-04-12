import { Box, Button, Typography } from '@material-ui/core';
import React from 'react';
import OllaCartModal from '../modal';
import { Add } from '@material-ui/icons';

const PromoCodeModal = ({ open, onClose, inviteModalOpen }) => {

  return (
    <OllaCartModal open={open} onClose={onClose} title='Activate Promo Codes'>
      <Box width={350} maxWidth='100%' padding={1} paddingX={1}>
        <Box>
          <Typography variant='h5'>OllaCart includes the best promo code combinations in every order for the low price of one user referral.
          In order to activate promo codes for your account, please refer a friend to OllaCart!</Typography>
        </Box>
        <Box mt={2} display='flex' justifyContent='center'>
          <Button variant='contained' color='primary' size='small' startIcon={<Add />} onClick={inviteModalOpen}>Invite a friend</Button>
        </Box>
        <Box mt={3}>
          <Typography variant='h5'>After you invite someone to join you shopping online with OllaCart, we will automatically apply discount and coupon codes to every order as they are available.
          You will receive these promotions as adjustments to your purchase price and total cost after the order is placed.</Typography>
        </Box>
      </Box>
    </OllaCartModal>
  )
}

export default PromoCodeModal;