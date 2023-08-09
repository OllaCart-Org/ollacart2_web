import { combineReducers } from 'redux';
import { Constants } from '../_constants';

let user = {
  email: '',
  role: '',
  _id: '',
  secure: 0,
  error: '',
  verifying: 0,
  purchaseCount: 0,
  orderCount: 0,
  secure_identity: '',
}

let loading = {
  loading: false,
  verifyLoadingState: 'pending'  //first check token if valid  
}

// let token = localStorage.getItem('token');

const initialState = () => ({ ...user, ...loading })
    //   return token ? { loggedIn: true, user } : { loggedIn: false };

function auth(state = initialState(), action) {
  console.log(action);
  switch (action.type) {
    case Constants.SIGNIN_SUCCESS:
    case Constants.VERIFY:
      return {
        ...state,
        email: action.email,
        role: action.role,
        _id: action._id,
        loading: false,
        secure: action.secure,
        error: ''
      };
    case Constants.VERIFYEMAIL:
      return {
        ...state,
        ...user,
        verifying: true,
        secure_identity: action.secure_identity
      }
    case Constants.SIGNIN_FAILED:
      return {
        ...state,
        ...user,
        error: action.error
      }
    case Constants.REQUEST_FAILED:
      return {
        ...state,
        ...user,
        error: action.error
      }
    case Constants.SIGNOUT:
      return { ...state, ...user };
    case Constants.SETERROR:
      return {
        ...state,
        error: action.error
      }
    case Constants.SETLOADING:
      return {
        ...state,
        loading: action.loading
      }
    case Constants.SETVERIFYLOADING:
      return {
        ...state,
        verifyLoadingState: action.state
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  auth,
});

export default rootReducer;