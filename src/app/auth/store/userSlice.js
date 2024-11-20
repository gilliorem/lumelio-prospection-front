import { createSlice } from "@reduxjs/toolkit";
import firebase from "firebase/app";
import "firebase/auth";
import history from "@history";
import _ from "@lodash";
// import { setInitialSettings, setDefaultSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from "app/store/fuse/messageSlice";
import settingsConfig from "app/fuse-configs/settingsConfig";
import jwtService from "app/services/jwtService";
import axios from "axios";

export const setUserData = (user) => async (dispatch, getState) => {
  /*
        You can redirect the logged-in user to a specific route depending on his role
         */

  // settingsConfig.loginRedirectUrl = "calendrier"; // for example 'apps/academy'

  // history.push("/");

  const response = await axios.get("/auth/profile");
  const userData = response.data;
  /*
    Set User Settings
     */
  // dispatch(setDefaultSettings(user.data.settings));

  dispatch(
    setUser({
      email: userData.email,
      role: userData.role,
      data: {
        ...userData,
        displayName: userData.displayName
          ? userData.displayName
          : `${userData.firstname} ${userData.lastname}`,
        photo: userData.photo
          ? `${process.env.REACT_APP_API_URL}${userData.photo}`
          : null,
      },
    })
  );
};

export const updateUserSettings = (settings) => async (dispatch, getState) => {
  const oldUser = getState().auth.user;
  const user = _.merge({}, oldUser, { data: { settings } });

  dispatch(updateUserData(user));

  return dispatch(setUserData(user));
};

export const updateUserShortcuts =
  (shortcuts) => async (dispatch, getState) => {
    const { user } = getState().auth;
    const newUser = {
      ...user,
      data: {
        ...user.data,
        shortcuts,
      },
    };

    dispatch(updateUserData(user));

    return dispatch(setUserData(newUser));
  };

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState().auth;

  if (!user.role || user.role.length === 0) {
    // is guest
    history.push({
      pathname: "/connexion",
    });
    return null;
  }
  // settingsConfig.loginRedirectUrl = "/connexion";

  history.push({
    pathname: "/connexion",
  });

  switch (user.from) {
    default: {
      jwtService.logout();
    }
  }

  // dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

export const updateUserData = (user) => async (dispatch, getState) => {
  if (!user.role || user.role.length === 0) {
    // is guest
    return;
  }
  switch (user.from) {
    default: {
      const currentEmail = getState().auth.user.email;
      jwtService
        .updateUserData(user)
        .then((response) => {
          dispatch(
            showMessage({
              message: "Profil modifié ",
              variant: "success", // success error info warning null,
              autoHideDuration: 3000, // ms
              anchorOrigin: {
                vertical: "top", // top bottom
                horizontal: "center", // left center right
              },
            })
          );
          if (currentEmail !== user.email) {
            dispatch(logoutUser());
          } else {
            dispatch(setUserData(response.data));
          }
        })
        .catch((error) => {
          dispatch(
            showMessage({
              message: "Erreur lors de la modification",
              variant: "error", // success error info warning null,
              autoHideDuration: 3000, // ms
              anchorOrigin: {
                vertical: "top", // top bottom
                horizontal: "center", // left center right
              },
            })
          );
        });
      break;
    }
  }
};

const initialState = {
  role: [], // guest
  data: {
    displayName: "Admin Lumélio",
    photoURL: "assets/images/avatars/profile.jpg",
    email: "admin@lumelio.com",
    shortcuts: [],
  },
};

const userSlice = createSlice({
  name: "auth/user",
  initialState,
  reducers: {
    setUser: (state, action) => action.payload,
    userLoggedOut: (state, action) => initialState,
  },
  extraReducers: {},
});

export const { setUser, userLoggedOut } = userSlice.actions;

export default userSlice.reducer;
