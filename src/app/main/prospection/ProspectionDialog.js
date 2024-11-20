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

import { Tab, Tabs } from "@mui/material";

import * as yup from "yup";
import { closeRDVDialog, setHouseNumberStatus } from "./store/prospectionSlice";
import HabitatTab from "./tabs/HabitatTab";
import RDVTab from "./tabs/RDVTab";
import InfoTab from "./tabs/InfoTab";
import { getEvents } from "../calendar/store/eventsSlice";
import labels from "./labels";
import ObservationTab from "./tabs/ObservationTab";

const initialValues = {
  status: "",
  habitationtype: "",
  ageecs: "",
  activite1: "",
  activite2: "",
  lastname: "",
  phonenumber: "",
  email: "",
  sourceenergie: "",
  superficie: "",
  facturetotale: "",
  factureelec: "",
  personnesfoyer: "",
  agechauffage: "",
  productionecs: "",
  isolation: "",
  observations: "",
  date: "",
};

function ProspectionDialog(props) {
  const dispatch = useDispatch();
  const todoDialog = useSelector((state) => state.prospection.RDVDialog);
  const streetData = useSelector((state) => state.prospection.streetData);
  const [houseSelected, setHouseSelected] = useState({});

  /**
   * Form Validation Schema
   */
  let schema = yup.object().shape({
    lastname: yup.string().required("Veuillez entrer le nom du client"),
    date: yup.date().required("Veuillez sélectionner une date de RDV"),
    phone: yup
      .string()
      .required("Veuillez entrer un numéro de téléphone client"),
    status: yup
      .number()
      .required("Veuillez sélectionner un statut de prospection")
      .min(2, "Veuillez sélectionner un statut de prospection"),
    // facturetotale: yup
    //   .number()
    //   .typeError("Veuillez saisir un nombre")
    //   .notRequired(),
    // factureelec: yup
    //   .number()
    //   .typeError("Veuillez saisir un nombre")
    //   .notRequired(),
    // superficie: yup
    //   .number()
    //   .typeError("Veuillez saisir un nombre")
    //   .notRequired(),
    // agechauffage: yup
    //   .number()
    //   .typeError("Veuillez saisir un nombre")
    //   .notRequired(),
    // ageecs: yup.number().typeError("Veuillez saisir un nombre").notRequired(),
    // personnesfoyer: yup
    //   .number()
    //   .typeError("Veuillez saisir un nombre")
    //   .notRequired(),
  });

  useEffect(() => {
    if (streetData) {
      const { numbers } = streetData;
      const { data } = todoDialog;
      if (numbers && numbers.length > 0 && data) {
        setHouseSelected(numbers.filter((e) => e.id === todoDialog.data.id)[0]);
        setValue(
          "sourceenergie",
          numbers.filter((e) => e.id === todoDialog.data.id)[0].sourceenergie
        );
      }
    }
  }, [todoDialog.data, streetData]);

  const methods = useForm({
    mode: "onChange",
    initialValues,
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
  const selectedStatus = watch("status");

  useEffect(() => {
    if (selectedStatus !== 2) {
      schema = yup.object().shape({
        lastname: yup.string().required("Veuillez entrer le nom du client"),
        date: yup.date().required("Veuillez sélectionner une date de RDV"),
        status: yup
          .number()
          .required("Veuillez sélectionner un statut de prospection")
          .min(2, "Veuillez sélectionner un statut de prospection"),
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
  }, [selectedStatus]);

  useEffect(() => {
    dispatch(getEvents());
    if (houseSelected) {
      Object.keys(houseSelected).forEach((e) => {
        setValue(e, houseSelected[e]);
      });
    }
  }, [houseSelected, dispatch]);

  /**
   * Form Submit
   */
  function onSubmit(data) {
    // TODO : Nouveau RDV

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
    dispatch(
      setHouseNumberStatus({
        ...todoDialog.data,
        ...val,
        status: Number(val.status),
      })
    );
    dispatch(closeRDVDialog());
    reset();
  }

  const [tabValue, setTabValue] = useState(0);
  function handleTabChange(event, value) {
    setTabValue(value);
  }

  /**
   * Close Dialog
   */
  function closeDialog() {
    dispatch(closeRDVDialog());
    setTabValue(0);
    setHouseSelected({});
    reset();
  }

  return (
    <Dialog
      {...todoDialog.props}
      onClose={closeDialog}
      fullWidth
      maxWidth="lg"
      className="h-full"
      scroll="paper"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full items-center justify-between">
          <Typography variant="subtitle1" color="inherit">
            Formulaire de prospection
          </Typography>
          <IconButton onClick={closeDialog}>
            <Icon className="text-white">close</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <FormProvider {...methods}>
        <DialogContent classes={{ root: "p-0" }}>
          <div>
            <div className="px-16 sm:px-24 pt-16">
              <FormControl className="mt-8 mb-16" fullWidth>
                {/* <div className={tabValue !== 0 ? "hidden" : ""}>
                  <StatusTab />
                </div> */}
                <div className={tabValue !== 0 ? "hidden" : ""}>
                  <HabitatTab />
                </div>

                <div className={tabValue !== 1 ? "hidden" : ""}>
                  <InfoTab />
                </div>
                <div className={tabValue !== 2 ? "hidden" : ""}>
                  <ObservationTab />
                </div>
                {/* eslint-disable-next-line eqeqeq */}
                {selectedStatus == 2 && (
                  <div className={tabValue !== 3 ? "hidden" : "pt-32"}>
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
              {/* <Tab className="h-64" label="Statut de prospection" /> */}
              <Tab className="h-64" label="Informations Habitation" />
              <Tab className="h-64" label="Informations Personnelles" />
              <Tab className="h-64" label="Observations" />
              {/* eslint-disable-next-line eqeqeq */}
              {selectedStatus == 2 && (
                <Tab className="h-64" label="Rendez-vous" />
              )}
            </Tabs>
          </div>
        </DialogContent>

        <DialogActions className="justify-between px-8 py-16">
          <div className="px-16">
            <Button
              type="submit"
              variant="contained"
              color="error"
              onClick={closeDialog}
            >
              Annuler
            </Button>
          </div>
          {/* eslint-disable-next-line eqeqeq */}
          {selectedStatus && selectedStatus == 2 && (
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
          {/* eslint-disable-next-line eqeqeq */}
          {selectedStatus && selectedStatus != 2 && (
            <div className="px-16">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={selectedStatus === 1}
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

export default ProspectionDialog;
