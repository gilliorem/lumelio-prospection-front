import { yupResolver } from "@hookform/resolvers/yup";
import formatISO from "date-fns/formatISO";
import { Controller, FormProvider, useForm } from "react-hook-form";
import FuseUtils from "@fuse/utils/FuseUtils";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { DateTimePicker, LoadingButton } from "@mui/lab";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ButtonGroup,
  DialogContentText,
  DialogTitle,
  FormControl,
  List,
  ListItem,
  Select,
} from "@mui/material";
import * as yup from "yup";
import _ from "@lodash";
import { closeDialog, openDialog } from "app/store/fuse/dialogSlice";
import {
  removeEvent,
  closeNewEventDialog,
  closeEditEventDialog,
  updateEvent,
  addEvent,
  selectEventById,
} from "./store/eventsSlice";
import complements from "../prospection/complements";
import {
  getStreetData,
  openRDVDialog,
} from "../prospection/store/prospectionSlice";
import NewProspectionDialog from "./NewProspectionDialog";

const defaultValues = {};

/**
 * Form Validation Schema
 */


// 19/11 implementing date and week duration event
const predefineddEventTypes = 
[
  {
    label: "Absent toute la journée",
    duration: "day",
  },
  {
    label: "Absent toute la semaine",
    duration: "week",
  },
];

// --remi--


function NewEventDialog(props) {
  const dispatch = useDispatch();

  const [housenumber, setHousenumber] = useState(null);
  const [complement, setComplement] = useState(null);
  const [house, setHouse] = useState(null);
  const [streetsLoading, setStreetsLoading] = useState(false);

  const schema = yup.object().shape({
    street: yup.string().required("Veuillez saisir un nom de rue"),
    city: yup.string().required("Veuillez saisir une ville"),
    housenumber: yup.string().required("Veuillez saisir un numéro de rue"),
  });

  const methods = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    watch,
    handleSubmit,
    formState,
    reset,
    control,
    setValue,
    getValues,
  } = methods;

  const form = watch();
  const { errors, isValid, dirtyFields } = formState;

  function closeComposeDialog() {
    reset();
    props.setStreetsFromAPI(null);
    props.onClose();
    //  CLOSE DIALOG
  }

  const handlePredefinedEvent = (type) => {
    const start = new Date(); // Current date and time
    let end;
  
    if (type.duration === "day") {
      end = new Date(start);
      end.setDate(start.getDate() + 1); // Add one day
    } else if (type.duration === "week") {
      end = new Date(start);
      end.setDate(start.getDate() + 7); // Add one week
    }
  
    // Dispatch the action to add the event
    dispatch(
      addEvent({
        title: type.label,
        start,
        end,
      })
    );
  
    // Close the dialog after adding the event
    closeComposeDialog();
  };

  //-------remi 19/11/24 implementing day and week duration event------

  

  //-------remi 19/11/24 implementing day and week duration event------

  /**
   * Form Submit
   */

  return (
    <>
      {/* Render Predefined Event Buttons */}
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        {predefineddEventTypes.map((type) => (
          <Button
            key={type.label}
            onClick={() => handlePredefinedEvent(type)}
          >
            {type.label}
          </Button>
        ))}
      </ButtonGroup>

      {/* Render NewProspectionDialog */}
      <NewProspectionDialog onClose={closeComposeDialog} />
    </>
  );
}

export default NewEventDialog;
