import { Box, Button, Typography } from '@material-ui/core';
import React from 'react';
import OllaCartModal from '../modal';
import { Check } from '@material-ui/icons';

const AnonymousShoppingConfirm = ({ open, onClose, agreeAnonymousShopping }) => {

  return (
    <OllaCartModal open={open} onClose={onClose} title='Anonymous Shopping'>
      <Box width={300} maxWidth='100%' paddingY={1}>
        <Box>
          <Typography variant='h5'>To use this feature, we charge 1% of the value of the Product.</Typography>
        </Box>
        <Box mt={2} display='flex' justifyContent='center'>
          <Button variant='contained' color='primary' size='small' startIcon={<Check />} onClick={agreeAnonymousShopping}>Agree</Button>
        </Box>
      </Box>
    </OllaCartModal>
  )
}

export default AnonymousShoppingConfirm;