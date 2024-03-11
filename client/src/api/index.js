import { store } from "../redux/_helpers";
import { actions } from "../redux/_actions";

const API_URL = process.env.REACT_APP_API_URL;

const call = async (url, _data) => {
  const token = localStorage.getItem("token") || "";
  const ce_id = localStorage.getItem("ce_id") || "";
  const data = { token, ce_id, ..._data };

  store.dispatch(actions.setLoading(true));

  try {
    const response = await fetch(API_URL + url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    store.dispatch(actions.setLoading(false));

    if (!response.ok) {
      const json = await response.json();
      const error = json.error || response.statusText;
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error("Error occurred during API call:", error);
    throw error;
  }
};

const me = () => {
  return call(`/auth/me`, {});
};

const signin = (email) => {
  return call(`/signin`, { email });
};

const request = (email) => {
  return call(`/request`, { email });
};

const verifyUser = () => {
  return call(`/verify`, {});
};

const getProduct = (productId) => {
  return call(`/product/detail/${productId}`, {});
};

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
};

const updateProductLogo = (productID, idx) => {
  return call(`/product/updatelogo/${productID}`, { idx });
};

const updateProductSequence = (data) => {
  return call(`/product/update_sequence`, { data });
};

const removeProduct = (productID) => {
  return call(`/product/remove/${productID}`);
};

const getUsers = (pagination) => {
  return call(`/admin/getusers/`, { pagination });
};

const getCategories = (pagination) => {
  return call(`/admin/getcategories/`, { pagination });
};

const getTaxes = (detail = {}) => {
  return call(`/admin/gettaxes/`, detail);
};

const getCarts = (pagination, filter = {}) => {
  return call(`/admin/getcarts/`, { pagination, filter });
};

const getOrders = (pagination) => {
  return call(`/admin/getorders/`, { pagination });
};

const getAnalytics = () => {
  return call(`/admin/getanalytics/`, {});
};

const getFeedbacks = (pagination) => {
  return call(`/admin/getfeedbacks/`, { pagination });
};

const getPartnerRequests = (pagination) => {
  return call(`/admin/getpartnerrequests/`, { pagination });
};

const getInvestorRequests = (pagination) => {
  return call(`/admin/getinvestorrequests/`, { pagination });
};

const verifySecure = (uid) => {
  return call(`/auth/verifysecure/`, { uid });
};

const verifySignin = (uid) => {
  return call(`/auth/verifysignin/`, { uid });
};

const checkSecureVerified = (uid) => {
  return call(`/auth/checkSecureVerified/`, { uid });
};

const fetchPurchaseLink = () => {
  return call(`/stripe/fetchpurchaselink`, {});
};

const createPaymentIntent = () => {
  return call(`/stripe/createpaymentintent`, {});
};

const createAnonymousUsernamePaymentIntent = () => {
  return call(`/stripe/createanonymoususernamepaymentintent`, {});
};

const fetchProductsByClientSecret = (clientSecret) => {
  return call(`/order/productsbyclientsecret`, { clientSecret });
};

const updateOrderDetail = (orderId, detail) => {
  return call(`/order/updatedetail/${orderId}`, detail);
};

const getOrderedProducts = () => {
  return call(`/order/getorderedproducts`, {});
};

const getOrdersByUser = () => {
  return call(`/order/getordersbyuser`, {});
};

const getShareStatus = (_id) => {
  return call(`/product/getsharestatus`, { _id });
};

const getSocialStatus = (_id) => {
  return call(`/product/getsocialstatus`, {});
};

const inviteUser = (email) => {
  return call(`/user/invite`, { email });
};

const followUser = (followId, email = "") => {
  return call(`/user/follow`, { followId, email });
};

const unFollowUser = (followId) => {
  return call(`/user/unfollow`, { followId });
};

const forkProduct = (productID, email) => {
  return call(`/product/fork/${productID}`, { email });
};

const adminAddProduct = (userID, productID) => {
  return call(`/product/adminadd/${productID}`, { userID });
};

const thumbup = (productID, email) => {
  return call(`/product/thumbup/${productID}`, { email });
};

const thumbdown = (productID, email) => {
  return call(`/product/thumbdown/${productID}`, { email });
};

const singleShare = (productID, email) => {
  return call(`/product/singleshare/${productID}`, { email });
};

const anonymousShare = (productID, email) => {
  return call(`/product/anonymousshare/${productID}`, { email });
};

const sendInvestContact = (detail) => {
  return call(`/contact/invest`, detail);
};

const sendPartnerContact = (detail) => {
  return call(`/contact/partner`, detail);
};

const sendFeedback = (detail) => {
  return call(`/contact/feedback`, detail);
};

const getAccountSettings = () => {
  return call(`/user/getaccountsettings`, {});
};

const updateAccountSettings = (detail) => {
  return call(`/user/updateaccountsettings`, detail);
};

const createCategory = (detail) => {
  return call(`/category/create`, detail);
};

const updateCategory = (id, detail) => {
  return call(`/category/update/${id}`, detail);
};

const removeCateogory = (id) => {
  return call(`/category/remove/${id}`, {});
};

const updateTax = (detail) => {
  return call(`/tax/update`, detail);
};

const scanPage = (detail) => {
  return call(`/product/scanpage`, detail);
};

const getScanningUrls = () => {
  return call(`/product/getScanningUrls`);
};

export default {
  me,
  signin,
  request,
  verifyUser,
  getProduct,
  getProducts,
  shareProduct,
  putCart,
  updateProduct,
  updateProductLogo,
  removeProduct,
  getUsers,
  getCategories,
  getTaxes,
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
  createAnonymousUsernamePaymentIntent,
  fetchProductsByClientSecret,
  updateOrderDetail,
  getOrderedProducts,
  getOrdersByUser,
  getShareStatus,
  getSocialStatus,
  followUser,
  unFollowUser,
  forkProduct,
  adminAddProduct,
  thumbup,
  thumbdown,
  singleShare,
  anonymousShare,
  sendFeedback,
  sendInvestContact,
  sendPartnerContact,
  getAccountSettings,
  updateAccountSettings,
  removeCateogory,
  updateCategory,
  createCategory,
  updateTax,
  inviteUser,
  scanPage,
  getScanningUrls,
};
