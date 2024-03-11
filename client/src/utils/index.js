import commaNumber from "comma-number";
import queryString from "querystring";

export default {
  validateEmail: (email) => {
    var pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(pattern)) {
      return false;
    }
    return true;
  },
  validateUsername: (username) => {
    if (username && username.length > 14) return false;
    return true;
  },
  getShortID: (_id) => {
    if (typeof _id !== "string") return "";
    return _id.substring(0, 8);
  },
  calcPriceWithFee: (product) => {
    const price = product.price + 14 + (product.tax_status ? product.tax : 0);
    return price / (1 - 0.029);
  },
  calcStripeFee: (product) => {
    const price = product.price + 14 + (product.tax_status ? product.tax : 0);
    return price / (1 - 0.029) - price;
  },
  getTotalPrice: (product, showTax = true) => {
    let price =
      (product.itemsPrice || product.price) +
      product.anonymousPrice +
      product.shippingPrice;
    if (showTax) price += product.taxPrice;
    return price;
  },
  commaPrice: (price) => {
    if (!price) return 0;
    if (typeof price === "string") return commaNumber(price);
    return commaNumber(price.toFixed(2));
  },
  checkURL: (str) => {
    try {
      const d = new URL(str);
      console.log(d);
      return true;
    } catch (ex) {
      return false;
    }
  },
  openLink: (url) => {
    window.open(url, "_blank");
  },
  getStoredThumbCount: (_id) => {
    const d = window.localStorage.getItem("ollacart_thumb_count");
    try {
      const data = JSON.parse(d) || {};
      return data[_id] || { thumbup: 0, thumbdown: 0 };
    } catch (ex) {
      return { thumbup: 0, thumbdown: 0 };
    }
  },
  setStoredThumbCount: (_id, count) => {
    const d = window.localStorage.getItem("ollacart_thumb_count");
    let data = {};
    try {
      data = JSON.parse(d) || {};
    } catch (ex) {
      data = {};
      console.log(ex);
    }
    data[_id] = count;
    window.localStorage.setItem("ollacart_thumb_count", JSON.stringify(data));
  },
  getStoredSuggestItems: () => {
    const d = window.localStorage.getItem("ollacart_suggest_items");
    try {
      const data = JSON.parse(d) || [];
      return data;
    } catch (ex) {
      return [];
    }
  },
  setStoredSuggestItem: function (_id) {
    const data = this.getStoredSuggestItems();
    const idx = data.indexOf(_id);
    if (idx > -1) return;
    data.push(_id);
    window.localStorage.setItem("ollacart_suggest_items", JSON.stringify(data));
  },
  getUsername: (user) => {
    if (!user) return "";
    return user.username || (user.email || "").split("@")[0];
  },
  getSearchParams: () => {
    const searchQuery = window.location.search.replace("?", "");
    const params = queryString.parse(searchQuery);
    return params;
  },
  checkRedirect: () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get("redirect");
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return true;
      }
    } catch (err) {}
    return false;
  },
};
