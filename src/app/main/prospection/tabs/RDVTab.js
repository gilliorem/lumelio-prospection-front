import { useEffect, useRef, useState } from "react";
import { DateTimePicker } from "@mui/lab";
import { TextField, Typography, Icon, IconButton } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { Controller, useFormContext } from "react-hook-form";
import withReducer from "app/store/withReducer";
import { useDispatch, useSelector } from "react-redux";
import { getEvents, selectEvents } from "../../calendar/store/eventsSlice";
import reducer from "../../calendar/store";

function RoleTab(props) {
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;
  const dispatch = useDispatch;
  const calendarRef = useRef();
  const calendarApi = () => calendarRef.current?.getApi();
  const [currentDate, setCurrentDate] = useState();
  const handleDates = (rangeInfo) => {
    setCurrentDate(rangeInfo);
  };
  const events = useSelector(selectEvents);

  return (
    <div className="flex">
      <div className="w-2/3 pr-24 py-16">
        <div className="mb-16">
          <Controller
            name="date"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <>
                <DateTimePicker
                  value={value}
                  onChange={onChange}
                  minutesStep={15}
                  label="Date et Heure du RDV"
                  todayText="Aujourd'hui"
                  toolbarTitle="Choisir une date et une heure"
                  renderInput={(_props) => (
                    <TextField fullWidth label="Date de RDV" {..._props} />
                  )}
                />
              </>
            )}
          />
        </div>
      </div>
      <div className="w-1/3 min-h-500 flex flex-col pr-8 -mt-40">
        <div className="flex items-center justify-center">
          <IconButton onClick={() => calendarApi().today()}>
            <Icon>today</Icon>
          </IconButton>
          <div className="flex items-center">
            <IconButton onClick={() => calendarApi().prev()}>
              <Icon>chevron_left</Icon>
            </IconButton>
            {currentDate && (
              <Typography className="text-13 font-600">
                {currentDate?.view.title}
              </Typography>
            )}
            <IconButton onClick={() => calendarApi().next()}>
              <Icon>chevron_right</Icon>
            </IconButton>
          </div>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={false}
          initialView="timeGridDay"
          editable
          selectable
          fixedWeekCount={false}
          selectMirror
          height={500}
          dayMaxEvents
          weekends
          locale={frLocale}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          datesSet={handleDates}
          // select={handleDateSelect}
          events={events}
          // eventContent={renderEventContent}
          // eventClick={handleEventClick}
          // eventAdd={handleEventAdd}
          // eventChange={handleEventChange}
          // eventRemove={handleEventRemove}
          // eventDrop={handleEventDrop}
          initialDate={new Date()}
          ref={calendarRef}
        />
      </div>
    </div>
  );
}

export default withReducer("calendarApp", reducer)(RoleTab);
