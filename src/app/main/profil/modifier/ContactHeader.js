import { Button, Icon, Typography } from "@mui/material";

import { useTheme } from "@mui/styles";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import history from "@history";
import _ from "@lodash";
import { showMessage } from "app/store/fuse/messageSlice";
import { updateUserData } from "../../../auth/store/userSlice";

function ProductHeader(props) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const photo = watch("photo");
  const firstname = watch("firstname");
  const lastname = watch("lastname");
  const theme = useTheme();
  const routeParams = useParams();
  const userId = useSelector((state) => state.auth.user.data.id);
  const authRole = useSelector((state) => state.auth.user.role);

  function handleSaveProduct() {
    if (getValues().password !== getValues().confirmpassword) {
      dispatch(
        showMessage({
          message: "Les mots de passe doivent correspondre",
          variant: "warning", // success error info warning null,
          autoHideDuration: 3000, // ms
          anchorOrigin: {
            vertical: "bottom", // top bottom
            horizontal: "right", // left center right
          },
        })
      );
    } else {
      dispatch(updateUserData(getValues()));
      history.push(`/profil`);
    }
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
            to="/profil"
            color="inherit"
          >
            <Icon className="text-20">
              {theme.direction === "ltr" ? "arrow_back" : "arrow_forward"}
            </Icon>
            <span className="hidden sm:flex mx-4 font-medium">Profil</span>
          </Typography>
        </motion.div>

        <div className="flex items-center max-w-full">
          <motion.div
            className="hidden sm:flex"
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.3 } }}
          >
            {photo ? (
              <img
                className="w-32 sm:w-48 rounded"
                src={photo}
                alt={firstname + lastname}
              />
            ) : (
              <img
                className="w-32 sm:w-48 rounded"
                src="assets/images/ecommerce/product-image-placeholder.png"
                alt={firstname + lastname}
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
