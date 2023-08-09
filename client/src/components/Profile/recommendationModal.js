import { Box, Button, Typography } from '@material-ui/core';
import React from 'react';
import OllaCartModal from '../modal';
import { Add } from '@material-ui/icons';

const RecommendationModal = ({ open, onClose, inviteModalOpen }) => {

  return (
    <OllaCartModal open={open} onClose={onClose} title='Shopping Recommendation'>
      <Box width={350} maxWidth='100%' paddingY={1}>
        <Box>
          <Typography variant='h5'>Ollacart includes personal shopping recommendation for the low price of one user referral.
          In the future it will come at a cost, so take advantage of free personal shopping recommendations today.<br />
          Refer a friend to shop with you on OllaCart!</Typography>
        </Box>
        <Box mt={2} display='flex' justifyContent='center'>
          <Button variant='contained' color='primary' size='small' startIcon={<Add />} onClick={inviteModalOpen}>Invite a friend</Button>
        </Box>
        <Box mt={3}>
          <Typography variant='h5'>After you invite someone to join you shopping online with OllaCart, we will automatically provide personal shopping recommendations.<br />
          You will receive these products in your home cart.</Typography>
        </Box>
      </Box>
    </OllaCartModal>
  )
}

export default RecommendationModal;