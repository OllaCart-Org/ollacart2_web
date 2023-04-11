import { Box, Switch, Typography } from '@material-ui/core';
import React from 'react';
import OllaCartModal from '../modal';

const AnonymousModal = ({ open, onClose, status, inputChanged }) => {

  return (
    <OllaCartModal open={open} onClose={onClose} title='Anonymous Shopping'>
      <Box width={350} maxWidth='100%' padding={1}>
        <Box display='flex' justifyContent='space-between' alignItems='center' gap={5}>
          <Typography variant='h5'>Hide username in social cart</Typography>
          <Switch color='primary' name='anonymous_username' checked={status.anonymous_username} onChange={inputChanged} disabled />
        </Box>
        <Box mt={3} display='flex' justifyContent='space-between' alignItems='center' gap={5}>
          <Typography variant='h5'>Withhold personal data from retailers</Typography>
          <Switch color='primary' name='anonymous_shopping' checked={status.anonymous_shopping} onChange={inputChanged} />
        </Box>
        <Box mt={3} display='flex' justifyContent='space-between' alignItems='center' gap={5}>
          <Typography variant='h5'>Anonymous Gifting</Typography>
          <Switch color='primary' name='anonymous_gifting' checked={false} disabled />
        </Box>
      </Box>
    </OllaCartModal>
  )
}

export default AnonymousModal;