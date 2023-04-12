import { Box, Button, Typography } from '@material-ui/core';
import React from 'react';
import OllaCartModal from '../modal';
import { Check } from '@material-ui/icons';

const AnonymousPurchaseConfirm = ({ open, onClose, agreeAnonymousPurchase }) => {

  return (
    <OllaCartModal open={open} onClose={onClose} title='Payment required'>
      <Box width={300} maxWidth='100%' paddingY={1}>
        <Box>
          <Typography variant='h5'>To use this feature, one-time payment of $5 is required.</Typography>
        </Box>
        <Box mt={2} display='flex' justifyContent='center'>
          <Button variant='contained' color='primary' size='small' startIcon={<Check />} onClick={agreeAnonymousPurchase}>Agree</Button>
        </Box>
      </Box>
    </OllaCartModal>
  )
}

export default AnonymousPurchaseConfirm;