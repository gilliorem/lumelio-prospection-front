import _ from "@lodash";
import { styled } from "@mui/material/styles";
import { amber, red } from "@mui/material/colors";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import labels from "./labels";
import {
  openRDVDialog,
  removeAddress,
  setHouseNumberStatus,
} from "./store/prospectionSlice";

import TodoChip from "./TodoChip";
import complements from "./complements";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { closeDialog, openDialog } from "app/store/fuse/dialogSlice";

const StyledListItem = styled(ListItem)(({ theme, completed }) => ({
  ...(completed && {
    background: "rgba(0,0,0,0.03)",
    "& .todo-title, & .todo-notes": {
      textDecoration: "line-through",
    },
  }),
}));

function TodoListItem(props) {
  const dispatch = useDispatch();
  const selectedLabel = labels.filter((e) => e.id === props.house.status)[0];
  return (
    <StyledListItem
      className="py-20 px-0 sm:px-8 px-12"
      completed={props.house.status === 5 ? 1 : 0}
      dense
      divider
      button
      onClick={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        dispatch(openRDVDialog({ ...props.house }));
      }}
    >
      {/* <IconButton
        tabIndex={-1}
        disableRipple
        onClick={(ev) => {
          ev.stopPropagation();
          dispatch(
            updateTodo({
              ...props.todo,
              completed: !props.todo.completed,
            })
          );
        }}
        size="large"
      >
        {props.todo.completed ? (
          <Icon color="secondary">check_circle</Icon>
        ) : (
          <Icon color="action">radio_button_unchecked</Icon>
        )}
      </IconButton> */}

      <div className="flex flex-1 flex-col relative overflow-hidden px-8">
        <Typography
          className="todo-title truncate text-14 font-medium"
          // color={props.todo.completed ? "textSecondary" : "inherit"}
        >
          {props.house.housenumber}{" "}
          {props.house.complement > 0 && complements[props.house.complement]}
        </Typography>

        <Typography color="textSecondary" className="todo-notes truncate">
          {props.house.name}, {props.house.postcode}, {props.house.city}
        </Typography>
        {!props.house.status ||
          (props.house.status.length === 0 && <div className="block h-24" />)}
        <div className="flex -mx-2 mt-8">
          {selectedLabel && (
            <TodoChip
              className="mx-2 mt-4"
              title={selectedLabel.title}
              color={selectedLabel.color}
            />
          )}
        </div>
      </div>

      <div className="px-8">
        <IconButton
          onClick={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            // TODO : CALL API Absent --> Enregistrer l'adresse avec le statut 3
            dispatch(
              setHouseNumberStatus({
                ...props.house,
                housenumber: Number(props.house.housenumber),
                complement: Number(props.house.complement),
                status: 3,
              })
            );
          }}
          size="large"
          className="text-orange"
        >
          <Icon>location_off</Icon>
        </IconButton>
        {props.house.id && (
          <IconButton
            className="text-red"
            onClick={(ev) => {
              ev.stopPropagation();
              dispatch(
                openDialog({
                  children: (
                    <>
                      <DialogTitle id="alert-dialog-title">
                        Supprimer l'adresse ?
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Êtes-vous certain de vouloir supprimer cette adresse ?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => dispatch(closeDialog())}
                          color="primary"
                        >
                          Non
                        </Button>
                        <Button
                          onClick={() => {
                            console.log(props.house);
                            dispatch(removeAddress(props.house.id));
                            dispatch(closeDialog());
                          }}
                          className="text-red"
                          autoFocus
                        >
                          Oui
                        </Button>
                      </DialogActions>
                    </>
                  ),
                })
              );
            }}
          >
            <Icon>delete</Icon>
          </IconButton>
        )}
      </div>
    </StyledListItem>
  );
}

export default TodoListItem;
