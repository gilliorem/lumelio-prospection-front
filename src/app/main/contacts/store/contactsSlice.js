import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { showMessage } from "app/store/fuse/messageSlice";
import axios from "axios";

export const getContacts = createAsyncThunk("getContacts", async () => {
  const response = await axios.get("/users/");
  const data = await response.data;

  return {
    data: data.map((e) => ({
      ...e,
      photo: e.photo ? `${process.env.REACT_APP_API_URL}${e.photo}` : null,
    })),
  };
});

export const getContact = createAsyncThunk("getContact", async (userId) => {
  const response = await axios.get(`/users/${userId}`);
  const data = await response.data;

  return {
    ...data,
    photo: data.photo ? `${process.env.REACT_APP_API_URL}${data.photo}` : null,
  };
});

export const addContact = createAsyncThunk(
  "addContact",
  async (contactData, { dispatch, getState }) => {
    const { photo, confirmpassword, ...newContact } = contactData;
    if (photo) {
      let image;
      if (typeof photo === "string" && photo.startsWith("https://")) {
        image = true;
      } else {
        image = photo;
      }
      newContact.photo = image;
    }
    const response = await axios.post("/users/", { ...newContact });
    const data = await response.data;

    if (response.status === 201) {
      dispatch(
        showMessage({
          message: "Utilisateur créé",
          variant: "success", // success error info warning null,
          autoHideDuration: 3000, // ms
          anchorOrigin: {
            vertical: "top", // top bottom
            horizontal: "center", // left center right
          },
        })
      );
    } else {
      dispatch(
        showMessage({
          message: "Erreur lors de la création",
          variant: "error", // success error info warning null,
          autoHideDuration: 3000, // ms
          anchorOrigin: {
            vertical: "top", // top bottom
            horizontal: "center", // left center right
          },
        })
      );
    }
    dispatch(getContacts());
    return data;
  }
);

export const updateContact = createAsyncThunk(
  "updateContact",
  async (contact, { dispatch, getState }) => {
    const { password, photo, confirmpassword, ...updatedContact } = contact;
    if (photo) {
      let image;

      if (typeof photo === "string" && photo.startsWith("https://")) {
        image = true;
      } else {
        image = photo;
      }
      updatedContact.photo = image;
    }

    const response = password
      ? await axios.put(`/users/${contact.id}`, { ...contact })
      : await axios.put(`/users/${contact.id}`, { ...updatedContact });

    const data = await response.data;

    if (response.status === 200) {
      dispatch(
        showMessage({
          message: "Utilisateur mis à jour",
          variant: "success", // success error info warning null,
          autoHideDuration: 3000, // ms
          anchorOrigin: {
            vertical: "top", // top bottom
            horizontal: "center", // left center right
          },
        })
      );
    } else {
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
    }
    return {
      ...data,
      photo: data.photo
        ? `${process.env.REACT_APP_API_URL}${data.photo}`
        : null,
    };
  }
);

export const removeContact = createAsyncThunk(
  "removeContact",
  async (contactId, { dispatch, getState }) => {
    const response = await axios.delete(`/users/${contactId}`);

    if (response.status === 200) {
      dispatch(
        showMessage({
          message: "Utilisateur supprimé",
          variant: "success", // success error info warning null,
          autoHideDuration: 3000, // ms
          anchorOrigin: {
            vertical: "top", // top bottom
            horizontal: "center", // left center right
          },
        })
      );
    } else {
      dispatch(
        showMessage({
          message: "Erreur lors de la suppression",
          variant: "error", // success error info warning null,
          autoHideDuration: 3000, // ms
          anchorOrigin: {
            vertical: "top", // top bottom
            horizontal: "center", // left center right
          },
        })
      );
    }

    return contactId;
  }
);

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } =
  contactsAdapter.getSelectors((state) => {
    return state.contactsApp.contacts;
  });

const contactsSlice = createSlice({
  name: "contactsApp",
  initialState: contactsAdapter.getInitialState({
    loading: false,
    searchText: "",
    routeParams: {},
    contactDialog: {
      type: "new",
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    setContactsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [updateContact.fulfilled]: contactsAdapter.upsertOne,
    [addContact.fulfilled]: contactsAdapter.addOne,
    [removeContact.fulfilled]: (state, action) =>
      contactsAdapter.removeOne(state, action.payload),
    [getContacts.pending]: (state, action) => {
      state.loading = true;
    },
    [getContacts.rejected]: (state, action) => {
      state.loading = false;
    },
    [getContacts.fulfilled]: (state, action) => {
      const { data } = action.payload;
      contactsAdapter.setAll(state, data);
      state.searchText = "";
      state.loading = false;
    },
    [getContact.fulfilled]: contactsAdapter.addOne,
  },
});

export const { setContactsSearchText } = contactsSlice.actions;

export default contactsSlice.reducer;
