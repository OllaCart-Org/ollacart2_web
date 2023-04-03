import React from 'react';
import { useSelector } from "react-redux"
import Carousel from 'react-material-ui-carousel'
import { FormatQuote } from '@material-ui/icons';

import Layout from './layout';
import Signin from '../components/signin';
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
import { Box } from '@material-ui/core';

const SlideImgs = [{
    img: SlideImg1,
    text: 'Select the items that you want to purchase from multiple different sites by turning the product outline green, and select the items that you wish to share with other users by turning the outline blue.'
  }, {
    img: SlideImg2,
    text: 'Copy and paste the website link at the top of your shared cart wherever you want.'
  }, {
    img: SlideImg3,
    text: 'You may now purchase products via OllaCart from any combination of websites. We are currently fine-tuning our purchase-as-a-service system, and appreciate all feedback.'
  }, {
    img: SlideImg4,
    text: 'Track your purchases and shipping in our centralized order tracking system.'
  }, {
    img: SlideImg5,
    text: 'Introducing social shopping - follow your favorite shoppers and give feedback!'
  }]

const Landing = () => {
  const { email } = useSelector(state => state.auth);

  const openWebStore = () => {
    window.open('https://chrome.google.com/webstore/detail/ollacart/hpbmlmabfkbhmhjhocddfckebbnbkcbm', '_blank');
  }

  return (
    <Layout>
      <div className='landing-page'>
        <div className='landing-top'>
          <div>
            <Box className='landing-logo' mt={5}>
              <OllaCartMultiLogo className='color-white' />
              <p>OllaCart is a universal and social shopping cart. Use the extension to select any product online, which will add it to your OllaCart.</p>
            </Box>
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
        <Box className='user-comments color-light' my={5}>
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
        </Box>
      </div>
    </Layout>
  );
};

export default Landing;
