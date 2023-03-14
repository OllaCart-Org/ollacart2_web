import { API } from '../config';
import { store } from '../redux/_helpers';
import { actions } from '../redux/_actions';


const call = (url, _data) => {
  const data = {
    token: localStorage.getItem('token') || '',
    ce_id: localStorage.getItem('ce_id') || '',
    ..._data
  }

  store.dispatch(actions.setLoading(true));

  return fetch(url, {
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
        if (json.error) error = json.error
        throw Error(error);
      }
      return response.json();
    })
}


const signin = (email) => {
  return call(`${API}/signin`, { email });
}

const request = (email) => {
  return call(`${API}/request`, { email });
}

const verifyUser = () => {
  return call(`${API}/verify`, {});
}

const getProducts = (filter) => {
  return call(`${API}/products/by/search`, filter);
};

const shareProduct = (productID, shared) => {
  return call(`${API}/share/${productID}`, { shared });
};

const putCart = (productID, shared, purchased) => {
  return call(`${API}/putcart/${productID}`, { shared, purchased });
};

const updateProduct = (productID, detail) => {
  return call(`${API}/product/update/${productID}`, detail);
}

const updateProductLogo = (productID, logo) => {
  return call(`${API}/product/updatelogo/${productID}`, { logo });
}

const updateProductSequence = (data) => {
  return call(`${API}/product/update_sequence`, { data });
}

const removeProduct = (productID) => {
  return call(`${API}/product/remove/${productID}`);
};

const getUsers = (pagination) => {
  return call(`${API}/admin/getusers/`, { pagination });
}

const getCarts = (pagination) => {
  return call(`${API}/admin/getcarts/`, { pagination });
}

const getOrders = (pagination) => {
  return call(`${API}/admin/getorders/`, { pagination });
}

const getAnalytics = () => {
  return call(`${API}/admin/getanalytics/`, { });
}

const getFeedbacks = (pagination) => {
  return call(`${API}/admin/getfeedbacks/`, { pagination });
}

const getPartnerRequests = (pagination) => {
  return call(`${API}/admin/getpartnerrequests/`, { pagination });
}

const getInvestorRequests = (pagination) => {
  return call(`${API}/admin/getinvestorrequests/`, { pagination });
}

const verifySecure = (uid) => {
  return call(`${API}/auth/verifysecure/`, { uid });
}

const verifySignin = (uid) => {
  return call(`${API}/auth/verifysignin/`, { uid });
}

const checkSecureVerified = (uid) => {
  return call(`${API}/auth/checkSecureVerified/`, { uid });
}

const fetchPurchaseLink = () => {
  return call(`${API}/stripe/fetchpurchaselink`, { });
}

const createPaymentIntent = () => {
  return call(`${API}/stripe/createpaymentintent`, { });
}

const fetchProductsByClientSecret = (clientSecret) => {
  return call(`${API}/order/productsbyclientsecret`, { clientSecret });
}

const updateOrderStatusByProduct = (detail) => {
  return call(`${API}/order/updateorderstatusbyproduct`, { detail });
}

const getOrderedProducts = () => {
  return call(`${API}/order/getorderedproducts`, { });
}

const getFollowStatus = (followId) => {
  return call(`${API}/user/follow/status`, { followId });
}

const followUser = (followId, email = '') => {
  return call(`${API}/user/follow`, { followId, email });
}

const unFollowUser = (followId) => {
  return call(`${API}/user/unfollow`, { followId });
}

const forkProduct = (productID, email) => {
  return call(`${API}/product/fork/${productID}`, { email });
}

const thumbup = (productID, email) => {
  return call(`${API}/product/thumbup/${productID}`, { email });
}

const thumbdown = (productID, email) => {
  return call(`${API}/product/thumbdown/${productID}`, { email });
}

const sendInvestContact = (detail) => {
  return call(`${API}/contact/invest`, detail);
}

const sendPartnerContact = (detail) => {
  return call(`${API}/contact/partner`, detail);
}

const sendFeedback = (detail) => {
  return call(`${API}/contact/feedback`, detail);
}

const getAccountSettings = () => {
  return call(`${API}/user/getaccountsettings`, {});
}

const updateAccountSettings = (detail) => {
  return call(`${API}/user/updateaccountsettings`, detail);
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
  getOrderedProducts,
  getFollowStatus,
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