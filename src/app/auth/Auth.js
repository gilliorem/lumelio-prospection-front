import FuseSplashScreen from "@fuse/core/FuseSplashScreen";
import auth0Service from "app/services/auth0Service";
import firebaseService from "app/services/firebaseService";
import jwtService from "app/services/jwtService";
import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { hideMessage, showMessage } from "app/store/fuse/messageSlice";

import { setUserData, logoutUser } from "./store/userSlice";

class Auth extends Component {
  state = {
    waitAuthCheck: true,
  };

  componentDidMount() {
    return Promise.all([
      // Comment the lines which you do not use
      // this.firebaseCheck(),
      // this.auth0Check(),
      this.jwtCheck(),
    ]).then(() => {
      this.setState({ waitAuthCheck: false });
    });
  }

  jwtCheck = () =>
    new Promise((resolve) => {
      jwtService.on("onAutoLogin", () => {
        // this.props.showMessage({ message: "Logging in with JWT" });

        /**
         * Sign in and retrieve user data from Api
         */
        jwtService
          .signInWithToken()
          .then((user) => {
            this.props.setUserData(user);

            resolve();

            this.props.showMessage({
              message: "Vous êtes connecté",
              variant: "success", // success error info warning null,
              autoHideDuration: 6000, // ms
              anchorOrigin: {
                vertical: "bottom", // top bottom
                horizontal: "right", // left center right
              },
            });
          })
          .catch((error) => {
            this.props.showMessage({ message: error.message });
            this.props.logout();
            resolve();
          });
      });

      jwtService.on("onAutoLogout", (message) => {
        if (message) {
          this.props.showMessage({ message });
        }

        this.props.logout();

        resolve();
      });

      jwtService.on("onNoAccessToken", () => {
        this.props.logout();
        resolve();
      });

      jwtService.init();

      return Promise.resolve();
    });

  render() {
    return this.state.waitAuthCheck ? (
      <FuseSplashScreen />
    ) : (
      <>{this.props.children}</>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      logout: logoutUser,
      setUserData,

      showMessage,
      hideMessage,
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(Auth);
