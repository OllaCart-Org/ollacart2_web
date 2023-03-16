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
  }
}