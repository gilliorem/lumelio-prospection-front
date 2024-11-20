import FuseLoading from "@fuse/core/FuseLoading";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  List,
  Typography,
  AppBar,
  Toolbar,
  ListItem,
  IconButton,
  Icon,
} from "@mui/material";
import React from "react";

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

const StreetDialog = ({
  closeDialog,
  open,
  streetsFromAPI,
  setStreetSelected,
}) => {
  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      fullWidth
      maxWidth="lg"
      className="h-full"
      scroll="paper"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full items-center justify-between">
          <Typography variant="subtitle1" color="inherit">
            Sélectionner la rue
          </Typography>
          <IconButton onClick={closeDialog}>
            <Icon className="text-white">close</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent classes={{ root: "p-0 m-0" }}>
        {!streetsFromAPI ? (
          <FuseLoading />
        ) : (
          <List>
            {streetsFromAPI.map((e) => (
              <StreetListItem
                onClick={() => {
                  setStreetSelected({
                    displayName: `${e.properties.name}, ${
                      e.properties.postcode
                    }, ${e.properties.city.toUpperCase()}`,
                    id: e.properties.id,
                    label: e.properties.label,
                    name: e.properties.name,
                    city: e.properties.city,
                    postcode: e.properties.postcode,
                  });
                  closeDialog();
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StreetDialog;
