import { styled, darken } from "@mui/material/styles";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Icon,
  Card,
  CardContent,
  Typography,
  Slide,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { forwardRef, useState } from "react";
import { Link } from "react-router-dom";
import { showMessage } from "app/store/fuse/messageSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import JWTLoginTab from "./tabs/JWTLoginTab";

const Root = styled("div")(({ theme }) => ({
  background: `linear-gradient(to right, ${
    theme.palette.primary.dark
  } 0%, ${darken(theme.palette.primary.dark, 0.5)} 100%)`,
  color: theme.palette.primary.contrastText,

  "& .Login-leftSection": {},

  "& .Login-rightSection": {
    background: `linear-gradient(to right, ${
      theme.palette.primary.dark
    } 0%, ${darken(theme.palette.primary.dark, 0.5)} 100%)`,
    color: theme.palette.primary.contrastText,
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Login() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [dialog, setDialog] = useState(false);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  function handleOpenDialog(dialogData) {
    setDialog(true);
  }

  const handleCloseDialog = () => {
    // AXIOS to API
    setDialog(false);
  };

  const handleResetPassword = async (e) => {
    // AXIOS to API
    const response = await axios.post("/users/password", { email: e });
    if (response.status === 200 || response.status === 201) {
      dispatch(
        showMessage({
          message: "E-mail de réinitialisation du mot de passe envoyé",
          variant: "success", // success error info warning null
          autoHideDuration: 3000, // ms
          anchorOrigin: {
            vertical: "bottom", // top bottom
            horizontal: "right", // left center right
          },
        })
      );
    } else {
      dispatch(
        showMessage({
          message: "Problème lors de la réinitialisation du mot de passe",
          variant: "error", // success error info warning null
          autoHideDuration: 3000, // ms
          anchorOrigin: {
            vertical: "bottom", // top bottom
            horizontal: "right", // left center right
          },
        })
      );
    }
    handleCloseDialog();
  };

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }

  return (
    <Root className="flex flex-col flex-auto items-center justify-center shrink-0 p-16 md:p-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex w-full max-w-400 md:max-w-3xl rounded-20 shadow-2xl overflow-hidden"
      >
        <Card
          className="Login-leftSection flex flex-col w-full max-w-sm items-center justify-center shadow-0"
          square
        >
          <CardContent className="flex flex-col items-center justify-center w-full py-96 max-w-320">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
            >
              <div className="flex items-center mb-48">
                <div className="border-l-1 mr-4 w-1 h-40" />
                <div>
                  <Typography
                    className="text-24 font-semibold logo-text"
                    color="inherit"
                  >
                    LUMÉLIO
                  </Typography>
                  <Typography
                    className="text-16 tracking-widest -mt-8 font-700"
                    color="textSecondary"
                  >
                    WEB APP
                  </Typography>
                </div>
              </div>
            </motion.div>

            <JWTLoginTab openForgot={handleOpenDialog} />
          </CardContent>
        </Card>

        <div className="Login-rightSection hidden md:flex flex-1 items-center justify-center p-64">
          <div className="max-w-320">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            >
              <Typography
                variant="h3"
                color="inherit"
                className="font-semibold leading-tight"
              >
                Bienvenue <br />
                sur <br /> LUMÉLIO
              </Typography>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <Dialog
        open={dialog}
        onClose={handleCloseDialog}
        aria-labelledby="knowledge-base-document"
        TransitionComponent={Transition}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Typography className="pt-8 font-medium text-24">
            Réinitialiser le mot de passe
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography color="textPrimary" className="text-15 mb-16">
            Veuillez saisir votre adresse e-mail pour recevoir votre nouveau mot
            de passe.
          </Typography>
          <TextField
            placeholder="Adresse E-mail"
            variant="outlined"
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
          />
          <Typography className="text-red text-12 mt-8 italic flex items-center">
            <Icon className="mr-8">warning</Icon>
            Pensez à regarder dans vos spams
          </Typography>
        </DialogContent>
        <DialogActions className="p-16">
          <Button
            onClick={() => handleResetPassword(email)}
            color="primary"
            variant="contained"
          >
            RÉINITIALISER
          </Button>
        </DialogActions>
      </Dialog>
    </Root>
  );
}

export default Login;
