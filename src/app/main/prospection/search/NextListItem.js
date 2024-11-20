import React, { useState } from "react";
import _ from "@lodash";
import { styled } from "@mui/material/styles";
import { green, red } from "@mui/material/colors";
import {
  Button,
  Icon,
  IconButton,
  Input,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import labels from "../labels";
import {
  addNumberToStreet,
  addNextNumberToStreet,
  addPreviousNumberToStreet,
} from "../store/prospectionSlice";

import TodoChip from "../TodoChip";

const StyledListItem = styled(ListItem)(({ theme, completed }) => ({
  ...(completed && {
    background: "rgba(0,0,0,0.03)",
    "& .todo-title, & .todo-notes": {
      textDecoration: "line-through",
    },
  }),
}));

const NextListItem = ({ currentTab, setSortingFilters }) => {
  const [enterNumber, setEnterNumber] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState(1);
  const dispatch = useDispatch();
  return (
    <StyledListItem
      className="py-20 px-24 flex items-center justify-between"
      onClick={(ev) => {
        ev.preventDefault();
      }}
      dense
      divider
    >
      {enterNumber ? (
        <div className="flex">
          <Input
            autoFocus
            placeholder="Numéro de rue *"
            value={inputValue}
            type="number"
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div>
            <Select
              value={selectValue}
              className="w-128 ml-12"
              displayEmpty
              onChange={(e) => setSelectValue(e.target.value)}
              native
            >
              <option value="">Complément</option>
              <option value={2}>bis</option>
              <option value={3}>ter</option>
            </Select>
          </div>
          <Button
            variant="contained"
            color="secondary"
            className="mx-12"
            onClick={() => {
              if (inputValue.match(/^\d+$/)) {
                if (selectValue !== 1) {
                  dispatch(
                    addNumberToStreet({
                      housenumber: Number(inputValue),
                      complement: Number(selectValue),
                    })
                  );
                } else {
                  dispatch(
                    addNumberToStreet({
                      housenumber: inputValue,
                      complement: 1,
                    })
                  );
                }
                setEnterNumber(false);
                setSelectValue("");
                setSortingFilters(null);
                setInputValue(`${Number(inputValue) + 2}`);
              } else {
                dispatch(
                  showMessage({
                    message: "Veuillez saisir un nombre",
                    variant: "error", // success error info warning null,
                    autoHideDuration: 3000, // ms
                    anchorOrigin: {
                      vertical: "bottom", // top bottom
                      horizontal: "right", // left center right
                    },
                  })
                );
              }
            }}
          >
            <Icon>check</Icon>
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setEnterNumber(false)}
          >
            <Icon>clear</Icon>
          </Button>
        </div>
      ) : (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setSortingFilters(null);
              dispatch(addPreviousNumberToStreet(currentTab));
            }}
          >
            Numéro Précédent
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setEnterNumber(true)}
          >
            Entrer un Numéro
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setSortingFilters(null);
              dispatch(addNextNumberToStreet(currentTab));
            }}
          >
            Numéro Suivant
          </Button>
        </>
      )}
    </StyledListItem>
  );
};

export default NextListItem;
