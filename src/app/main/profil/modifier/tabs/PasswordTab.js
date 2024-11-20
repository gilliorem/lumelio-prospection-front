import {
  Button,
  Icon,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useLocation } from "react-router";

function PasswordTab(props) {
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;
  const [updatePassword, setUpdatePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();

  return (
    <div>
      {location.pathname !== "/utilisateurs/ajouter" && !updatePassword && (
        <Button
          onClick={() => setUpdatePassword(true)}
          variant="contained"
          color="secondary"
        >
          <Icon className="mx-6 text-16">vpn_key</Icon>
          Changer le mot de passe
        </Button>
      )}
      {(location.pathname === "/utilisateurs/ajouter" || updatePassword) && (
        <>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className={errors.password ? "mt-8" : "mt-8 mb-20"}
                required
                error={!!errors.password}
                helperText={errors.password && errors.password.message}
                label="Mot de passe"
                autoFocus
                type="password"
                id="password"
                variant="outlined"
                fullWidth
                InputProps={{
                  className: "pr-2",
                  type: showPassword ? "text" : "password",
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon className="text-20" color="action">
                          {showPassword ? "visibility" : "visibility_off"}
                        </Icon>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="confirmpassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className={errors.confirmpassword ? "mt-8" : "mt-8 mb-20"}
                required
                error={!!errors.confirmpassword}
                helperText={
                  errors.confirmpassword && errors.confirmpassword.message
                }
                label="Confirmer le mot de passe"
                type="password"
                id="confirmpassword"
                variant="outlined"
                fullWidth
                InputProps={{
                  className: "pr-2",
                  type: showConfirmPassword ? "text" : "password",
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <Icon className="text-20" color="action">
                          {showConfirmPassword
                            ? "visibility"
                            : "visibility_off"}
                        </Icon>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </>
      )}
    </div>
  );
}

export default PasswordTab;
