import {
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

function RoleTab(props) {
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;

  return (
    <div>
      {/* A remplacer avec un dropdown */}

      <Controller
        name="role"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <>
            <InputLabel id="select-label">Rôle *</InputLabel>
            <Select
              {...field}
              error={!!errors.role}
              labelId="select-label"
              className="mt-8 mb-16"
              id="role"
              variant="outlined"
              value={field.value}
              onChange={field.onChange}
              fullWidth
              required
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="commercial">Commercial</MenuItem>
              <MenuItem value="prospector">Prospecteur</MenuItem>
            </Select>
            {errors.role && (
              <FormHelperText>{errors.role.message}</FormHelperText>
            )}
          </>
        )}
      />
      {/* <Controller
        name="contracttype"
        control={control}
        render={({ field }) => (
          <>
            <InputLabel id="select-label">Contrat *</InputLabel>
            <Select
              {...field}
              labelId="select-label"
              className="mt-8 mb-16"
              id="contracttype"
              variant="outlined"
              value={field.value}
              error={!!errors.contracttype}
              onChange={field.onChange}
              fullWidth
              required
            >
              <MenuItem value="contrat 1">Contrat 1</MenuItem>
              <MenuItem value="contrat 2">Contrat 2</MenuItem>
              <MenuItem value="contrat 3">Contrat 3</MenuItem>
            </Select>
            {errors.contracttype && (
              <FormHelperText>{errors.contracttype.message}</FormHelperText>
            )}
          </>
        )}
      /> */}
    </div>
  );
}

export default RoleTab;
