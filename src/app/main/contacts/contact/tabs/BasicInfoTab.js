import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useFormContext, Controller } from "react-hook-form";
import { SketchPicker } from "react-color";
import { FormLabel, Typography } from "@mui/material";

function BasicInfoTab(props) {
  const methods = useFormContext();
  const { control, formState, getValues, setValue, watch } = methods;
  const { errors, isDirty } = formState;

  const handleColorChange = (color) => {
    setValue("color", color.hex);
  };

  return (
    <div>
      <Controller
        name="firstname"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className={errors.firstname ? "mt-8" : "mt-8 mb-20"}
            error={!!errors.firstname}
            required
            helperText={errors?.firstname?.message}
            label="Prénom"
            autoFocus
            id="firstname"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="lastname"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className={errors.lastname ? "mt-8" : "mt-8 mb-20"}
            error={!!errors.lastname}
            required
            helperText={errors?.lastname?.message}
            label="Nom"
            id="lastname"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className={errors.email ? "mt-8" : "mt-8 mb-20"}
            error={!!errors.email}
            helperText={errors?.email?.message}
            id="email"
            label="Adresse e-mail"
            type="text"
            multiline
            variant="outlined"
            fullWidth
            required
          />
        )}
      />
      <Controller
        name="phonenumber"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className={errors.phonenumber ? "mt-8" : "mt-8 mb-20"}
            error={!!errors.phonenumber}
            helperText={errors?.phonenumber?.message}
            id="phonenumber"
            label="N° de Téléphone"
            type="text"
            multiline
            variant="outlined"
            fullWidth
            required
          />
        )}
      />
      <FormLabel className="mt-8">Couleur associée :</FormLabel>
      <div className="flex align-center">
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <SketchPicker
              {...field}
              id="color"
              className={errors.color ? "mt-8" : "mt-8 mb-20"}
              color={field.value}
              onChangeComplete={handleColorChange}
              // onChange={field.onChange}
            />
          )}
        />
        {getValues("color") && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 150,
              height: 30,
              backgroundColor: getValues("color"),
              color: "#FFFFFF",
              borderRadius: 30,
              marginLeft: 20,
            }}
          >
            <Typography>12H - RDV</Typography>
          </div>
        )}
      </div>
    </div>
  );
}

export default BasicInfoTab;
