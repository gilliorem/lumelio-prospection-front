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
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  FormHelperText,
  Radio,
} from "@mui/material";
import React, { useEffect, useState } from "react";

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

const FilterDialog = ({
  closeDialog,
  open,
  sortingFilter,
  setSortingFilters,
}) => {
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    if (sortingFilter) {
      setFilter(sortingFilter);
    }
  }, [sortingFilter]);
  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      fullWidth
      maxWidth="xs"
      className="h-full"
      scroll="paper"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            Trier en fonction du statut de prospection
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent classes={{ root: "p-0 m-0" }}>
        <div className="flex flex-col items-center justify-center py-12">
          <RadioGroup
            id="sorting-filters"
            name="radio-buttons-group"
            value={filter}
            onChange={(e) => {
              setFilter(Number(e.target.value));
            }}
          >
            <FormControlLabel
              value={0}
              className="text-16"
              control={<Radio />}
              label="Tous"
            />
            <FormControlLabel
              value={1}
              className="text-16"
              control={<Radio />}
              label="Non visités"
            />
            <FormControlLabel
              value={2}
              className="text-16"
              control={<Radio />}
              label="RDV"
            />
            <FormControlLabel value={3} control={<Radio />} label="Absent" />
            <FormControlLabel value={4} control={<Radio />} label="Refus" />
          </RadioGroup>
        </div>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={(e) => {
              setSortingFilters(filter);
              e.preventDefault();
              closeDialog();
            }}
          >
            Valider
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
