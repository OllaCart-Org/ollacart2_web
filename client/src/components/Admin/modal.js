import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { Fade, Modal, Typography } from '@material-ui/core'
import './modal.scss';


function AdminDialog(props) {
  const { children, title, open, onClose } = props

  return (
    <Modal open={open} onClose={onClose} className='admin-modal' disableEnforceFocus disableAutoFocus>
      <Fade in={open}>
        <div className='modal-body'>
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
      </Fade>
    </Modal>
  )
}

export default AdminDialog