import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { addEvent } from "app/main/calendar/store/eventsSlice";
import { showMessage } from "app/store/fuse/messageSlice";
import axios from "axios";

export const getStreetData = createAsyncThunk(
  "prospection/getStreetData",
  async (street, { getState }) => {
    if (street.housenumber && street.complement) {
      const response = await axios.get(
        `/addresses?geoId=${street.id}&housenumber=${street.housenumber}&complement=${street.complement}`
      );
      if (!response.data) {
        return { ...street, numbers: [] };
      }
      return { ...street, numbers: response.data };
    }
    const response = await axios.get(`/addresses?geoId=${street.id}`);

    if (!response.data) {
      return { ...street, numbers: [] };
    }
    return { ...street, numbers: response.data };
  }
);

export const setHouseNumberStatus = createAsyncThunk(
  "prospection/setHouseNumberData",
  async (body, { dispatch, getState }) => {
    try {
      if (body.id) {
        const previousEvent = getState().prospection.streetData.numbers.filter(
          (e) => e.id === body.id
        )[0];
        const response = await axios.put(`/addresses/${previousEvent.id}`, {
          ...body,
          housenumber: Number(body.housenumber),
          complement: body.complement ? Number(body.complement) : 1,
        });
        if (body.status === 2) {
          dispatch(
            addEvent({
              addressId: response.data.id,
              date: body.date,
              sale: 0,
              status: 1,
            })
          );
        }

        return {
          housenumber: Number(body.housenumber),
          status: body.status,
          complement: body.complement ? Number(body.complement) : 1,
          id: previousEvent.id,
        };
      } else {
        const response = await axios.post("/addresses", {
          ...body,
          housenumber: Number(body.housenumber),
          complement: body.complement ? Number(body.complement) : 1,
        });
        if (body.status === 2) {
          dispatch(
            addEvent({
              addressId: response.data.id,
              date: body.date,
              sale: 0,
              status: 1,
            })
          );
        }

        return {
          housenumber: Number(body.housenumber),
          status: body.status,
          complement: body.complement ? Number(body.complement) : 1,
          id: response.data.id,
        };
      }
    } catch (error) {
      dispatch(
        showMessage({
          message: "Une erreur s'est produite",
          variant: "error", // success error info warning null,
          autoHideDuration: 3000, // ms
          anchorOrigin: {
            vertical: "bottom", // top bottom
            horizontal: "right", // left center right
          },
        })
      );
      return null;
    }
  }
);

export const removeAddress = createAsyncThunk(
  "prospection/removeAddress",
  async (addressId, { dispatch, getState }) => {
    try {
      const response = await axios.delete(`/addresses/${addressId}`);
      console.log(response);
      dispatch(
        showMessage({
          message: "Adresse supprimée",
          variant: "success", // success error info warning null,
          autoHideDuration: 3000, // ms
          anchorOrigin: {
            vertical: "top", // top bottom
            horizontal: "center", // left center right
          },
        })
      );
    } catch {
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
    return addressId;
  }
);

const prospectionSlice = createSlice({
  name: "prospection",
  initialState: {
    tabValue: 0,
    streetData: {},
    RDVDialog: {
      props: {
        open: false,
      },
      data: null,
    },
  },
  reducers: {
    openRDVDialog: (state, action) => {
      state.RDVDialog = {
        props: {
          open: true,
        },
        data: { ...action.payload },
      };
    },
    closeRDVDialog: (state, action) => {
      state.RDVDialog = {
        props: {
          open: false,
        },
        data: null,
      };
    },
    changeTabValue: (state, action) => {
      state.tabValue = action.payload;
    },
    addNumberToStreet: (state, { payload }) => {
      const { housenumber, complement } = payload;
      const houseExists = state.streetData.numbers.filter(
        (e) => e.housenumber === `${housenumber}` && e.complement === complement
      )[0];
      if (!houseExists) {
        const newNumbers = [
          ...state.streetData.numbers,
          { housenumber, status: 1, complement },
        ];
        state.streetData.numbers = newNumbers.sort((a, b) => {
          if (Number(a.housenumber) > Number(b.housenumber)) {
            return 1;
          }
          if (Number(b.housenumber) > Number(a.housenumber)) {
            return -1;
          }
          return 0;
        });
        if (Number(housenumber) % 2 === 0) {
          state.tabValue = 0;
        } else {
          state.tabValue = 1;
        }
      }
    },
    addNextNumberToStreet: (state, action) => {
      if (action.payload === 0) {
        // Pair
        const evenNumbers = state.streetData.numbers.filter(
          (e) => Number(e.housenumber) % 2 === 0
        );
        if (evenNumbers.length === 0) {
          state.streetData.numbers = [
            ...state.streetData.numbers,
            { housenumber: "2", complement: 1, status: 1 },
          ];
        } else {
          const lastEvenNumber = Number(
            evenNumbers[evenNumbers.length - 1].housenumber
          );
          state.streetData.numbers = [
            ...state.streetData.numbers,
            { housenumber: `${lastEvenNumber + 2}`, complement: 1, status: 1 },
          ];
        }
      } else {
        // Impair
        const oddNumbers = state.streetData.numbers.filter(
          (e) => Number(e.housenumber) % 2 !== 0
        );
        if (oddNumbers.length === 0) {
          state.streetData.numbers = [
            ...state.streetData.numbers,
            { housenumber: "1", complement: 1, status: 1 },
          ];
        } else {
          const lastOddNumber = Number(
            oddNumbers[oddNumbers.length - 1].housenumber
          );
          state.streetData.numbers = [
            ...state.streetData.numbers,
            { housenumber: `${lastOddNumber + 2}`, complement: 1, status: 1 },
          ];
        }
      }
    },
    addPreviousNumberToStreet: (state, action) => {
      if (action.payload === 0) {
        // Pair
        const evenNumbers = state.streetData.numbers.filter(
          (e) => Number(e.housenumber) % 2 === 0
        );
        const firstEvenNumber = Number(evenNumbers[0].housenumber);
        if (firstEvenNumber > 2) {
          state.streetData.numbers = [
            { housenumber: `${firstEvenNumber - 2}`, complement: 1, status: 1 },
            ...state.streetData.numbers,
          ];
        }
      } else {
        // Impair
        const oddNumbers = state.streetData.numbers.filter(
          (e) => Number(e.housenumber) % 2 !== 0
        );
        const firstOddNumber = Number(oddNumbers[0].housenumber);
        if (firstOddNumber > 1) {
          state.streetData.numbers = [
            { housenumber: `${firstOddNumber - 2}`, complement: 1, status: 1 },
            ...state.streetData.numbers,
          ];
        }
      }
    },
  },
  extraReducers: {
    [getStreetData.fulfilled]: (state, { payload }) => {
      state.streetData = payload;
    },
    [removeAddress.fulfilled]: (state, { payload }) => {
      state.streetData.numbers = state.streetData.numbers.filter(
        (e) => e.id !== payload
      );
    },
    [setHouseNumberStatus.fulfilled]: (state, { payload }) => {
      const { housenumber, status, complement, id } = payload;
      state.streetData.numbers = state.streetData.numbers.map((e) => {
        // eslint-disable-next-line eqeqeq
        if (e.housenumber == housenumber && e.complement == complement) {
          e.status = status;
          e.id = id;
        }
        return e;
      });
    },
  },
});

export const {
  addNumberToStreet,
  openRDVDialog,
  closeRDVDialog,
  addNextNumberToStreet,
  addPreviousNumberToStreet,
  changeTabValue,
} = prospectionSlice.actions;

export default prospectionSlice.reducer;
