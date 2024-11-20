import { yupResolver } from "@hookform/resolvers/yup";
import { DateTimePicker } from "@mui/lab";
import { Controller, useForm, FormProvider } from "react-hook-form";

import _ from "@lodash";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import FuseUtils from "@fuse/utils";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ButtonGroup, Tab, Tabs } from "@mui/material";

import * as yup from "yup";
import {
  closeRDVDialog,
  setHouseNumberStatus,
} from "../prospection/store/prospectionSlice";
import HabitatTab from "../prospection/tabs/HabitatTab";
import RDVTab from "../prospection/tabs/RDVTab";
import InfoTab from "../prospection/tabs/InfoTab";
import { getEvents } from "./store/eventsSlice";
import labels from "../prospection/labels";
import ObservationTab from "../prospection/tabs/ObservationTab";
import SelectAddressTab from "./SelectAdressTab";

const initialValues = {};

// 19-11 implement the 1day and 1week duration event




// --remi--

function NewProspectionDialog(props) {
  const dispatch = useDispatch();
  const [houseSelected, setHouseSelected] = useState(null);
  const [housenumber, setHousenumber] = useState(null);
  const [complement, setComplement] = useState(null);
  const prospection = useSelector((state) => state.prospection);
  const [streetsFromAPI, setStreetsFromAPI] = useState(null);
  const [house, setHouse] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  function handleTabChange(event, value) {
    setTabValue(value);
  }

  /**
   * Form Validation Schema
   */
  let schema = yup.object().shape({
    street: yup.string().required("Veuillez saisir un nom de rue"),
    city: yup.string().required("Veuillez saisir une ville"),
    housenumber: yup.string().required("Veuillez saisir un numéro de rue"),
  });

  const schema2 = yup.object().shape({
    lastname: yup.string().required("Veuillez entrer le nom du client"),
    date: yup.date().required("Veuillez sélectionner une date de RDV"),
    phone: yup
      .string()
      .required("Veuillez entrer un numéro de téléphone client"),
  });

  const methods = useForm({
    mode: "onChange",
    initialValues,
    resolver: house ? yupResolver(schema2) : yupResolver(schema),
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
  const selectedStatus = watch("status");

  /**
   * Close Dialog
   */
  function closeDialog() {
    dispatch(closeRDVDialog());
    setTabValue(0);
    setHouseSelected(null);
    setHouse(null);
    setHousenumber(null);
    setComplement(null);
    setStreetsFromAPI(null);
    reset({});
    props.onClose();
    props.resetSelectedDate();
  }

  useEffect(() => {
    if (house) {
      if (prospection.streetData) {
        const { streetData } = prospection;
        if (streetData.numbers) {
          const { numbers } = streetData;
          if (
            numbers.filter(
              (e) =>
                e.housenumber === house.housenumber &&
                e.complement === house.complement &&
                e.geoId === house.id
            ).length > 0
          ) {
            const houseSelect = numbers.filter(
              (e) =>
                e.housenumber === house.housenumber &&
                e.complement === house.complement &&
                e.geoId === house.id
            )[0];
            setHouseSelected(houseSelect);

            reset({
              ...houseSelect,
              status: 2,
              date: props.selectedDate,
            });
            setValue("status", 2);
            if (houseSelect.sourceenergie) {
              setValue("sourceenergie", houseSelect.sourceenergie);
            }
          } else {
            reset({ date: props.selectedDate, status: 2 });
          }
        }
      }
    }
  }, [prospection, house]);

  useEffect(() => {
    if (house && selectedStatus !== 2) {
      schema = yup.object().shape({
        lastname: yup.string().required("Veuillez entrer le nom du client"),
        date: yup.date().required("Veuillez sélectionner une date de RDV"),
        status: yup.string().notRequired(),
        facturetotale: yup
          .number()
          .typeError("Veuillez saisir un nombre")
          .notRequired(),
        factureelec: yup
          .number()
          .typeError("Veuillez saisir un nombre")
          .notRequired(),
        superficie: yup
          .number()
          .typeError("Veuillez saisir un nombre")
          .notRequired(),
        agechauffage: yup
          .number()
          .typeError("Veuillez saisir un nombre")
          .notRequired(),
        ageecs: yup
          .number()
          .typeError("Veuillez saisir un nombre")
          .notRequired(),
        personnesfoyer: yup
          .number()
          .typeError("Veuillez saisir un nombre")
          .notRequired(),
      });
    }
    if (house && selectedStatus === 2) {
      schema = yup.object().shape({
        lastname: yup.string().required("Veuillez entrer le nom du client"),
        date: yup.date().required("Veuillez sélectionner une date de RDV"),
        phone: yup
          .string()
          .required("Veuillez entrer un numéro de téléphone client"),
      });
    }
  }, [selectedStatus, houseSelected]);

  /**
   * Form Submit
   */
  const onSubmit = async (ev) => {
    if (!house) {
      ev.preventDefault();
      const values = getValues();
      // setStreetsLoading(true);
      const res = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${values.street}+${values.city}&type=street`,
        { method: "GET" }
      );
      const data = await res.json();
      setStreetsFromAPI(data.features);
      setHousenumber(Number(values.housenumber));
      setComplement(Number(values.complement));
      //   setStreetsLoading(false);
      // };
    } else {
      const clearValues = (v) => {
        return Object.keys(v).forEach(
          (key) => (v[key] === "" || v[key] === undefined) && delete v[key]
        );
      };
      const toIntegerValues = (v) => {
        return Object.keys(v).forEach((e) => {
          if (
            e === "superficie" ||
            e === "ageecs" ||
            e === "agechauffage" ||
            e === "personnesfoyer" ||
            e === "factureelec" ||
            e === "facturetotale"
          ) {
            v[e] = Number(v[e]);
          }
        });
      };
      const val = getValues();
      clearValues(val);
      toIntegerValues(val);
      const { id, street, ...houseData } = house;
      dispatch(
        setHouseNumberStatus({
          ...houseData,
          geoId: id,
          ...val,
          status: Number(val.status),
        })
      );
      closeDialog();
      // props.onReset => props.onClose()
      props.onClose();
      reset();
    }
  };

  useEffect(() => {
    if (house) {
      setTabValue(1);
    }
  }, [house]);

  return (
    <Dialog
      open={props.open}
      onClose={closeDialog}
      onBackdropClick={closeDialog}
      fullWidth
      maxWidth="lg"
      component="form"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full items-center justify-between">
          <Typography variant="subtitle1" color="inherit">
            {props.streetsFromAPI
              ? "Sélectionner une rue"
              : "Créer un Rendez-Vous"}
          </Typography>
          <IconButton onClick={closeDialog}>
            <Icon className="text-red">close</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <FormProvider {...methods}>
        <DialogContent>
          <div>
            <div className="px-16 sm:px-24 pt-16">
              <FormControl className="mt-8 mb-16" fullWidth>
                {/* <div className={tabValue !== 0 ? "hidden" : ""}>
                  <StatusTab />
                </div> */}
                <div className={tabValue !== 0 ? "hidden" : ""}>
                  <SelectAddressTab
                    streetsFromAPI={streetsFromAPI}
                    setHouse={setHouse}
                    house={house}
                    housenumber={housenumber}
                    complement={complement}
                  />
                </div>
                <div className={tabValue !== 1 ? "hidden" : ""}>
                  <HabitatTab rdvOnly={true} />
                </div>

                <div className={tabValue !== 2 ? "hidden" : ""}>
                  <InfoTab />
                </div>
                <div className={tabValue !== 3 ? "hidden" : ""}>
                  <ObservationTab />
                </div>
                {/* eslint-disable-next-line eqeqeq */}
                {selectedStatus == 2 && (
                  <div className={tabValue !== 4 ? "hidden" : "pt-32"}>
                    <RDVTab />
                  </div>
                )}
              </FormControl>
            </div>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              classes={{ root: "pl-24 w-full mb-24" }}
            >
              <Tab className="h-64" label="Adresse" />
              {house && (
                <Tab className="h-64" label="Informations Habitation" />
              )}
              {house && (
                <Tab className="h-64" label="Informations Personnelles" />
              )}
              {house && <Tab className="h-64" label="Observations" />}
              {/* eslint-disable-next-line eqeqeq */}
              {house && selectedStatus == 2 && (
                <Tab className="h-64" label="Rendez-vous" />
              )}
            </Tabs>
          </div>
        </DialogContent>
        <DialogActions className="justify-between px-8 py-16">
          <div className="px-16">
            <Button
              // type="submit"
              variant="contained"
              color="error"
              onClick={closeDialog}
            >
              Annuler
            </Button>
          </div>
          {/* eslint-disable-next-line eqeqeq */}
          {house && selectedStatus && selectedStatus == 2 && (
            <div className="px-16">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={!isValid}
                onClick={onSubmit}
              >
                Prendre RDV
              </Button>
            </div>
          )}
          {!house && (
            <div className="px-16">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={!isValid}
                onClick={onSubmit}
              >
                Suivant
              </Button>
            </div>
          )}
          {/* eslint-disable-next-line eqeqeq */}
          {selectedStatus && selectedStatus != 2 && (
            <div className="px-16">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                onClick={onSubmit}
              >
                Enregistrer
              </Button>
            </div>
          )}
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

export default NewProspectionDialog;
