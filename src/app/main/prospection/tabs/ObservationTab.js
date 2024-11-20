import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

function ObservationTab(props) {
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;
  return (
    <Controller
      name="observations"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <TextField
          {...field}
          label="Notes / Observations"
          multiline
          fullWidth
          rows="6"
          variant="outlined"
        />
      )}
    />
  );
}

export default ObservationTab;
