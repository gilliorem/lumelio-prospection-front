import FuseUtils from "@fuse/utils";
import mock from "../mock";
import formatISO from "date-fns/formatISO";

function setDate(year, month, date, hours, minutes, seconds) {
  return formatISO(
    new Date(year, month, date, hours || "", minutes || "", seconds || "")
  );
}

const todaysDate = new Date();

const calendarDB = {
  events: [
    {
      id: 1,
      title: "R1 - 2 rue de la Madeleine, 59000 Lille",
      allDay: false,
      start: setDate(
        todaysDate.getFullYear(),
        todaysDate.getMonth(),
        todaysDate.getDate() + 1,
        10,
        30,
        0
      ),
      end: setDate(
        todaysDate.getFullYear(),
        todaysDate.getMonth(),
        todaysDate.getDate() + 1,
        11,
        30,
        0
      ),
    },
    {
      id: 2,
      title: "R1 - 4 rue de la Madeleine, 59000 Lille",
      allDay: false,
      start: setDate(
        todaysDate.getFullYear(),
        todaysDate.getMonth(),
        todaysDate.getDate() + 1,
        13,
        0,
        0
      ),
      end: setDate(
        todaysDate.getFullYear(),
        todaysDate.getMonth(),
        todaysDate.getDate() + 1,
        14,
        0,
        0
      ),
    },
    {
      id: 3,
      title: "R2 - 2 rue de la Madeleine, 59000 Lille",
      allDay: false,
      start: setDate(
        todaysDate.getFullYear(),
        todaysDate.getMonth(),
        todaysDate.getDate() + 4,
        10,
        0,
        0
      ),
      end: setDate(
        todaysDate.getFullYear(),
        todaysDate.getMonth(),
        todaysDate.getDate() + 4,
        11,
        0,
        0
      ),
    },
    {
      id: 4,
      title: "R1 - 6 rue de la Madeleine, 59000 Lille",
      allDay: false,
      start: setDate(
        todaysDate.getFullYear(),
        todaysDate.getMonth(),
        todaysDate.getDate() + 2,
        15,
        0,
        0
      ),
      end: setDate(
        todaysDate.getFullYear(),
        todaysDate.getMonth(),
        todaysDate.getDate() + 2,
        16,
        0,
        0
      ),
    },
  ],
};

mock.onGet("/api/calendar-app/events").reply((config) => {
  return [200, calendarDB.events];
});

mock.onPost("/api/calendar-app/add-event").reply((request) => {
  const data = JSON.parse(request.data);
  const newEvent = {
    ...data.newEvent,
    id: FuseUtils.generateGUID(),
  };
  calendarDB.events = [...calendarDB.events, newEvent];
  return [200, newEvent];
});

mock.onPost("/api/calendar-app/update-event").reply((request) => {
  const data = JSON.parse(request.data);

  calendarDB.events = calendarDB.events.map((event) => {
    if (data.event.id === event.id) {
      return data.event;
    }
    return event;
  });

  return [200, data.event];
});

mock.onPost("/api/calendar-app/remove-event").reply((request) => {
  const data = JSON.parse(request.data);
  const event = calendarDB.events.find((_event) => data.eventId === _event.id);
  calendarDB.events = calendarDB.events.filter(
    (_event) => _event.id !== event.id
  );

  return [200, event];
});
