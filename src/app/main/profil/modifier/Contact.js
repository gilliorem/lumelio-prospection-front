import FuseLoading from "@fuse/core/FuseLoading";
import FusePageCarded from "@fuse/core/FusePageCarded";
import { useDeepCompareEffect } from "@fuse/hooks";
import { Button, Tab, Tabs, Typography } from "@mui/material";
import withReducer from "app/store/withReducer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import _ from "@lodash";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  updateContact,
  addContact,
  selectContactsById,
} from "../../contacts/store/contactsSlice";
import reducer from "../../contacts/store";
import ProductHeader from "./ContactHeader";
import BasicInfoTab from "./tabs/BasicInfoTab";
import CompanyTab from "./tabs/CompanyTab";
import RoleTab from "./tabs/RoleTab";
import ProfileImageTab from "./tabs/ProfileImageTab";
import PasswordTab from "./tabs/PasswordTab";

// GET /users et GET /users/id

/* Propriétés à envoyer au back end (POST /users) ou (PUT /users/id) ou (DELETE /users/id) */

/* 
firstname
lastname
email
phonenumber
address
postalcode
city
siren
company
password
photo
role
date
*/

function Contact(props) {
  const dispatch = useDispatch();
  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noContact, setNoContact] = useState(false);
  const contact = useSelector((state) => state.auth.user.data);

  /**
   * Form Validation Schema
   */
  const schema = yup.object().shape({
    firstname: yup
      .string()
      .required("Vous devez entrer un prénom")
      .min(2, "Le prénom doit faire au moins 2 charactères"),
    lastname: yup
      .string()
      .required("Vous devez entrer un nom")
      .min(2, "Le nom doit faire au moins 2 charactères"),
    email: yup
      .string()
      .email("Veuillez saisir une adresse e-mail valide")
      .required("Vous devez entrer une adresse e-mail"),
    phonenumber: yup
      .string()
      .required("Veuillez saisir un numéro de téléphone"),

    role: yup.string().required("Veuillez sélectionner un rôle"),
    password:
      routeParams.contactId === "ajouter"
        ? yup
            .string()
            .required("Veuillez saisir un mot de passe")
            .min(6, "Le mot de passe doit faire au moins 6 caractères")
        : yup
            .string()
            .min(6, "Le mot de passe doit faire au moins 6 caractères"),
    confirmpassword:
      routeParams.contactId === "ajouter"
        ? yup
            .string()
            .oneOf(
              [yup.ref("password"), null],
              "Les mots de passe doivent correspondre"
            )
        : yup
            .string()
            .oneOf(
              [yup.ref("password"), null],
              "Les mots de passe doivent correspondre"
            ),
  });
  const methods = useForm({
    mode: "onChange",
    defaultValues: contact
      ? { ...contact }
      : {
          firstname: "",
          lastname: "",
          email: "",
          address: "",
          postalcode: "",
          city: "",
          role: "",
          siren: "",
          company: "",
          password: "",
          contracttype: "",
          confirmpassword: "",
          photo: {},
        },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }

  /**
   * Show Message if the requested products is not exists
   */
  if (noContact) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          Ce collaborateur n'existe pas !
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/contacts"
          color="inherit"
        >
          Retour à la page utilisateurs
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while contact data is loading and form is setted
   */
  // if (_.isEmpty(form) || (contact && routeParams.contactId !== contact.id && routeParams.contactId !== 'ajouter')) {
  // 	return <FuseLoading />;
  // }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        classes={{
          toolbar: "p-0",
          header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
        }}
        header={<ProductHeader />}
        contentToolbar={
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            classes={{ root: "w-full h-64" }}
          >
            <Tab className="h-64" label="Informations" />
            <Tab className="h-64" label="Photo de profil" />
            {/* <Tab className="h-64" label="Rôle et Contrat" /> */}
            {/* <Tab className="h-64" label="Mon Entreprise" /> */}
            <Tab className="h-64" label="Mot de passe" />
          </Tabs>
        }
        content={
          <div className="p-16 sm:p-24 max-w-2xl">
            <div className={tabValue !== 0 ? "hidden" : ""}>
              <BasicInfoTab />
            </div>

            <div className={tabValue !== 1 ? "hidden" : ""}>
              <ProfileImageTab />
            </div>

            <div className={tabValue !== 2 ? "hidden" : ""}>
              <PasswordTab />
            </div>
          </div>
        }
        innerScroll
      />
    </FormProvider>
  );
}

export default withReducer("contactsApp", reducer)(Contact);
