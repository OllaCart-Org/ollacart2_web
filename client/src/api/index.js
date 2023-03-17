import { store } from '../redux/_helpers';
import { actions } from '../redux/_actions';

const API_URL = process.env.REACT_APP_API_URL;

const call = (url, _data) => {
  const data = {
    token: localStorage.getItem('token') || '',
    ce_id: localStorage.getItem('ce_id') || '',
    ..._data
  }

  store.dispatch(actions.setLoading(true));

  return fetch(API_URL + url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      store.dispatch(actions.setLoading(false));
      if(!response.ok) {
        const json = await response.json();
        let error = response.statusText;
        if (json && json.error) error = json.error
        throw Error(error);
      }
      return response.json();
    })
}


const signin = (email) => {
  return call(`/signin`, { email });
}

const request = (email) => {
  return call(`/request`, { email });
}

const verifyUser = () => {
  return call(`/verify`, {});
}

const getProducts = (filter) => {
  return call(`/products/by/search`, filter);
};

const shareProduct = (productID, shared) => {
  return call(`/share/${productID}`, { shared });
};

const putCart = (productID, shared, purchased) => {
  return call(`/putcart/${productID}`, { shared, purchased });
};

const updateProduct = (productID, detail) => {
  return call(`/product/update/${productID}`, detail);
}

const updateProductLogo = (productID, logo) => {
  return call(`/product/updatelogo/${productID}`, { logo });
}

const updateProductSequence = (data) => {
  return call(`/product/update_sequence`, { data });
}

const removeProduct = (productID) => {
  return call(`/product/remove/${productID}`);
};

const getUsers = (pagination) => {
  return call(`/admin/getusers/`, { pagination });
}

const getCarts = (pagination) => {
  return call(`/admin/getcarts/`, { pagination });
}

const getOrders = (pagination) => {
  return call(`/admin/getorders/`, { pagination });
}

const getAnalytics = () => {
  return call(`/admin/getanalytics/`, { });
}

const getFeedbacks = (pagination) => {
  return call(`/admin/getfeedbacks/`, { pagination });
}

const getPartnerRequests = (pagination) => {
  return call(`/admin/getpartnerrequests/`, { pagination });
}

const getInvestorRequests = (pagination) => {
  return call(`/admin/getinvestorrequests/`, { pagination });
}

const verifySecure = (uid) => {
  return call(`/auth/verifysecure/`, { uid });
}

const verifySignin = (uid) => {
  return call(`/auth/verifysignin/`, { uid });
}

const checkSecureVerified = (uid) => {
  return call(`/auth/checkSecureVerified/`, { uid });
}

const fetchPurchaseLink = () => {
  return call(`/stripe/fetchpurchaselink`, { });
}

const createPaymentIntent = () => {
  return call(`/stripe/createpaymentintent`, { });
}

const fetchProductsByClientSecret = (clientSecret) => {
  return call(`/order/productsbyclientsecret`, { clientSecret });
}

const updateOrderStatusByProduct = (detail) => {
  return call(`/order/updateorderstatusbyproduct`, { detail });
}

const updateShippingNote = (orderId, idx, shippingNote) => {
  return call(`/order/updateshippingnote/${orderId}`, { idx, shippingNote });
}

const getOrderedProducts = () => {
  return call(`/order/getorderedproducts`, { });
}

const getOrdersByUser = () => {
  return call(`/order/getordersbyuser`, { });
}

const getShareStatus = (_id) => {
  return call(`/product/getsharestatus`, { _id });
}

const followUser = (followId, email = '') => {
  return call(`/user/follow`, { followId, email });
}

const unFollowUser = (followId) => {
  return call(`/user/unfollow`, { followId });
}

const forkProduct = (productID, email) => {
  return call(`/product/fork/${productID}`, { email });
}

const thumbup = (productID, email) => {
  return call(`/product/thumbup/${productID}`, { email });
}

const thumbdown = (productID, email) => {
  return call(`/product/thumbdown/${productID}`, { email });
}

const sendInvestContact = (detail) => {
  return call(`/contact/invest`, detail);
}

const sendPartnerContact = (detail) => {
  return call(`/contact/partner`, detail);
}

const sendFeedback = (detail) => {
  return call(`/contact/feedback`, detail);
}

const getAccountSettings = () => {
  return call(`/user/getaccountsettings`, {});
}

const updateAccountSettings = (detail) => {
  return call(`/user/updateaccountsettings`, detail);
}

export default {
  signin,
  request,
  verifyUser,
  getProducts,
  shareProduct,
  putCart,
  updateProduct,
  updateProductLogo,
  removeProduct,
  getUsers,
  getCarts,
  getOrders,
  getAnalytics,
  getFeedbacks,
  getInvestorRequests,
  getPartnerRequests,
  updateProductSequence,
  verifySecure,
  verifySignin,
  checkSecureVerified,
  fetchPurchaseLink,
  createPaymentIntent,
  fetchProductsByClientSecret,
  updateOrderStatusByProduct,
  updateShippingNote,
  getOrderedProducts,
  getOrdersByUser,
  getShareStatus,
  followUser,
  unFollowUser,
  forkProduct,
  thumbup,
  thumbdown,
  sendFeedback,
  sendInvestContact,
  sendPartnerContact,
  getAccountSettings,
  updateAccountSettings,
}