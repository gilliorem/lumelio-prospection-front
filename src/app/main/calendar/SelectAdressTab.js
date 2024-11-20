import {
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  ListItem,
  List,
  Typography,
  FormControl,
  DialogActions,
  Button,
} from "@mui/material";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { useDispatch } from "react-redux";
import { getStreetData } from "../prospection/store/prospectionSlice";

const StreetListItem = ({ street, onClick }) => {
  const { streetName, postcode, city } = street;
  return (
    <ListItem
      dense
      button
      className="h-64 hover:bg-grey-100 cursor-pointer p-20"
      onClick={onClick}
    >
      <Typography fontWeight="medium">
        {streetName}, {postcode}, {city}
      </Typography>
    </ListItem>
  );
};

function SelectAddressTab({ streetsFromAPI, setHouse, house }) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { control, formState, getValues, watch } = methods;
  const { errors } = formState;
  const housenumber = watch("housenumber");
  const complement = watch("complement");
  if (house) {
    return (
      <Typography>
        Adresse Sélectionnée : {house.housenumber} {house.label}
      </Typography>
    );
  }
  return (
    <div>
      {streetsFromAPI ? (
        <List>
          {streetsFromAPI.map((e) => (
            <StreetListItem
              onClick={() => {
                setHouse({
                  displayName: `${e.properties.name}, ${
                    e.properties.postcode
                  }, ${e.properties.city.toUpperCase()}`,
                  id: e.properties.id,
                  label: e.properties.label,
                  name: e.properties.name,
                  city: e.properties.city,
                  postcode: e.properties.postcode,
                  housenumber: Number(housenumber),
                  complement: Number(complement),
                });
                dispatch(
                  getStreetData({
                    id: e.properties.id,
                    label: e.properties.label,
                    name: e.properties.name,
                    city: e.properties.city,
                    postcode: e.properties.postcode,
                    housenumber,
                    complement,
                  })
                );
              }}
              key={e.properties.id}
              street={{
                streetName: e.properties.name,
                postcode: e.properties.postcode,
                city: e.properties.city,
              }}
            />
          ))}
        </List>
      ) : (
        <FormProvider {...methods}>
          <FormControl className="mt-8 mb-16" fullWidth>
            <Controller
              name="street"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mt-8 mb-16"
                  id="street"
                  label="Nom de Rue"
                  type="text"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mt-8 mb-16"
                  id="city"
                  label="Ville"
                  type="text"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Controller
              name="housenumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mt-8 mb-16"
                  id="housenumber"
                  label="Numéro de rue"
                  type="text"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Controller
              name="complement"
              control={control}
              defaultValue={1}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value}
                  className="w-256"
                  displayEmpty
                  native
                >
                  <option value="">Complément</option>
                  <option value={2}>bis</option>
                  <option value={3}>ter</option>
                </Select>
              )}
            />
          </FormControl>
        </FormProvider>
      )}
    </div>
  );
}

export default SelectAddressTab;
