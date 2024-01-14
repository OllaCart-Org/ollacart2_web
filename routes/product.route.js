const express = require("express");
const router = express.Router();

const {
  create,
  update,
  updateSequence,
  remove,
  productById,
  getProduct,
  listBySearch,
  getCarts,
  updateLogo,
  forkProduct,
  adminAddProduct,
  thumbup,
  thumbdown,
  singleShare,
  anonymousShare,
  getShareStatus,
  getSocialStatus,
  scanPage,
} = require("../controllers/product.controller");
const { getAnalytics } = require("../controllers/admin.controller");
const {
  Auth,
  isAdmin,
  AuthWithEmail,
} = require("../controllers/auth.controller");
const { userById } = require("../controllers/user.controller");

router.post("/product/create", create);
router.post("/product/update/:productId", Auth, update);
router.post("/product/update_sequence", Auth, updateSequence);
router.post("/product/remove/:productId", Auth, remove);
router.post("/product/updatelogo/:productId", Auth, updateLogo);
router.post("/product/scanpage", Auth, scanPage);

router.post("/product/getsharestatus", Auth, getShareStatus);
router.post("/product/getsocialstatus", Auth, getSocialStatus);

router.post("/product/fork/:productId", Auth, AuthWithEmail, forkProduct);
router.post("/product/adminadd/:productId", Auth, isAdmin, adminAddProduct);
router.post("/product/thumbup/:productId", Auth, AuthWithEmail, thumbup);
router.post("/product/thumbdown/:productId", Auth, AuthWithEmail, thumbdown);

router.post("/product/singleshare/:productId", Auth, singleShare);
router.post("/product/anonymousshare/:productId", Auth, anonymousShare);

router.post("/product/detail/:productId", Auth, getProduct);
router.post("/products/by/search", Auth, listBySearch);
// router.post('/share/:productId', share);
// router.post('/putcart/:productId', putCart);

router.param("userId", userById);
router.param("productId", productById);

router.post("/admin/getcarts", Auth, isAdmin, getCarts);
router.post("/admin/getanalytics", Auth, isAdmin, getAnalytics);

module.exports = router;
