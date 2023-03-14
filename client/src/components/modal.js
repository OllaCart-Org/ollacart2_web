import React from 'react';
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { Modal, Typography } from '@material-ui/core'
import './modal.scss';

const OllaCartModal = ({ children, open, onClose, title }) => {
  return (
    <Modal className='ollacart-modal' open={open} onClose={onClose}>
      <div className="modal-body">
        <div className='modal-header'>
          <Typography variant='h6'>{title}</Typography>
          <IconButton aria-label="Close" className='close-button' onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className='modal-container'>
          <div className='modal-content'>
            {children}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default OllaCartModal;