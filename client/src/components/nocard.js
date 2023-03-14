import React from 'react';
import { LinearProgress } from '@material-ui/core';
import Logo from '../assets/img/Olla - g128.png';

const NoCard = ({page}) => {
  return (
    <div className="no-card-container">
      <img src={Logo} alt="logo"/>
      <div className="no-card-text">
        {(page === 'home') && <>Add any item you wish to share or purchase to OllaCart using our <a target="_blank" rel="noopener noreferrer" href="https://chrome.google.com/webstore/detail/ollacart/hpbmlmabfkbhmhjhocddfckebbnbkcbm">Chrome Extension</a>.</>}
        {(page === 'purchase') && <>Add items to your purchase cart by clicking on the item once to turn the outline green.</>}
        {(page === 'share') && <>Add items to your shared cart by clicking on the item twice to turn the outline blue.</>}
      </div>
      <LinearProgress />
    </div>
  );
};

export default NoCard;
