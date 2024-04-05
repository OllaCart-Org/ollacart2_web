import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import OllaCartModal from "../components/modal";
import Signin from "../components/signin";
import { ExitToApp } from "@material-ui/icons";

import "./layout.scss";

import HomeLogo from "../components/Logo/home";
import CartLogo from "../components/Logo/cart";
import ShareLogo from "../components/Logo/share";
import BagLogo from "../components/Logo/bag";
import UserLogo from "../components/Logo/user";
import SocialLogo from "../components/Logo/social";
import Footer from "../components/Footer/footer";

const Layout = ({ children }) => {
  const { email, _id } = useSelector((state) => state.auth);
  const history = useHistory();
  const location = useLocation();

  const [page, setPage] = useState("");
  const [openSigninModal, setOpenSigninModal] = useState(false);

  const goTo = useCallback(
    (url) => {
      history.push(url);
    },
    [history]
  );

  useEffect(() => {
    if (location.pathname.indexOf("/privacy-policy") === 0) setPage("privacy");
    else if (location.pathname.indexOf("/terms-of-service") === 0)
      setPage("terms");
    else if (location.pathname.indexOf("/personal-data") === 0)
      setPage("personal");
    else if (location.pathname.indexOf("/support") === 0) setPage("support");
    else if (location.pathname.indexOf("/signin") === 0) setPage("signin");
    else if (location.pathname.indexOf("/profile") === 0) setPage("profile");
    else if (location.pathname.indexOf("/share/together") === 0) {
      document.title = "My OllaCart";
      setPage("singleshare");
    } else if (location.pathname.indexOf("/share") === 0) setPage("share");
    else if (location.pathname.indexOf("/order") === 0) setPage("order");
    else if (location.pathname.indexOf("/purchase") === 0) setPage("purchase");
    else if (location.pathname.indexOf("/social") === 0) setPage("social");
    else if (location.pathname.indexOf("/home") === 0) setPage("home");
    else setPage("landing");
  }, [email, location, goTo]);

  return (
    <div className="main-content">
      {page === "singleshare" && <title>My OllaCart</title>}
      <div className="menu">
        <div className="d-flex justify-content-between">
          <div className="right-menu">
            {email ? (
              <>
                <div
                  className={"menu-item" + (page === "home" ? " active" : "")}
                >
                  <HomeLogo onClick={() => goTo("/home")} />
                </div>
                <div
                  className={
                    "menu-item" + (page === "purchase" ? " active" : "")
                  }
                >
                  <CartLogo onClick={() => goTo(`/purchase`)} />
                </div>
                <div
                  className={"menu-item" + (page === "share" ? " active" : "")}
                >
                  <ShareLogo onClick={() => goTo(`/share/${_id}`)} />
                </div>
                <div
                  className={"menu-item" + (page === "social" ? " active" : "")}
                >
                  <SocialLogo onClick={() => goTo(`/social`)} />
                </div>
              </>
            ) : (
              <>
                <div
                  className={
                    "menu-item" + (page === "landing" ? " active" : "")
                  }
                >
                  <HomeLogo onClick={() => goTo("/")} />
                </div>
              </>
            )}
          </div>
          <div className="right-menu">
            {email && (
              <div
                className={"menu-item" + (page === "order" ? " active" : "")}
              >
                <BagLogo onClick={() => goTo(`/order`)} />
              </div>
            )}
            <div
              className={"menu-item" + (page === "profile" ? " active" : "")}
            >
              {email && <UserLogo onClick={() => goTo("/profile")} />}
              {!email && (
                <ExitToApp
                  style={{ width: "100%", height: "100%" }}
                  onClick={() => setOpenSigninModal(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div>{children}</div>
      <Footer />
      <OllaCartModal
        open={!email && openSigninModal}
        onClose={() => setOpenSigninModal(false)}
      >
        <Signin />
      </OllaCartModal>
    </div>
  );
};

export default Layout;
