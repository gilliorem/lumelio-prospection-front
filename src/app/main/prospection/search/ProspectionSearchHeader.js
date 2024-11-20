import Hidden from "@mui/material/Hidden";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import { ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectMainTheme } from "app/store/fuse/settingsSlice";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField } from "@mui/material";
import axios from "axios";

function ProspectionSearchHeader(props) {
  const dispatch = useDispatch();

  const mainTheme = useSelector(selectMainTheme);
  const authRole = useSelector((state) => state.auth.user.role);
  const schema = yup.object().shape({
    street: yup.string().required("Requis"),
    city: yup.string().required("Requis"),
  });
  const { setStreetsFromAPI, setStreetDialogOpen } = props;
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      street: "",
      city: "",
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState, getValues } = methods;
  const { errors } = formState;
  const form = watch();

  const getStreetFromAPI = async () => {
    const values = getValues();
    let apiReq = `?q=${values.street}+${values.city}&type=street`;
    if (values.postCode) {
      apiReq = `?q=${values.street}+${values.city}&postcode=${values.postcode}&type=street`;
    }
    setStreetDialogOpen(true);
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/${apiReq}`,
      { method: "GET" }
    );
    const data = await res.json();
    setStreetsFromAPI(data.features);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-1 w-full items-center justify-between">
        <div className="flex items-center">
          <Icon
            component={motion.span}
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.2 } }}
            className="text-24 md:text-32"
          >
            edit_location
          </Icon>
          <Typography
            component={motion.span}
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
            delay={300}
            className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
          >
            Prospection
          </Typography>
        </div>

        <div className="flex flex-1 items-center justify-center px-12">
          <ThemeProvider theme={mainTheme}>
            <FormProvider {...methods}>
              <form
                className="flex flex-1 items-center justify-center px-12"
                onSubmit={(e) => {
                  e.preventDefault();
                  getStreetFromAPI();
                }}
              >
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Paper
                      component={motion.div}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                      className="flex items-center max-w-256 px-8 py-4 rounded-16 shadow mx-12"
                    >
                      <Icon color="action">location_city</Icon>

                      <Input
                        {...field}
                        placeholder="Ville *"
                        // helperText={errors?.city?.message}
                        className="flex flex-1 mx-8"
                        disableUnderline
                        fullWidth
                        error={!!errors.city}
                        id="city"
                        variant="standard"
                        required
                        //   value={searchText}
                        inputProps={{
                          "aria-label": "Search",
                        }}
                        //   onChange={(ev) => dispatch(setContactsSearchText(ev))}
                      />
                    </Paper>
                  )}
                />
                <Controller
                  name="street"
                  control={control}
                  render={({ field }) => (
                    <Paper
                      component={motion.div}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                      className="flex items-center max-w-256 px-8 py-4 rounded-16 shadow mx-12"
                    >
                      <Icon color="action">edit_road</Icon>

                      <Input
                        {...field}
                        placeholder="Nom de Rue *"
                        // helperText={errors?.street?.message}
                        className="flex flex-1 mx-8"
                        disableUnderline
                        fullWidth
                        error={!!errors.street}
                        id="street"
                        variant="standard"
                        required
                        //   value={searchText}
                        inputProps={{
                          "aria-label": "Search",
                        }}
                        //   onChange={(ev) => dispatch(setContactsSearchText(ev))}
                      />
                    </Paper>
                  )}
                />

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                >
                  <Button
                    type="submit"
                    className="whitespace-nowrap ml-8"
                    variant="contained"
                    color="secondary"
                  >
                    <span className="flex">Rechercher</span>
                  </Button>
                </motion.div>
              </form>
            </FormProvider>
          </ThemeProvider>
        </div>
      </div>
      {props.street && (
        <Typography className="pb-24 text-15">
          {props.street.displayName}
        </Typography>
      )}
    </div>
  );
}

export default ProspectionSearchHeader;
