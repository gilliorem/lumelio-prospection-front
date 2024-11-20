import {
  Button,
  Icon,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContentText,
  DialogContent,
} from "@mui/material";

import { useTheme } from "@mui/styles";

import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useLocation } from "react-router-dom";
import history from "@history";
import _ from "@lodash";
import { closeDialog, openDialog } from "app/store/fuse/dialogSlice";
import { showMessage } from "app/store/fuse/messageSlice";
import {
  addContact,
  updateContact,
  removeContact,
} from "../store/contactsSlice";

function ProductHeader(props) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const image = watch("image");
  const firstname = watch("firstname");
  const lastname = watch("lastname");
  const theme = useTheme();
  const location = useLocation();
  const routeParams = useParams();
  const authRole = useSelector((state) => state.auth.user.role);

  function handleSaveProduct() {
    if (getValues().password !== getValues().confirmpassword) {
      dispatch(
        showMessage({
          message: "Les mots de passe doivent correspondre",
          variant: "error", // success error info warning null,
          autoHideDuration: 3000, // ms
          anchorOrigin: {
            vertical: "bottom", // top bottom
            horizontal: "right", // left center right
          },
        })
      );
    } else {
      if (location.pathname === "/utilisateurs/ajouter") {
        dispatch(addContact(getValues()));
      } else {
        dispatch(updateContact(getValues()));
      }

      history.push("/utilisateurs");
    }
  }

  function handleRemoveContact() {
    dispatch(removeContact(routeParams.userId));

    history.push("/utilisateurs");
  }

  return (
    <div className="flex flex-1 w-full items-center justify-between">
      <div className="flex flex-col items-start max-w-full min-w-0">
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
            <Icon className="text-20">
              {theme.direction === "ltr" ? "arrow_back" : "arrow_forward"}
            </Icon>
            <span className="hidden sm:flex mx-4 font-medium">
              Utilisateurs
            </span>
          </Typography>
        </motion.div>

        <div className="flex items-center max-w-full">
          <motion.div
            className="hidden sm:flex"
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.3 } }}
          >
            {image && image.url ? (
              <img
                className="w-32 sm:w-48 rounded"
                src={image.url}
                alt="profil"
              />
            ) : (
              <img
                className="w-32 sm:w-48 rounded"
                src="assets/images/ecommerce/product-image-placeholder.png"
                alt="profil"
              />
            )}
          </motion.div>
          <div className="flex flex-col min-w-0 mx-8 sm:mc-16">
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                {firstname && lastname
                  ? `${firstname} ${lastname.toUpperCase()}`
                  : "Nouvel utilisateur"}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Informations
              </Typography>
            </motion.div>
          </div>
        </div>
      </div>
      <motion.div
        className="flex"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
      >
        {authRole === "admin" && routeParams.contactId !== "ajouter" && (
          <Button
            className="whitespace-nowrap mx-4"
            variant="contained"
            color="secondary"
            onClick={() => {
              dispatch(
                openDialog({
                  children: (
                    <>
                      <DialogTitle id="alert-dialog-title">
                        Supprimer l'utilisateur ?
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Êtes-vous certain de vouloir supprimer cet utilisateur
                          ?
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
                            handleRemoveContact();
                            dispatch(closeDialog());
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
            startIcon={<Icon className="hidden sm:flex">delete</Icon>}
          >
            Supprimer
          </Button>
        )}
        <Button
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          disabled={
            _.isEmpty(dirtyFields) ||
            !isValid ||
            getValues().password !== getValues().confirmpassword
          }
          onClick={handleSaveProduct}
        >
          Enregistrer
        </Button>
      </motion.div>
    </div>
  );
}

export default ProductHeader;
