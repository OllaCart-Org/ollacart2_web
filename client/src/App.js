import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { ToastProvider } from 'react-toast-notifications';

import { Provider } from "react-redux";
import { store } from "Redux@Helpers";
import Loading from './components/loading';
import Profile from './views/profile';
import Secure from './views/secure';
import Verify from './views/verify';
import Signin from './views/signin';
import Landing from './views/landing';
import Home from './views/home';
import Share from './views/share';
import Purchase from './views/purchase';
import Order from './views/order';
import Social from './views/social';

import Privacy from './views/service/privacy';
import Support from './views/service/support';
import Terms from './views/service/terms';
import Personal from './views/personal';

import ManageUsers from './views/admin/users';
import ManageCarts from './views/admin/carts';
import ManageOrders from './views/admin/orders';
import ManageAnalytics from './views/admin/analytics';
import ManageFeedbacks from './views/admin/feedbacks';
import ManageContracts from './views/admin/contracts';
import { actions } from './redux/_actions';

function AppContainer() {
  const dispatch = useDispatch();
  const { email, role, loading, verifyLoadingState } = useSelector(state => state.auth)

  const [interv, setInterv] = useState(null);

  const fetchRealTimeData = useCallback(() => {
    console.log('fetch');
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!email) {
      dispatch(actions.verify(token));
    }
  }, [email, dispatch])

  useEffect(() => {
    if (email) {
      if(interv) return;
      const interval = setInterval(fetchRealTimeData, 5000);
      setInterv(interval)
    }
    return () => {
      if (interv) clearInterval(interv);
    }
  }, [email, interv, setInterv, fetchRealTimeData]);

  if (verifyLoadingState !== 'finished') return <Loading />

  return (
    <div>
      <ToastProvider>
        <Router>
          <Switch>
            <Route path="/secure/:uid" name='secure' exact component={Secure} />
            <Route path="/verify/:uid" name='verify' exact component={Verify} />
            <Route path="/privacy-policy" exact component={Privacy}/>
            <Route path="/terms-of-service" exact component={Terms}/>
            <Route path="/personal-data" exact component={Personal}/>
            <Route path="/support" exact component={Support}/>
            <Route path="/share/:userid" name='share' exact component={Share} />
            {(role === 'admin') && ([
              <Route key='users' path="/admin/users" exact component={ManageUsers}/>,
              <Route key='carts' path="/admin/carts" exact component={ManageCarts}/>,
              <Route key='orders' path="/admin/orders" exact component={ManageOrders}/>,
              <Route key='analytics' path="/admin/analytics" exact component={ManageAnalytics}/>,
              <Route key='feedbacks' path="/admin/feedbacks" exact component={ManageFeedbacks}/>,
              <Route key='contracts' path="/admin/contracts" exact component={ManageContracts}/>,
              <Redirect key='admin_redirect' from="/admin" to="/admin/analytics" />
            ])}
            {(email) ? ([
              <Route key='home' path="/home" name='home' exact component={Home} />,
              <Route key='purchase' path="/purchase" name='purchase' exact component={Purchase} />,
              <Route key='social' path="/social" name='social' exact component={Social} />,
              <Route key='order' path="/order" name='order' exact component={Order} />,
              <Route key='profile' path="/profile" name='profile' exact component={Profile} />,
              <Redirect key='redirect' to="/home" />
            ]) : ([
              <Route key='landing' path="/" name='landing' exact component={Landing} />,
              <Route key='signin' path="/signin" name='signin' exact component={Signin} />,
              <Redirect key='redirect' to="/" />
            ])}
          </Switch>
        </Router>
        {loading && <Loading />}
      </ToastProvider>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}