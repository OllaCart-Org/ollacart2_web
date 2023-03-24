import { useState } from 'react';
import React from 'react';
import { useSelector } from "react-redux"
import { Link } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel'
import { FormatQuote } from '@material-ui/icons';

import Layout from './layout';
import Signin from '../components/signin';
import OllaCartModal from '../components/modal';
import Investor from '../components/Contacts/investor';
import Partner from '../components/Contacts/partner';
import Feedback from '../components/Contacts/feedback';
import OllaCartMultiLogo from '../components/Logo/ollacartmulti';
import './landing.scss';

import WebStore from '../assets/img/chrome-webstore.png';
import Avatar1 from '../assets/img/avatar1.jpg';
import Avatar2 from '../assets/img/avatar2.jpg';
import ExtensionVideo from '../assets/videos/extension.mp4';
import SlideImg1 from '../assets/img/slide1.jpg';
import SlideImg2 from '../assets/img/slide2.jpg';
import SlideImg3 from '../assets/img/slide3.jpg';
import SlideImg4 from '../assets/img/slide4.jpg';
import SlideImg5 from '../assets/img/slide5.jpg';

const SlideImgs = [{
    img: SlideImg1,
    text: 'Select the items that you want to purchase from multiple different sites by turning the product outline green, and select the items that you wish to share with other users and the internet by turning the products outline blue.'
  }, {
    img: SlideImg2,
    text: 'You may copy and paste the website link at the top of your shared cart wherever you want.'
  }, {
    img: SlideImg3,
    text: 'You may now purchase products via OllaCart from any combination of websites. We are currently fine-tuning our purchase-as-a-service system, and appreciate all feedback.'
  }, {
    img: SlideImg4,
    text: 'Track your purchases and shipping in our centralized order tracking system.'
  }, {
    img: SlideImg5,
    text: 'For extra details on any item in your OllaCart, click on the expand logo to investigate.'
  }]

const Landing = () => {
  const { email } = useSelector(state => state.auth);
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  const openWebStore = () => {
    window.open('https://chrome.google.com/webstore/detail/ollacart/hpbmlmabfkbhmhjhocddfckebbnbkcbm', '_blank');
  }

  return (
    <Layout>
      <div className='landing-page'>
        <div className='landing-top'>
          <div>
            <div className='landing-logo mt-section'>
              <OllaCartMultiLogo className='color-white' />
              <p>OllaCart is a universal, social, online shopping cart. Use our extension to select the image of any product online, which will add it to your OllaCart.</p>
            </div>
            <div className='webstore-download' onClick={openWebStore}>
              <img src={WebStore} alt="websotre" />
              <h4>Chrome WebStore</h4>
            </div>
          </div>
          {!email && <div className='landing-signin'>
            <Signin />
          </div>}
        </div>
        <hr />
        <div className='landing-logo'>
          <h3>Using the Website</h3>
        </div>
        <div className='carousel-container'>
          <Carousel>
            {SlideImgs.map((itm, idx) => (
              <div key={idx}>
                <p className='carousel-text'>{itm.text}</p>
                <div className='carousel-item'>
                  <img src={itm.img} alt="slide" />
                </div>
              </div>
            ))}
          </Carousel>
        </div>
        <hr />
        <div className='landing-logo'>
          <h3>Using Extension</h3>
          <p>Select items from any online shopping website and add them to your OllaCart.<br />
            It is as easy as selecting the extension logo, hovering over the item to confirm details, and selecting either the text or image. From there you have the option to confirm additional information or images by manually selecting information.</p>
        </div>
        <div className='video-container'>
          <video src={ExtensionVideo} controls/>
        </div>
        <div className='mt-section user-comments color-light'>
          <div className='user-comment'>
            <FormatQuote />
            <span>The customer service for OllaCart is top-notch. I had an issue with one of my orders and they were quick to respond and resolve the problem. I highly recommend this extension to all my friends and family.</span>
            <FormatQuote />
            <div className='avatar-container'>
              <img src={Avatar1} alt="avatar" />
            </div>
          </div>
          <div className='user-comment'>
            <FormatQuote />
            <span>I've been using this shopping extension for a while now and it's been a real game-changer. Being able to add items to my cart from any shopping site has made online shopping so much easier and more efficient. It's also really user-friendly and doesn't slow down my browser like some other extensions I've tried.<br />Highly recommend it!</span>
            <FormatQuote />
            <div className='avatar-container'>
              <img src={Avatar2} alt="avatar" />
            </div>
          </div>
        </div>
        <hr />
        <div className='inline-footer mb-section'>
          <span className='footer-button' onClick={() => setShowPartnerModal(true)}>Partners</span>
          <span className='footer-button' onClick={() => setShowFeedbackModal(true)}>Feedback</span>
          <span className='footer-button' onClick={() => setShowInvestorModal(true)}>Investors</span>
        </div>
        <div className='landing-logo mb-section'>
          <h3>Contact OllaCart</h3>
          <p>Phone: <a href="tel:+17034058794">+1 (703) 405-8794</a></p>
          <p>Email: <a href="mailto:support@ollacart.com">support@ollacart.com</a></p>
        </div>
        <div className='inline-footer mb-section'>
          <Link className='footer-link' to='/terms-of-service'>Terms of Service</Link>
          <Link className='footer-link' to='/support'>Support</Link>
          <Link className='footer-link' to='/privacy-policy'>Privacy Policy</Link>
        </div>
      </div>
      <OllaCartModal open={showInvestorModal} onClose={() => setShowInvestorModal(false)} title='Investor Contact'>
        <Investor onClose={() => setShowInvestorModal(false)} />
      </OllaCartModal>
      <OllaCartModal open={showPartnerModal} onClose={() => setShowPartnerModal(false)} title='Partner Contact'>
        <Partner onClose={() => setShowPartnerModal(false)} />
      </OllaCartModal>
      <OllaCartModal open={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} title='Leave Feedback'>
        <Feedback onClose={() => setShowFeedbackModal(false)} />
      </OllaCartModal>
    </Layout>
  );
};

export default Landing;
