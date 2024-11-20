import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";

function CompanyTab(props) {
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;

  return (
    <div>
      <Controller
        name="siren"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className={errors.siren ? "mt-8" : "mt-8 mb-20"}
            required
            label="N° SIREN"
            autoFocus
            id="siren"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="company"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className={errors.company ? "mt-8" : "mt-8 mb-20"}
            required
            label="Nom de l'entreprise"
            id="company"
            variant="outlined"
            fullWidth
          />
        )}
      />
    </div>
  );
}

export default CompanyTab;
