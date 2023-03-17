import commaNumber from "comma-number";

export default {
  validateEmail: email => {
    var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
    if (!email.match(pattern)) {
      return false;
    }
    return true;
  },
  getShortID: _id => {
    if(typeof _id !== 'string') return '';
    return _id.substring(0, 8);
  },
  calcPriceWithFee: price => {
    return (price + 0.3) / (1 - 0.029);
  },
  calcStripeFee: price => {
    return (price + 0.3) / (1 - 0.029) - price;
  },
  commaPrice: price => {
    if (typeof price === 'string') return commaNumber(price);
    return commaNumber(price.toFixed(2));
  },
  checkURL: str => {
    try {
      const d = new URL(str);
      console.log(d);
      return true;
    } catch(ex) {
      return false;
    }
  },
  openLink: url => {
    window.open(url, '_blank');
  },
  getStoredThumbCount: (_id) => {
    const d = window.localStorage.getItem('ollacart_thumb_count');
    try {
      const data = JSON.parse(d) || {};
      return data[_id] || { thumbup: 0, thumbdown: 0 };
    } catch(ex) {
      return { thumbup: 0, thumbdown: 0 };
    }
  },
  setStoredThumbCount: (_id, count) => {
    const d = window.localStorage.getItem('ollacart_thumb_count');
    let data = {};
    try {
      data = JSON.parse(d) || {};
    } catch(ex) {
      data = {};
      console.log(ex);
    }
    data[_id] = count;
    window.localStorage.setItem('ollacart_thumb_count', JSON.stringify(data));
  },
  getUsername: (user) => {
    if (!user) return '';
    return user.name || (user.email || '').split('@')[0];
  }
}