import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import OllaCartModal from '../modal';
import Investor from '../Contacts/investor';
import Partner from '../Contacts/partner';
import Feedback from '../Contacts/feedback';
import './footer.scss';
import { Box } from '@material-ui/core';

const Footer = () => {
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  return (
    <>
      <hr />
      <Box className="ollacart-footer" py={5}>
        <Box className='inline-footer'>
          <span className='footer-button' onClick={() => setShowPartnerModal(true)}>Partners</span>
          <span className='footer-button' onClick={() => setShowFeedbackModal(true)}>Feedback</span>
          <span className='footer-button' onClick={() => setShowInvestorModal(true)}>Investors</span>
        </Box>
        <Box textAlign='center' mt={2}>
          <h3>Contact OllaCart</h3>
          <p>Phone: <a href="tel:+17034058794">+1 (703) 405-8794</a></p>
          <p>Email: <a href="mailto:support@ollacart.com">support@ollacart.com</a></p>
        </Box>
        <Box className='inline-footer' mt={2}>
          <Link className='footer-link' to='/terms-of-service'>Terms of Service</Link>
          <Link className='footer-link' to='/support'>Support</Link>
          <Link className='footer-link' to='/privacy-policy'>Privacy Policy</Link>
        </Box>
        <OllaCartModal open={showInvestorModal} onClose={() => setShowInvestorModal(false)} title='Investor Contact'>
          <Investor onClose={() => setShowInvestorModal(false)} />
        </OllaCartModal>
        <OllaCartModal open={showPartnerModal} onClose={() => setShowPartnerModal(false)} title='Partner Contact'>
          <Partner onClose={() => setShowPartnerModal(false)} />
        </OllaCartModal>
        <OllaCartModal open={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} title='Leave Feedback'>
          <Feedback onClose={() => setShowFeedbackModal(false)} />
        </OllaCartModal>
      </Box>
    </>
  );
};

export default Footer;
