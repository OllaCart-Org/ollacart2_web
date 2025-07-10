import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import { MuiThemeProvider, createTheme } from "@material-ui/core";
import { Provider } from "react-redux";
import { store } from "Redux@Helpers";

import Loading from "./components/loading";
import Profile from "./views/profile";
import Secure from "./views/secure";
import Verify from "./views/verify";
import Landing from "./views/landing";
import Home from "./views/home";
import Share from "./views/share";
import SingleShare from "./views/singleshare";
import Purchase from "./views/purchase";
import Order from "./views/order";
import Social from "./views/social";
import AddItem from "./views/AddItem";
import Login from "./views/Login";

import Privacy from "./views/service/privacy";
import Support from "./views/service/support";
import Terms from "./views/service/terms";
import Personal from "./views/personal";

import ManageUsers from "./views/admin/users";
import ManageTaxes from "./views/admin/taxes";
import ManageCarts from "./views/admin/carts";
import ManageOrders from "./views/admin/orders";
import ManageAnalytics from "./views/admin/analytics";
import ManageFeedbacks from "./views/admin/feedbacks";
import ManageContracts from "./views/admin/contracts";
import { actions } from "./redux/_actions";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1446A0",
    },
    secondary: {
      main: "#EC1C24",
    },
  },
});

const ProtectedRoute = ({ isAdmin, ...props }) => {
  const { email, role } = useSelector((state) => state.auth);
  if (!email) {
    return (
      <Redirect key="redirect" to={`/login?redirect=${window.location.href}`} />
    );
  }
  if (isAdmin && role !== "admin") return <Redirect key="redirect" to="/" />;
  return <Route {...props} />;
};

function AppContainer() {
  const dispatch = useDispatch();
  const { email, loading, verifyLoadingState } = useSelector(
    (state) => state.auth
  );

  const [interv, setInterv] = useState(null);

  const fetchRealTimeData = useCallback(() => {
    console.log("fetch");
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!email) {
      dispatch(actions.verify(token));
    }
  }, [email, dispatch]);

  useEffect(() => {
    if (email) {
      if (interv) return;
      // const interval = setInterval(fetchRealTimeData, 5000);
      // setInterv(interval);
    }
    return () => {
      if (interv) clearInterval(interv);
    };
  }, [email, interv, setInterv, fetchRealTimeData]);

  if (verifyLoadingState !== "finished") return <Loading />;

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <ToastProvider placement="top-right">
          <Router>
            <Switch>
              <Route
                path="/secure/:uid"
                name="secure"
                exact
                component={Secure}
              />
              <Route
                path="/verify/:uid"
                name="verify"
                exact
                component={Verify}
              />
              <Route path="/privacy-policy" exact component={Privacy} />
              <Route path="/terms-of-service" exact component={Terms} />
              <Route path="/personal-data" exact component={Personal} />
              <Route path="/support" exact component={Support} />
              <Route
                path="/share/together/:productid"
                name="singleshare"
                exact
                component={SingleShare}
              />
              <Route
                path="/share/:userid"
                name="share"
                exact
                component={Share}
              />
              <ProtectedRoute
                isAdmin
                path="/admin/users"
                exact
                component={ManageUsers}
              />
              <ProtectedRoute
                isAdmin
                path="/admin/taxes"
                exact
                component={ManageTaxes}
              />
              <ProtectedRoute
                isAdmin
                path="/admin/carts"
                exact
                component={ManageCarts}
              />
              <ProtectedRoute
                isAdmin
                path="/admin/orders"
                exact
                component={ManageOrders}
              />
              <ProtectedRoute
                isAdmin
                path="/admin/analytics"
                exact
                component={ManageAnalytics}
              />
              <ProtectedRoute
                isAdmin
                path="/admin/feedbacks"
                exact
                component={ManageFeedbacks}
              />
              <ProtectedRoute
                isAdmin
                path="/admin/contracts"
                exact
                component={ManageContracts}
              />
              <ProtectedRoute path="/home" exact component={Home} />
              <ProtectedRoute path="/purchase" exact component={Purchase} />
              <ProtectedRoute path="/social" exact component={Social} />,
              <ProtectedRoute path="/order" exact component={Order} />,
              <ProtectedRoute path="/profile" exact component={Profile} />
              <ProtectedRoute path="/add" exact component={AddItem} />
              {!email && (
                <>
                  <Route
                    key="login"
                    path="/login"
                    name="login"
                    exact
                    component={Login}
                  />
                  <Route path="/" exact component={Landing} />
                </>
              )}
              <Redirect key="redirect" to="/home" />
            </Switch>
          </Router>
          {loading && <Loading />}
        </ToastProvider>
      </MuiThemeProvider>
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
