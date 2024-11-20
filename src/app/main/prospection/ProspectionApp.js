import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import React, { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useDeepCompareEffect } from "@fuse/hooks";
import { styled } from "@mui/material/styles";
import ProspectionSearchHeader from "./search/ProspectionSearchHeader";
// import { getLabels } from "./store/labelsSlice";
// import { getFilters } from "./store/filtersSlice";
// import { getFolders } from "./store/foldersSlice";
// import { getTodos } from "./store/todosSlice";
import reducer, { getStreetData } from "./store/prospectionSlice";
import TodoList from "./TodoList";
import TodoDialog from "./ProspectionDialog";
import StreetDialog from "./search/StreetDialog";
import SortingDialog from "./search/FilterDialog";

const ProspectionApp = () => {
  const dispatch = useDispatch();
  const [streetDialogOpen, setStreetDialogOpen] = useState(false);
  const [sortDialogOpen, setSortDialogOpen] = useState(false);
  const [streetSelected, setStreetSelected] = useState(null);
  const [streetsFromAPI, setStreetsFromAPI] = useState(null);
  const [sortingFilter, setSortingFilters] = useState(null);
  const pageLayout = useRef(null);
  const routeParams = useParams();

  useEffect(() => {
    const streetData = localStorage.getItem("streetData");
    if (streetData) {
      setStreetSelected(JSON.parse(streetData));
    }
  }, []);

  useEffect(() => {
    if (streetSelected) {
      console.log(streetSelected);
      dispatch(getStreetData(streetSelected));
      localStorage.setItem("streetData", JSON.stringify(streetSelected));
    }
  }, [streetSelected]);

  return (
    <>
      <FusePageCarded
        header={
          <ProspectionSearchHeader
            street={streetSelected}
            setStreetsFromAPI={setStreetsFromAPI}
            setStreetDialogOpen={setStreetDialogOpen}
          />
        }
        content={
          <TodoList
            street={streetSelected}
            sortingFilter={sortingFilter}
            setSortingFilters={setSortingFilters}
            openSortingDialog={() => setSortDialogOpen(true)}
          />
        }
      />
      <TodoDialog />

      <StreetDialog
        closeDialog={() => setStreetDialogOpen(false)}
        open={streetDialogOpen}
        streetsFromAPI={streetsFromAPI}
        setStreetSelected={setStreetSelected}
      />
      <SortingDialog
        closeDialog={() => setSortDialogOpen(false)}
        open={sortDialogOpen}
        sortingFilter={sortingFilter}
        setSortingFilters={setSortingFilters}
      />
    </>
  );
};

export default withReducer("prospection", reducer)(ProspectionApp);
