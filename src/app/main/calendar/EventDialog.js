import { yupResolver } from "@hookform/resolvers/yup";
import formatISO from "date-fns/formatISO";
import { Controller, useForm } from "react-hook-form";
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
import { DateTimePicker } from "@mui/lab";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ButtonGroup, DialogContentText, DialogTitle } from "@mui/material";
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

const defaultValues = {
  id: FuseUtils.generateGUID(),
  title: "",
  allDay: false,
  start: formatISO(new Date()),
  end: formatISO(new Date()),
  duration: 2
};

// test creneau jour
const AllDayValues = {
  id: FuseUtils.generateGUID(),
  title:"absent",
  allDay: true,
  start: formatISO(new Date()),
  end: formatISO(new Date())
}

/**
 * Form Validation Schema
 */

function EventDialog(props) {
  const dispatch = useDispatch();
  const [dialogAddress, setDialogAddress] = useState(null);
  const [nextAction, setNextAction] = useState(null);
  const [eventEditable, setEventEditable] = useState(true);
  const currentUserId = useSelector((state) => state.auth.user.data.id);

  const eventDialog = useSelector(
    ({ calendarApp }) => calendarApp.events.eventDialog
  );

  useEffect(() => {
    if (eventDialog && currentUserId) {
      if (eventDialog.data) {
        const prospectorId = eventDialog.data.extendedProps.prospectorId;
        const commercialId = eventDialog.data.extendedProps.commercialId;
        if (prospectorId !== commercialId && currentUserId !== commercialId) {
          setEventEditable(false);
        } else {
          setEventEditable(true);
        }
      } else {
        setEventEditable(true);
      }
    }
  }, [currentUserId, eventDialog]);

  const selectedEvent = useSelector((state) => {
    if (eventDialog.data) {
      return selectEventById(state, eventDialog.data.id);
    }
    return null;
  });

  const schema = yup.object().shape({
    date:
      (nextAction === 2 || nextAction === 5) &&
      yup.date().required("Vous devez sélectionner une date"),
    sale:
      nextAction === 4 &&
      yup.number().required("Veuillez entrer le montant de la vente"),
  });


  //setValue

  const { reset, formState, watch, control, getValues, setValue } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const start = watch("start");
  const end = watch("end");
  const id = watch("id");

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (eventDialog.type === "edit" && eventDialog.data) {
      reset({ ...eventDialog.data });
    }

    /**
     * Dialog type: 'new'
     */
    if (eventDialog.type === "new") {
      reset({
        ...defaultValues,
        ...eventDialog.data,
        id: FuseUtils.generateGUID(),
      });
    }
  }, [eventDialog.data, eventDialog.type, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (eventDialog.props.open) {
      initDialog();
    }
  }, [eventDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    reset();
    return eventDialog.type === "edit"
      ? dispatch(closeEditEventDialog())
      : dispatch(closeNewEventDialog());
  }

  /**
   * Form Submit
   */
  function onSubmit(ev) {
    ev.preventDefault();
    const data = getValues();
    // --remi 20/11 introducing duration --
    const duration = data.duration;

    // --

    if (selectedEvent) {
      if (nextAction === 2) {
        dispatch(
          addEvent({
            ...selectedEvent,
            address: selectedEvent.address,
            addressId: selectedEvent.addressId,
            status: nextAction,
            sale: 0,
            observations: data.observations,
            date: data.date,
            duration: duration,
          })
        );
      } else if (nextAction === 3) {
        dispatch(
          updateEvent({
            ...selectedEvent,
            id: selectedEvent.id,
            address: selectedEvent.address,
            addressId: selectedEvent.addressId,
            status: nextAction,
            date: new Date(selectedEvent.date),
            sale: 0,
          })
        );
      } else if (nextAction === 4) {
        dispatch(
          updateEvent({
            ...selectedEvent,
            id: selectedEvent.id,
            address: selectedEvent.address,
            addressId: selectedEvent.addressId,
            status: nextAction,
            date: new Date(selectedEvent.date),
            observations: data.observations,
            sale: Number(data.sale),
          })
        );
      } else if (nextAction === 5) {
        dispatch(
          updateEvent({
            ...selectedEvent,
            id: selectedEvent.id,
            address: selectedEvent.address,
            addressId: selectedEvent.addressId,
            observations: data.observations,
            date: data.date,
            //--duration
            duration: duration,
          })
        );
      }
    }

    closeComposeDialog();
  }

  /**
   * Remove Event
   */
  function handleRemove() {
    dispatch(removeEvent(id));
    closeComposeDialog();
  }
  useEffect(() => {
    const { data } = eventDialog;
    if (data) {
      const { extendedProps } = data;
      if (extendedProps) {
        const { address } = extendedProps;
        setDialogAddress(address);
      }
    }
  }, [eventDialog]);
  return (
    <Dialog
      {...eventDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="sm"
      component="form"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full items-center justify-between">
          <Typography variant="subtitle1" color="inherit">
            {eventDialog.data && eventDialog.data.title
              ? eventDialog.data.title
              : "Rendez-vous"}
          </Typography>
          <IconButton onClick={closeComposeDialog}>
            <Icon className="text-white">close</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogContent classes={{ root: "p-16 pb-12 sm:p-24 sm:pb-12" }}>
        {dialogAddress && (
          <>
            {selectedEvent && (
              <Typography className="mb-8 font-bold">
                Date du RDV :{" "}
                {new Date(selectedEvent.date).toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            )}
            {selectedEvent && selectedEvent.observations && (
              <Typography className="mb-8">
                Observations : {selectedEvent.observations}
              </Typography>
            )}
            <Typography className="mb-8">
              Nom du client : {dialogAddress.lastname}
            </Typography>
            <Typography className="mb-8">
              N° de Téléphone : {dialogAddress.phone}
            </Typography>
            <Typography className="mb-8">
              Adresse : {dialogAddress.housenumber}{" "}
              {complements[dialogAddress.complement]} {dialogAddress.label}{" "}
            </Typography>
            {selectedEvent && (
              <>
                <Typography className="mb-8">
                  Prospecteur : {selectedEvent.prospector.firstname}{" "}
                  {selectedEvent.prospector.lastname.toUpperCase()}
                </Typography>
                <Typography className="mb-8">
                  Commercial : {selectedEvent.commercial.firstname}{" "}
                  {selectedEvent.commercial.lastname.toUpperCase()}
                </Typography>
              </>
            )}
            {selectedEvent && selectedEvent.sale > 0 && (
              <Typography className="mb-8 font-bold text-orange">
                Vente : {selectedEvent.sale} €
              </Typography>
            )}
            <Typography className="my-8 font-bold">
              Informations supplémentaires :
            </Typography>
            {dialogAddress.observations && (
              <Typography className="mb-4">
                Observations de prospection : {dialogAddress.observations}
              </Typography>
            )}
            {dialogAddress.sourceenergie && (
              <Typography className="mb-4">
                Source d'énergie : {dialogAddress.sourceenergie}
              </Typography>
            )}
            {dialogAddress.habitationtype && (
              <Typography className="mb-4">
                Type d'habitation : {dialogAddress.habitationtype}
              </Typography>
            )}
            {dialogAddress.superficie && (
              <Typography className="mb-4">
                Superficie : {dialogAddress.superficie} m&sup2;
              </Typography>
            )}
            {dialogAddress.factureelec && (
              <Typography className="mb-4">
                Facture électricité : {dialogAddress.factureelec} €
              </Typography>
            )}
            {dialogAddress.facturetotale && (
              <Typography className="mb-4">
                Facture totale : {dialogAddress.facturetotale} €
              </Typography>
            )}
            {dialogAddress.personnesfoyer && (
              <Typography className="mb-4">
                Personnes dans le foyer : {dialogAddress.personnesfoyer}
              </Typography>
            )}
            {dialogAddress.agechauffage && (
              <Typography className="mb-4">
                Age Chauffage : {dialogAddress.agechauffage}
              </Typography>
            )}
            {dialogAddress.productionecs && (
              <Typography className="mb-4">
                Production ECS : {dialogAddress.productionecs}
              </Typography>
            )}
            {dialogAddress.ageecs && (
              <Typography className="mb-4">
                Age ECS : {dialogAddress.ageecs}
              </Typography>
            )}
            {dialogAddress.isolation && (
              <Typography className="mb-4">
                Isolation : {dialogAddress.isolation}
              </Typography>
            )}
            {dialogAddress.activite1 && (
              <Typography className="mb-4">
                Activité Madame : {dialogAddress.activite1}
              </Typography>
            )}
            {dialogAddress.activite2 && (
              <Typography className="mb-4">
                Activité Monsieur : {dialogAddress.activite2}
              </Typography>
            )}
          </>
        )}
        {eventEditable && (
          <ButtonGroup variant="outlined" fullWidth className="my-12">
            <Button
              variant={nextAction === 2 ? "contained" : "outlined"}
              color="primary"
              onClick={() => {
                setNextAction(2);
              }}
            >
              Nouveau RDV
            </Button>
            <Button
              variant={nextAction === 4 ? "contained" : "outlined"}
              color="primary"
              onClick={() => {
                setNextAction(4);
              }}
            >
              Vente
            </Button>
            <Button
              variant={nextAction === 3 ? "contained" : "outlined"}
              color="primary"
              onClick={() => {
                setNextAction(3);
              }}
            >
              Sans suite
            </Button>
            <Button
              variant={nextAction === 5 ? "contained" : "outlined"}
              color="primary"
              onClick={() => {
                setNextAction(5);
              }}
            >
              Modifier RDV
            </Button>
          </ButtonGroup>
        )}
        {(nextAction === 2 || nextAction === 5) && (
          <>
            <Controller
              name="date"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <DateTimePicker
                  label="Choisir une date"
                  ampm={false}
                  ampmInClock={false}
                  value={value}
                  onChange={onChange}
                  renderInput={(_props) => (
                    <TextField
                      label="Start"
                      className="mt-8 mb-16 w-full"
                      {..._props}
                    />
                  )}
                  className="mt-8 mb-16 w-full"
                />
              )}
            />
            //
            
            <Controller
            // set duration instead of end
              name="duration"
              control={control}
              defaultValue={2} // Default duration in hours
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Durée (heures)"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    const newDuration = parseInt(e.target.value, 10);
                    field.onChange(newDuration);
                    if (start)
                    {
                      const newEnd = new Date(start);
                      newEnd.setHours(newEnd.getHours() + newDuration);
                      setValue("end", newEnd);
                    }
                  }}
                />
              )}
              //---//
            />

            //
            <Controller
              name="observations"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mt-8 mb-16"
                  id="observations"
                  label="Observations"
                  type="text"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </>
        )}

        {nextAction === 4 && (
          <>
            <Controller
              name="sale"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mt-8 mb-16"
                  id="sale"
                  label="Prix de vente (€)"
                  type="text"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Controller
              name="observations"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mt-8 mb-16"
                  id="observations"
                  label="Observations"
                  type="text"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </>
        )}
      </DialogContent>

      {eventEditable && (
        <DialogActions className="justify-between px-8 sm:px-16 pb-16">
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            disabled={!isValid && nextAction !== 3}
          >
            Enregistrer
          </Button>
          <IconButton
            onClick={(ev) => {
              ev.stopPropagation();
              dispatch(
                openDialog({
                  children: (
                    <>
                      <DialogTitle id="alert-dialog-title">
                        Supprimer l'évènement ?
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Êtes-vous certain de vouloir supprimer cet évènement ?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => dispatch(closeDialog())}
                          color="primary"
                        >
                          Non
                        </Button>
                        <Button
                          onClick={() => {
                            if (selectedEvent) {
                              dispatch(removeEvent(selectedEvent.id));
                            }
                            dispatch(closeDialog());
                            closeComposeDialog();
                          }}
                          className="text-red"
                          autoFocus
                        >
                          Oui
                        </Button>
                      </DialogActions>
                    </>
                  ),
                })
              );
            }}
            size="large"
          >
            <Icon>delete</Icon>
          </IconButton>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default EventDialog;
