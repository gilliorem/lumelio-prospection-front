import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import FuseUtils from "@fuse/utils";

export const getContact = createAsyncThunk(
  "eCommerceApp/product/getProduct",
  async (params) => {
    const response = await axios.get("/api/e-commerce-app/product", { params });
    const data = await response.data;

    return data === undefined ? null : data;
  }
);

export const removeContact = createAsyncThunk(
  "eCommerceApp/product/removeProduct",
  async (val, { dispatch, getState }) => {
    const { id } = getState().eCommerceApp.product;
    await axios.post("/api/e-commerce-app/remove-product", { id });

    return id;
  }
);

export const saveContact = createAsyncThunk(
  "eCommerceApp/product/saveProduct",
  async (productData, { dispatch, getState }) => {
    const { product } = getState().eCommerceApp;

    const response = await axios.post("/api/e-commerce-app/product/save", {
      ...product,
      ...productData,
    });
    const data = await response.data;

    return data;
  }
);

const contactSlice = createSlice({
  name: "eCommerceApp/product",
  initialState: null,
  reducers: {
    resetContact: () => null,
    newContact: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: FuseUtils.generateGUID(),
          name: "",
          handle: "",
          description: "",
          categories: [],
          tags: [],
          images: [],
          priceTaxExcl: 0,
          priceTaxIncl: 0,
          taxRate: 0,
          comparedPrice: 0,
          quantity: 0,
          sku: "",
          width: "",
          height: "",
          depth: "",
          weight: "",
          extraShippingFee: 0,
          active: true,
        },
      }),
    },
  },
  extraReducers: {
    [getContact.fulfilled]: (state, action) => action.payload,
    [saveContact.fulfilled]: (state, action) => action.payload,
    [removeContact.fulfilled]: (state, action) => null,
  },
});

export const { newContact, resetContact } = contactSlice.actions;

export default contactSlice.reducer;
