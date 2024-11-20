import { DateTimePicker } from "@mui/lab";
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
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

function RoleTab(props) {
  const methods = useFormContext();
  const { control, formState, watch } = methods;
  const { errors } = formState;

  const selectedStatus = watch("status");

  return (
    <div>
      {/* A remplacer avec un dropdown */}
      <Controller
        name="lastname"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            id="lastname"
            className="mb-16"
            label="Nom du client"
            error={!!errors.lastname}
            helperText={errors?.lastname?.message}
            // eslint-disable-next-line eqeqeq
            required={selectedStatus == 2}
            variant="outlined"
          />
        )}
      />
      <Controller
        name="phone"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            id="phone"
            fullWidth
            className="mb-16"
            label="N° de Téléphone (portable)"
            error={!!errors.phonenumber}
            helperText={errors?.phonenumber?.message}
            // eslint-disable-next-line eqeqeq
            required={selectedStatus == 2}
            variant="outlined"
          />
        )}
      />
      <Controller
        name="email"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            {...field}
            id="email"
            className="mb-16"
            label="Adresse e-mail"
            error={!!errors.email}
            helperText={errors?.email?.message}
            variant="outlined"
          />
        )}
      />

      <Controller
        name="activite1"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            className="mb-16"
            id="activite1"
            label="Activité Madame"
            error={!!errors.activite1}
            helperText={errors?.activite1?.message}
            variant="outlined"
          />
        )}
      />

      <Controller
        name="activite2"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            id="activite2"
            className="mb-16"
            label="Activité Monsieur"
            error={!!errors.activite2}
            helperText={errors?.activite2?.message}
            variant="outlined"
          />
        )}
      />
    </div>
  );
}

export default RoleTab;
