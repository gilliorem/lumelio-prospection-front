import History from "@history";
import { motion } from "framer-motion";
import FuseUtils from "@fuse/utils";
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Avatar,
  IconButton,
  Icon,
  Typography,
} from "@mui/material";
import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openDialog, closeDialog } from "app/store/fuse/dialogSlice";
import ContactsTable from "./ContactsTable";
import { removeContact, selectContacts } from "./store/contactsSlice";

function ContactsList(props) {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  const userRole = useSelector((state) => state.auth.user.role);
  const searchText = useSelector(
    ({ contactsApp }) => contactsApp.contacts.searchText
  );
  const user = useSelector(({ contactsApp }) => contactsApp.user);

  const [filteredData, setFilteredData] = useState(null);

  const columns = useMemo(
    () => [
      {
        accessor: "photo",
        Cell: ({ row }) =>
          row.original.photo ? (
            <Avatar
              className="mx-8"
              alt={row.original.firstname}
              src={row.original.photo}
            />
          ) : (
            <Avatar alt={row.original.firstname} className="mx-8">
              {row.original.firstname[0]}
            </Avatar>
          ),
        className: "justify-center",
        width: 64,
        sortable: false,
      },
      {
        Header: "Prénom",
        accessor: "firstname",
        className: "font-medium",
        sortable: true,
      },
      {
        Header: "Nom",
        accessor: "lastname",
        className: "font-medium",
        sortable: true,
      },
      {
        Header: "Email",
        accessor: "email",
        sortable: true,
      },
      {
        Header: "N° de Tél",
        accessor: "phonenumber",
        sortable: true,
      },
      {
        Header: "Rôle",
        accessor: "role",
        sortable: true,
      },
      {
        Header: "Couleur",
        accessor: "color",
        className: "pr-48",
        sortable: true,
      },
      {
        Header: "Date de création",
        accessor: "creationdate",
        sortable: true,
      },
      {
        id: "action",
        width: 128,
        sortable: false,
        Cell: ({ row }) => (
          <div className="flex items-center">
            {(userRole === "admin" || userRole === "uadmin") && (
              <IconButton
                onClick={(ev) => {
                  ev.stopPropagation();
                  History.push(`/utilisateurs/modifier/${row.original.id}`);
                }}
              >
                <Icon>edit</Icon>
              </IconButton>
            )}
            {userRole === "admin" && (
              <IconButton
                className="text-red"
                onClick={(ev) => {
                  ev.stopPropagation();
                  dispatch(
                    openDialog({
                      children: (
                        <>
                          <DialogTitle id="alert-dialog-title">
                            Supprimer l'utilisateur ?
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              Êtes-vous certain de vouloir supprimer cet
                              utilisateur ?
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
                                dispatch(removeContact(row.original.id));
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
        ),
      },
    ],
    [dispatch, user.starred]
  );

  useEffect(() => {
    function getFilteredArray(entities, _searchText) {
      if (_searchText.length === 0) {
        return contacts;
      }
      return FuseUtils.filterArrayByString(contacts, _searchText);
    }

    if (contacts) {
      setFilteredData(getFilteredArray(contacts, searchText));
    }
  }, [contacts, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          Il n'y a aucun utilisateur
        </Typography>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-auto w-full max-h-full"
    >
      <ContactsTable
        columns={columns}
        data={filteredData}
        onRowClick={(ev, row) => {
          if (row) {
            History.push(`/utilisateurs/${row.original.id}`);
          }
        }}
      />
    </motion.div>
  );
}

export default ContactsList;
