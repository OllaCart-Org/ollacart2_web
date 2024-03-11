import { Constants } from "../_constants";
import api from "../../api";
import utils from "../../utils";

export const actions = {
  signin,
  verifySignin,
  signout,
  verify,
  setError,
  setLoading,
};

function signin(data) {
  return (dispatch) => {
    let { email } = data;
    email = (email || "").replace(/ /g, "").toLocaleLowerCase();
    if (!email) return dispatch(setError("Input valid email!"));
    if (!utils.validateEmail(email))
      return dispatch(setError("Input valid email!"));
    dispatch(setLoading(true));

    api
      .signin(email)
      .then((data) => {
        dispatch(setLoading(false));
        if (data.verify) {
          return dispatch({
            type: Constants.VERIFYEMAIL,
            secure_identity: data.uid,
          });
        }
        if (!data || !data.user || data.error) {
          return dispatch({
            type: Constants.SIGNIN_FAILED,
            error: (data && data.error) || "Signin Failed!",
          });
        }
        localStorage.setItem("token", data.token);
        if (!utils.checkRedirect()) {
          dispatch({
            type: Constants.SIGNIN_SUCCESS,
            email: data.user.email,
            role: data.user.role,
            _id: data.user._id,
            secure: data.user.secure,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

function verifySignin(data) {
  return (dispatch) => {
    let { uid } = data;
    dispatch(setLoading(true));

    api
      .verifySignin(uid)
      .then((data) => {
        dispatch(setLoading(false));
        localStorage.setItem("token", data.token);
        if (!utils.checkRedirect()) {
          window.location.href = "/";
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(setLoading(false));
        return dispatch({
          type: Constants.SIGNIN_FAILED,
          error: (data && data.error) || "Signin Failed!",
        });
      });
  };
}

function verify(token) {
  return (dispatch) => {
    dispatch(setVerifyLoading("loading"));
    if (!token) {
      return dispatch(setVerifyLoading("finished"));
    }
    api
      .verifyUser(token)
      .then((data) => {
        localStorage.setItem("token", data.token);
        dispatch({
          type: Constants.SIGNIN_SUCCESS,
          email: data.user.email,
          role: data.user.role,
          _id: data.user._id,
          secure: data.user.secure,
        });
        dispatch(setVerifyLoading("finished"));
      })
      .catch((err) => {
        console.log(err);
        dispatch(setVerifyLoading("finished"));
        localStorage.setItem("token", "");
      });
  };
}

function signout() {
  localStorage.removeItem("token");
  window.location.href = "/";
  // return { type: Constants.SIGNOUT };
}

function setLoading(loading = true) {
  return {
    type: Constants.SETLOADING,
    loading,
  };
}

function setVerifyLoading(state = "finished") {
  return {
    type: Constants.SETVERIFYLOADING,
    state,
  };
}

function setError(error) {
  return {
    type: Constants.SETERROR,
    error,
  };
}
