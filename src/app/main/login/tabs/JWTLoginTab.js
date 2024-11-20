import { yupResolver } from "@hookform/resolvers/yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { submitLogin } from "app/auth/store/loginSlice";
import * as yup from "yup";
import _ from "@lodash";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Veuillez saisir une adresse e-mail valide")
    .required("Veuillez saisir votre adresse e-mail"),
  password: yup
    .string()
    .required("Veuillez entrer votre mot de passe")
    .min(
      4,
      "Le mot de passe est trop court, il doit faire au moins 4 caractères."
    ),
});

const defaultValues = {
  email: "",
  password: "",
};

function JWTLoginTab({ openForgot }) {
  const dispatch = useDispatch();
  const login = useSelector(({ auth }) => auth.login);
  const {
    control,
    setValue,
    formState,
    handleSubmit,
    reset,
    trigger,
    setError,
  } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {}, [reset, setValue, trigger]);

  useEffect(() => {
    login.errors.forEach((error) => {
      setError(error.type, {
        type: "manual",
        message: error.message,
      });
    });
  }, [login.errors, setError]);

  function onSubmit(model) {
    dispatch(submitLogin(model));
  }

  return (
    <div className="w-full">
      <form
        className="flex flex-col justify-center w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-16"
              type="text"
              error={!!errors.email}
              helperText={errors?.email?.message}
              label="Adresse E-mail"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Icon className="text-20" color="action">
                      user
                    </Icon>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              required
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-16"
              label="Mot de Passe"
              type="password"
              error={!!errors.password}
              helperText={errors?.password?.message}
              variant="outlined"
              InputProps={{
                className: "pr-2",
                type: showPassword ? "text" : "password",
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      size="large"
                    >
                      <Icon className="text-20" color="action">
                        {showPassword ? "visibility" : "visibility_off"}
                      </Icon>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="w-full mx-auto mt-16 mb-16"
          aria-label="LOG IN"
          disabled={_.isEmpty(dirtyFields) || !isValid}
          value="legacy"
        >
          Connexion
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className="w-full mx-auto mb-32"
          aria-label="Mot de passe oublié"
          onClick={(e) => {
            e.preventDefault();
            openForgot();
          }}
        >
          Mot de passe oublié
        </Button>
      </form>
    </div>
  );
}

export default JWTLoginTab;
