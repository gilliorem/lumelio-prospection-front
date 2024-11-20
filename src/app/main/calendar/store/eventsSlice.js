import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { getContacts } from "app/main/contacts/store/contactsSlice";
import { showMessage } from "app/store/fuse/messageSlice";
import axios from "axios";
import formatISO from "date-fns/formatISO";
import eventStatuses from "../eventStatus";

export const dateFormat = "YYYY-MM-DDTHH:mm:ss.sssZ";

//
export const defaultDurationEvent = 2;

export const getEvents = createAsyncThunk(
  "calendarApp/getEvents",
  async (args, { dispatch, getState }) => {
    const response = await axios.get("/events");
    const data = await response.data;
    await dispatch(getContacts());
    data.map((e) => {
      e.title = `${
        eventStatuses.filter((f) => e.status === f.status)[0].title
      } - ${e.address.lastname} | RDV pris le ${new Date(
        e.creationdate
      ).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })} par ${e.prospector.firstname}`;

      const date = new Date(e.date);
      e.start = date;
      e.end = new Date(date);
      // --20/11-- remi trying to make the event duration adjustable
      e.end.setHours(e.end.getHours() + (e.duration || defaultDurationEvent));
      e.backgroundColor = e.commercial.color;

      return e;
    });
    return data;
  }
);

export const addEvent = createAsyncThunk(
  "calendarApp/addEvent",
  async ({ commercial, prospector, ...newEvent }, { dispatch }) => {
    const response = await axios.post("/events", {
      ...newEvent,
    });
    const data = await response.data;
    dispatch(getEvents());
    dispatch(
      showMessage({
        message: "RDV créé",
        variant: "success", // success error info warning null,
        autoHideDuration: 3000, // ms
        anchorOrigin: {
          vertical: "top", // top bottom
          horizontal: "center", // left center right
        },
      })
    );
    return data;
  }
);

export const updateEvent = createAsyncThunk(
  "calendarApp/updateEvent",
  async ({ commercial, prospector, ...event }, { dispatch, getState }) => {
    if (prospector.id !== commercial.id) {
      if (getState().auth.user.data.id !== commercial.id) {
        if (getState().auth.user.role === "admin") {
          const response = await axios.put(`/events/${event.id}`, {
            ...event,
          });
          const data = await response.data;
          dispatch(getEvents());
          return data;
        }
        dispatch(
          showMessage({
            message: "Vous n'êtes pas autorisé à modifier cet évènement",
            variant: "warning",
            autoHideDuration: 3000, // ms
            anchorOrigin: {
              vertical: "top", // top bottom
              horizontal: "center", // left center right
            },
          })
        );
      } else {
        const response = await axios.put(`/events/${event.id}`, {
          ...event,
        });
        const data = await response.data;
        dispatch(getEvents());
        return data;
      }
    } else {
      const response = await axios.put(`/events/${event.id}`, {
        ...event,
      });
      const data = await response.data;
      dispatch(getEvents());
      return data;
    }
    return null;
  }
);

export const removeEvent = createAsyncThunk(
  "calendarApp/remove-event",
  async (eventId, { dispatch }) => {
    const response = await axios.delete(`/events/${eventId}`);
    const data = await response.data;
    dispatch(getEvents());
    return data.id;
  }
);

const eventsAdapter = createEntityAdapter({});

export const {
  selectAll: selectEvents,
  selectIds: selectEventIds,
  selectById: selectEventById,
} = eventsAdapter.getSelectors((state) => state.calendarApp.events);

const eventsSlice = createSlice({
  name: "calendarApp/events",
  initialState: eventsAdapter.getInitialState({
    eventDialog: {
      type: "new",
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    openNewEventDialog: {
      prepare: (event) => {
        const payload = {
          type: "new",
          props: {
            open: true,
          },
          data: {
            start: formatISO(event.start),
            end: formatISO(event.end),
          },
        };
        return { payload };
      },
      reducer: (state, action) => {
        state.eventDialog = action.payload;
      },
    },
    openEditEventDialog: {
      prepare: (event) => {
        const payload = {
          type: "edit",
          props: {
            open: true,
          },
          data: {
            ...event,
            start: formatISO(event.start),
          },
        };
        return { payload };
      },
      reducer: (state, action) => {
        state.eventDialog = action.payload;
      },
    },
    closeNewEventDialog: (state, action) => {
      state.eventDialog = {
        type: "new",
        props: {
          open: false,
        },
        data: null,
      };
    },
    closeEditEventDialog: (state, action) => {
      state.eventDialog = {
        type: "edit",
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [getEvents.fulfilled]: eventsAdapter.setAll,
    [addEvent.fulfilled]: eventsAdapter.addOne,
    [updateEvent.fulfilled]: eventsAdapter.upsertOne,
    [removeEvent.fulfilled]: eventsAdapter.removeOne,
  },
});

export const {
  openNewEventDialog,
  closeNewEventDialog,
  openEditEventDialog,
  closeEditEventDialog,
} = eventsSlice.actions;

export default eventsSlice.reducer;
