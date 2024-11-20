import { Icon, IconButton, Typography } from "@mui/material";

import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import FuseUtils from "@fuse/utils";
import { Controller, useFormContext } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  imageTrashIcon: {
    color: "red",
    zIndex: 200,
    position: "absolute",
    top: 0,
    right: 0,
    fontSize: 18,
    "&:hover": {
      backgroundColor: "red",
      color: "white",
      opacity: 0.8,
    },
  },
  productImageUpload: {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },
  productImageItem: {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,

    "&.featured": {
      pointerEvents: "none",
      boxShadow: theme.shadows[3],
    },
  },
}));

function ProfileImageTab(props) {
  const classes = useStyles(props);
  const methods = useFormContext();
  const { control, watch, setValue } = methods;

  const photo = watch("photo", {});

  return (
    <div>
      <div className="flex justify-center sm:justify-start flex-wrap -mx-16">
        <Controller
          name="photo"
          control={control}
          render={({ field: { onChange, value } }) => (
            <label
              htmlFor="button-file"
              className={clsx(
                classes.productImageUpload,
                "flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
              )}
            >
              <input
                accept="image/*"
                className="hidden"
                id="button-file"
                type="file"
                onChange={async (e) => {
                  function readFileAsync() {
                    return new Promise((resolve, reject) => {
                      const file = e.target.files[0];
                      if (!file) {
                        return;
                      }
                      const reader = new FileReader();

                      reader.onload = () => {
                        resolve({
                          id: FuseUtils.generateGUID(),
                          url: `data:${file.type};base64,${btoa(
                            reader.result
                          )}`,
                          type: "image",
                        });
                      };

                      reader.onerror = reject;

                      reader.readAsBinaryString(file);
                    });
                  }

                  const newImage = await readFileAsync();

                  onChange(newImage);
                }}
              />
              <Icon fontSize="large" color="action">
                cloud_upload
              </Icon>
            </label>
          )}
        />
        {photo && (
          <div
            className={clsx(
              classes.productImageItem,
              "flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg"
            )}
          >
            <IconButton
              onClick={(ev) => {
                ev.stopPropagation();
                setValue("photo", null);
              }}
              className={classes.imageTrashIcon}
            >
              <Icon className="">delete</Icon>
            </IconButton>

            <img
              className="max-w-none w-auto h-full"
              src={photo.url ? photo.url : photo}
              alt="profil"
            />
          </div>
        )}
      </div>
      <Typography className="text-red">
        Le fichier ne doit pas dépasser 1 Mo sinon il ne sera pas accepté
      </Typography>
    </div>
  );
}

export default ProfileImageTab;
