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
  const { control, formState } = methods;
  const { errors } = formState;

  return (
    <div>
      <Controller
        name="sourceenergie"
        // defaultValue=""
        control={control}
        render={({ field }) => (
          <>
            <InputLabel required={false} id="select-label">
              Source d'énergie pour le chauffage
            </InputLabel>
            <Select
              {...field}
              error={!!errors.sourceenergie}
              labelId="select-label"
              className="mt-8 mb-16"
              id="sourceenergie"
              variant="outlined"
              value={field.value}
              onChange={field.onChange}
              fullWidth
            >
              <MenuItem value="gaz">Gaz</MenuItem>
              <MenuItem value="electricite">Électricité</MenuItem>
              <MenuItem value="bois">Bois</MenuItem>
              <MenuItem value="fioul">Fioul</MenuItem>
              <MenuItem value="propane">Propane</MenuItem>
              <MenuItem value="charbon">Charbon</MenuItem>
              <MenuItem value="poelebois">Poële à Bois</MenuItem>
              <MenuItem value="poelegranules">Poële à Granulés</MenuItem>
            </Select>
            {errors.sourceenergie && (
              <FormHelperText className="text-red">
                {errors.sourceenergie.message}
              </FormHelperText>
            )}
          </>
        )}
      />
      <Controller
        name="habitationtype"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <>
            <FormLabel required={false} component="legend">
              Type d'habitation
            </FormLabel>
            <RadioGroup
              id="habitationtype"
              name="radio-buttons-group"
              value={field.value ?? ""}
              onChange={field.onChange}
            >
              <FormControlLabel
                value="individuelle"
                control={<Radio />}
                label="Maison Individuelle"
              />
              <FormControlLabel
                value="mitoyenne"
                control={<Radio />}
                label="Maison Mitoyenne"
              />
            </RadioGroup>
            {errors.habitationtype && (
              <FormHelperText className="text-red">
                {errors.habitationtype.message}
              </FormHelperText>
            )}
          </>
        )}
      />
      <Controller
        name="superficie"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <>
            <TextField
              {...field}
              className={errors.superficie ? "mt-8" : "mt-8 mb-20"}
              error={!!errors.superficie}
              label="Superficie (m&sup2;)"
              id="superficie"
              variant="outlined"
              type="number"
              fullWidth
            />
            {errors.superficie && (
              <FormHelperText className="text-red mb-8">
                {errors.superficie.message}
              </FormHelperText>
            )}
          </>
        )}
      />
      <Controller
        name="factureelec"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <div className="mb-16">
            <TextField
              {...field}
              id="factureelec"
              error={!!errors.factureelec}
              fullWidth
              type="number"
              label="Montant facture d'électricité"
              variant="outlined"
            />
            {errors.factureelec && (
              <FormHelperText className="text-red mb-8">
                {errors.factureelec.message}
              </FormHelperText>
            )}
          </div>
        )}
      />
      <Controller
        name="facturetotale"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <div className="mb-16">
            <TextField
              {...field}
              fullWidth
              error={!!errors.facturetotale}
              type="number"
              id="facturetotale"
              label="Montant facture total"
              variant="outlined"
            />
            {errors.facturetotale && (
              <FormHelperText className="text-red mb-8">
                {errors.facturetotale.message}
              </FormHelperText>
            )}
          </div>
        )}
      />
      <Controller
        name="personnesfoyer"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <div className="mb-16">
            <TextField
              {...field}
              error={!!errors.personnesfoyer}
              id="personnesfoyer"
              fullWidth
              label="Nombre de personnes dans le foyer"
              type="number"
              variant="outlined"
            />
            {errors.personnesfoyer && (
              <FormHelperText className="text-red mb-8">
                {errors.personnesfoyer.message}
              </FormHelperText>
            )}
          </div>
        )}
      />
      <Controller
        name="agechauffage"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <div className="mb-16">
            <TextField
              {...field}
              error={!!errors.agechauffage}
              fullWidth
              id="agechauffage"
              label="Âge chauffage"
              type="number"
              variant="outlined"
            />
            {errors.agechauffage && (
              <FormHelperText className="text-red mb-8">
                {errors.agechauffage.message}
              </FormHelperText>
            )}
          </div>
        )}
      />
      <Controller
        name="productionecs"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <div className="mb-16">
            <TextField
              {...field}
              error={!!errors.productionecs}
              fullWidth
              id="productionecs"
              label="Production ECS"
              multiline
              variant="outlined"
            />
          </div>
        )}
      />
      <Controller
        name="ageecs"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <div className="mb-16">
            <TextField
              {...field}
              id="ageecs"
              error={!!errors.ageecs}
              fullWidth
              label="Âge ECS"
              type="number"
              variant="outlined"
            />
            {errors.ageecs && (
              <FormHelperText className="text-red mb-8">
                {errors.ageecs.message}
              </FormHelperText>
            )}
          </div>
        )}
      />
      <Controller
        name="isolation"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <>
            <FormLabel required={false} component="legend">
              Isolation
            </FormLabel>
            <RadioGroup
              id="isolation"
              name="radio-buttons-group"
              value={field.value}
              onChange={field.onChange}
            >
              <FormControlLabel
                value="bonne"
                control={<Radio />}
                label="Bonne"
              />
              <FormControlLabel
                value="moyenne"
                control={<Radio />}
                label="Moyenne"
              />
              <FormControlLabel
                value="arefaire"
                control={<Radio />}
                label="À refaire"
              />
            </RadioGroup>
            {errors.isolation && (
              <FormHelperText className="text-red mb-8">
                {errors.isolation.message}
              </FormHelperText>
            )}
          </>
        )}
      />{" "}
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <div className="mt-12">
            <FormLabel required component="legend">
              Statut de prospection
            </FormLabel>
            <RadioGroup
              id="status"
              name="radio-buttons-group"
              value={field.value ?? ""}
              onChange={field.onChange}
            >
              <FormControlLabel
                value={2}
                control={<Radio />}
                label="Prise de RDV"
              />
              {!props.rdvOnly && (
                <FormControlLabel value={4} control={<Radio />} label="Refus" />
              )}
              {!props.rdvOnly && (
                <FormControlLabel
                  value={5}
                  control={<Radio />}
                  label="Hors Cible"
                />
              )}
            </RadioGroup>
            {errors.status && (
              <FormHelperText>{errors.status.message}</FormHelperText>
            )}
          </div>
        )}
      />
    </div>
  );
}

export default RoleTab;
