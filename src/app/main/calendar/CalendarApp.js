import Fab from "@mui/material/Fab";
import { styled } from "@mui/material/styles";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import withReducer from "app/store/withReducer";
import { motion } from "framer-motion";
import frLocale from "@fullcalendar/core/locales/fr";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CalendarHeader from "./CalendarHeader";
import EventDialog from "./EventDialog";
import reducer from "./store";
import {
  selectEvents,
  openNewEventDialog,
  openEditEventDialog,
  updateEvent,
  getEvents,
} from "./store/eventsSlice";
import NewEventDialog from "./NewEventDialog";
import TodoDialog from "../prospection/ProspectionDialog";
import NewProspectionDialog from "./NewProspectionDialog";

const Root = styled("div")(({ theme }) => ({
  "& a": {
    color: `${theme.palette.text.primary}!important`,
    textDecoration: "none!important",
  },
  "&  .fc-media-screen": {
    minHeight: "100%",
  },
  "& .fc-scrollgrid, & .fc-theme-standard td, & .fc-theme-standard th": {
    borderColor: `${theme.palette.divider}!important`,
  },
  "&  .fc-scrollgrid-section > td": {
    border: 0,
  },
  "& .fc-daygrid-day": {
    "&:last-child": {
      borderRight: 0,
    },
  },
  "& .fc-col-header-cell": {
    borderWidth: "0 0 1px 0",
    padding: "16px 0",
    "& .fc-col-header-cell-cushion": {
      color: theme.palette.text.secondary,
      fontWeight: 500,
    },
  },
  "& .fc-view ": {
    borderRadius: 20,
    overflow: "hidden",
    border: `1px solid ${theme.palette.divider}`,
    "& > .fc-scrollgrid": {
      border: 0,
    },
  },
  "& .fc-daygrid-day-number": {
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
  "& .fc-event": {
    color: `${theme.palette.primary.contrastText}!important`,
    overflow: "hidden",
    border: 0,
    padding: "0 6px",
    borderRadius: "5px!important",
  },
}));

const StyledAddButton = styled("div")(({ theme }) => ({
  position: "absolute",
  right: 12,
  top: 172,
  zIndex: 99,
}));
function CalendarApp(props) {
  const [currentDate, setCurrentDate] = useState();
  const dispatch = useDispatch();
  const events = useSelector(selectEvents);
  const calendarRef = useRef();
  const [newEventDialogOpen, setNewEventDialogOpen] = useState(false);
  const [newEventDateSelected, setNewEventDateSelected] = useState(null);
  const [streetsFromAPI, setStreetsFromAPI] = useState(null);

  const headerEl = useRef(null);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const handleDateSelect = (selectInfo) => {
    const { start } = selectInfo;
    setNewEventDateSelected(start);
    setNewEventDialogOpen(true);
  };

  const handleEventDrop = (eventDropInfo) => {
    const { id, title, start, end, extendedProps } = eventDropInfo.event;
    
    console.log("Dropped Event Data:",
      {
        id,
        title,
        start,
        end,
        extendedProps,
      }
    );
    
    dispatch(
      updateEvent({
        id,
        title,
        //
        start : start.toISOString(),
        end: end.toISOString(),
        extendedProps,
      })
    );
  };
  const handleEventClick = (clickInfo) => {
    const { id, title, start, end, extendedProps } = clickInfo.event;
    dispatch(
      openEditEventDialog({
        id,
        title,
        start,
        end,
        extendedProps,
      })
    );
  };

  const handleDates = (rangeInfo) => {
    setCurrentDate(rangeInfo);
  };

  const handleEventAdd = (addInfo) => {};

  const handleEventChange = (changeInfo) => {};

  const handleEventRemove = (removeInfo) => {};

  return (
    <Root className="flex flex-col flex-auto relative">
      <CalendarHeader calendarRef={calendarRef} currentDate={currentDate} />

      <div className="flex flex-1 p-24 container">
        <motion.div
          className="w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
        >
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={false}
            initialView="dayGridMonth"
            hiddenDays={[0]}
            
            editable
            selectable
            fixedWeekCount={false}
            selectMirror
            dayMaxEvents
            eventDidMount={(e) => {
              if (e.backgroundColor && e.backgroundColor !== "") {
                e.el.style.background = e.backgroundColor;
                e.el.style.color = "#FFFFFF";
              } else {
                e.el.style.background = "#16213A";
                e.el.style.color = "#FFFFFF";
              }
            }}
            weekends
            locale={frLocale}
            // datesSet={handleDates}
            select={handleDateSelect}
            events={Array.isArray(events) ? events:[]}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            eventAdd={handleEventAdd}
            eventChange={handleEventChange}
            eventRemove={handleEventRemove}
            eventDrop={handleEventDrop}
            
            // initialDate={new Date()}
            validRange={() => ({ start: "2021-01-01", end: "2100-01-01" })}
            ref={calendarRef}
          />
        </motion.div>

        <StyledAddButton
          as={motion.div}
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: { delay: 0.4 } }}
        >
          <Fab
            color="secondary"
            aria-label="add"
            onClick={() => setNewEventDialogOpen(true)}
          >
            <Icon>add</Icon>
          </Fab>
        </StyledAddButton>
        <EventDialog />

        <NewProspectionDialog
          selectedDate={newEventDateSelected}
          resetSelectedDate={() => setNewEventDateSelected(null)}
          onClose={() => setNewEventDialogOpen(false)}
          open={newEventDialogOpen}
        />
      </div>
    </Root>
  );
}

function renderEventContent(eventInfo) {
  return (
    <div className="flex items-center">
      <Typography className="text-12 font-semibold">
        {eventInfo.timeText || ""}
      </Typography>
      <Typography className="text-12 px-4 truncate">
        {eventInfo.event.title || ""}
      </Typography>
    </div>
  );
}

export default withReducer("calendarApp", reducer)(CalendarApp);
