import FusePageSimple from "@fuse/core/FusePageSimple";
import { Avatar, Button, Icon, Typography } from "@mui/material";

import { makeStyles } from "@mui/styles";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import clsx from "clsx";
import history from "@history";

import { Redirect, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";

import withReducer from "app/store/withReducer";
import { Link } from "react-router-dom";
import {
  getContacts,
  selectContactsById,
} from "../contacts/store/contactsSlice";
import Apropos from "./Apropos";
import reducer from "../contacts/store";

const useStyles = makeStyles((theme) => ({
  avatar: {
    border: `4px solid ${theme.palette.background.default}`,
  },
  layoutHeader: {},
}));

function ProfilePage() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const params = useParams();
  const authRole = useSelector((state) => state.auth.user.role);
  const [firstLetter, setFirstLetter] = useState("");
  const contact = useSelector((state) => state.auth.user.data);

  useEffect(() => {
    if (firstLetter === "") {
      setFirstLetter(contact.firstname[0]);
    }
  }, [contact, firstLetter]);

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
          toolbar:
            "w-full max-w-2xl mx-auto relative flex flex-col min-h-auto h-auto items-start",
        }}
        header={
          params.userId === contact.id ? (
            <div className="flex flex-col justify-end px-20 w-full max-w-full min-w-full pb-12">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
              >
                <Typography
                  className="flex items-center sm:mb-12"
                  component={Link}
                  role="button"
                  to="/utilisateurs"
                  color="inherit"
                >
                  <Icon className="text-20">arrow_back</Icon>
                  <span className="hidden sm:flex mx-4 font-medium">
                    Utilisateurs
                  </span>
                </Typography>
              </motion.div>

              <div className="flex flex-row flex-1 items-center justify-between p-8">
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                />

                {(authRole === "admin" ||
                  Number(params.userId) === contact.id) && (
                  <div className="flex items-center justify-end -mx-4 mt-24 md:mt-0">
                    <Button
                      className="mx-12 py-8"
                      variant="contained"
                      color="secondary"
                      aria-label="Follow"
                      onClick={() => history.push("/modifier-profil")}
                    >
                      <Icon className="mr-8">edit</Icon>
                      Modifier le Profil
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-row flex-1 items-center justify-between p-8">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              />

              <div className="flex items-center justify-end -mx-4 mt-24 md:mt-0">
                <Button
                  className="mx-12 py-8"
                  variant="contained"
                  color="secondary"
                  aria-label="Follow"
                  onClick={() => history.push("/modifier-profil")}
                >
                  <Icon className="mr-8">edit</Icon>
                  Modifier le Profil
                </Button>
              </div>
            </div>
          )
        }
        contentToolbar={
          <div className="w-full px-24 pb-12 flex flex-1">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: { delay: 0.1 } }}
              className="flex w-full items-center justify-center"
            >
              {contact.photo ? (
                <Avatar
                  className={clsx(classes.avatar, "-mt-80  w-160 h-160 m-auto")}
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

export default withReducer("contactsApp", reducer)(ProfilePage);
