import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../components/Landing/Footer";
import Header from "../components/Landing/Header";
import utils from "../utils";

const Layout = ({ children }) => {
  const { email, _id } = useSelector((state) => state.auth);
  const history = useHistory();
  const location = useLocation();
  //const isIPhone = utils.getPhoneType() === "iPhone";

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
    <div className={page === 'landing' ? '' : 'main-content'}>
      <Header />
      {children}
      <Footer />
    </div>
    );
};

export default Layout;
