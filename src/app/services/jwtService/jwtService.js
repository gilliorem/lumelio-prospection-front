import FuseUtils from "@fuse/utils/FuseUtils";
import axios from "axios";
import jwtDecode from "jwt-decode";
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (
            err.response.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            this.emit("onAutoLogout", "Token de connexion invalide");
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit("onNoAccessToken");

      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit("onAutoLogin", true);
    } else {
      this.setSession(null);
      this.emit("onAutoLogout", "Token de connexion expiré");
    }
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      axios.post("/api/auth/register", data).then((response) => {
        if (response.data.user) {
          this.setSession(response.data.access_token);
          resolve(response.data.user);
        } else {
          reject(response.data.error);
        }
      });
    });
  };

  signInWithEmailAndPassword = (email, password) => {
    return new Promise((resolve, reject) => {
      axios.post("/auth/login", { email, password }).then((response) => {
        if (response.data) {
          this.setSession(response.data.access_token);
          resolve(response.data.user);
        } else {
          reject(response.data.error);
        }
      });
    });
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      const token = this.getAccessToken();
      if (token && this.isAuthTokenValid(token)) {
        axios.get("/auth/profile").then((response) => {
          if (response.data) {
            this.setSession(token);
            resolve(response.data);
          } else {
            this.logout();
            reject(new Error("Erreur de connexion à partir du token"));
          }
        });
      } else {
        this.logout();
        reject(new Error("Erreur de connexion à partir du token"));
      }
    });
  };

  updateUserData = (user) => {
    const { photo, ...updatedUser } = user;
    if (photo) {
      let image;

      if (typeof photo === "string" && photo.startsWith("https://")) {
        image = true;
      } else {
        image = photo;
      }
      updatedUser.photo = image;
    }

    return axios.put("/auth/profile", {
      ...updatedUser,
    });
  };

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem("jwt_access_token", access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.removeItem("jwt_access_token");
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn("Votre token d'accès a expiré");
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    const token = window.localStorage.getItem("jwt_access_token");
    return token;
  };
}

const instance = new JwtService();

export default instance;
