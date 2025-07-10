import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";  // Import the hook
import api from "../../api";
import { actions } from "../../redux/_actions";
import utils from "../../utils";

const Signin = ({ isOpen, closeModal }) => {
  const [value, setValue] = useState("");
  const [interv, setInterv] = useState(null);

  const { verifying, secure_identity } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
 
  // Use the useToasts hook
  const { addToast } = useToasts();

  const showToast = useCallback(
    (message, appearance = "error") => {
      addToast(message, { appearance, autoDismiss: true });
    },
    [addToast]
  );

  useEffect(() => {
    if (verifying && !interv) {
      const checkSecureVerified = () => {
        api
          .checkSecureVerified(secure_identity)
          .then((data) => {
            if (data.success) {
              clearInterval(interv);
              setInterv(null);
              dispatch(actions.verifySignin({ uid: secure_identity }));
            }
          })
          .catch((err) => {
            console.log("dDDDd",err)
            showToast(err.message)});  // Show toast on error
      };

      if (interv) clearInterval(interv);
      const interval = setInterval(checkSecureVerified, 5000);
      setInterv(interval);
    }
  }, [verifying, interv, secure_identity, dispatch, showToast]);

  const signin = () => {
    dispatch(actions.signin({ email: value }));
  };

  return (
    <div className={`signup-modal ${isOpen ? "open" : ""}`}>
      <div className="background-img">
        <img
          src="/Modal.svg"
          alt="hero section logo"
          width={1000}
          height={1000}
        />
      </div>
      <form action="">
        <div className="headings">
          <div className="logo-heading">
            <img
              src="/ollcart-icon-128-79.png"
              alt="hero section logo"
              width={204}
              height={67}
              style={{ objectFit: "cover" }}
            />

            <h1>Sign Up</h1>
          </div>

          <p> a social way to shop and save </p>
        </div>
        <div className="form-wrap">
          <div className="input-container">
            <p>Email</p>
            <input type="text" placeholder="Email" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <p>
            By clicking Sign Up you're confirming that you agree with our Terms and Conditions.
          </p>
        </div>
        <div className="button" onClick={signin}> 
          Sign in 
        </div>
      </form>
      {verifying ? (
        <div className="verify-container">
          This account is secured. Please check your email to complete login.
        </div>
      ) : ""}
    </div>
  );
};

export default Signin;
