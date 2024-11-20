import History from "@history";
import FusePageSimple from "@fuse/core/FusePageSimple";
import {
  Avatar,
  Button,
  Divider,
  Tab,
  Tabs,
  Typography,
  Icon,
} from "@mui/material";

import { makeStyles } from "@mui/styles";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import clsx from "clsx";

import { Redirect, useHistory, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import { useDeepCompareEffect } from "@fuse/hooks";
import withReducer from "app/store/withReducer";
import { Link } from "react-router-dom";
import {
  getContacts,
  selectContactsById,
  getContact,
} from "./store/contactsSlice";
import Apropos from "../profil/Apropos";
import reducer from "./store";

const useStyles = makeStyles((theme) => ({
  avatar: {
    border: `4px solid ${theme.palette.background.default}`,
  },
  layoutHeader: {},
}));

function UserProfilePage() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = History;
  const params = useParams();
  const contact = useSelector((state) =>
    selectContactsById(state, params.userId)
  );
  useEffect(() => {
    if (!contact) {
      dispatch(getContact(params.userId));
    }
  }, [dispatch, contact, params.userId]);

  const authRole = useSelector((state) => state.auth.user.role);
  // const contact = useSelector(state => selectContactsById(state, params.userId));
  const userId = useSelector((state) => state.auth.user.data.id);

  // Check si role autorise à modifier le profil ou juste le voir
  // Si juste voir, supprimer les infos sensibles (genre rôle, ...etc.)

  // Si auth.uid === route.params.userId, ne pas montrer le retour vers utilisateurs sinon oui
  if (contact) {
    return (
      <FusePageSimple
        classes={{
          header: classes.layoutHeader,
          wrapper: "bg-transparent",
          content: "w-full max-w-2xl mx-auto",
        }}
        header={
          <div className="w-full flex justify-between items-center">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
            >
              <Button
                className="flex items-center mx-16"
                component={Link}
                role="button"
                to="/utilisateurs"
                color="inherit"
                variant="outlined"
              >
                <Icon className="text-20">arrow_back</Icon>
                <span className="hidden sm:flex mx-4 font-medium">
                  Utilisateurs
                </span>
              </Button>
            </motion.div>

            <div className="flex flex-row flex-1 items-center justify-end p-8 -mb-200">
              {(authRole === "admin" || params.userId === userId) && (
                <div className="flex items-center justify-end -mx-4 mt-24 md:mt-0">
                  <Button
                    className="mx-12 py-8"
                    variant="contained"
                    color="secondary"
                    aria-label="Follow"
                    onClick={() =>
                      history.push(`/utilisateurs/modifier/${params.userId}`)
                    }
                  >
                    <Icon className="mr-8">edit</Icon>
                    Modifier le Profil
                  </Button>
                </div>
              )}
            </div>
          </div>
        }
        contentToolbar={
          contact && (
            <div className="w-full px-24 pb-12 flex flex-1">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { delay: 0.1 } }}
                className="flex w-full items-center justify-center"
              >
                {contact.photo ? (
                  <Avatar
                    className={clsx(
                      classes.avatar,
                      "-mt-80  w-160 h-160 m-auto"
                    )}
                    alt="user photo"
                    src={contact.photo}
                  />
                ) : (
                  <Avatar
                    className={clsx(
                      classes.avatar,
                      "-mt-80  w-160 h-160 text-48"
                    )}
                  >
                    {contact.firstname[0]}
                  </Avatar>
                )}
              </motion.div>
            </div>
          )
        }
        content={
          <div className="p-16 sm:p-24">
            <Apropos contact={contact} />
          </div>
        }
      />
    );
  }
  return <FuseLoading />;
}

export default withReducer("contactsApp", reducer)(UserProfilePage);
