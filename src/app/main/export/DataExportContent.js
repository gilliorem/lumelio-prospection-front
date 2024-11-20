import { motion } from "framer-motion";
import React, { useState } from "react";
import { DatePicker, LoadingButton } from "@mui/lab";
import { TextField, Typography, Icon, IconButton, Button } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { Link } from "react-router-dom";

const DataExportContent = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState(null);
  const dispatch = useDispatch();

  const onButtonClick = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    const response = await axios.post("/events/export", {
      startdate: startDate,
    });
    const data = await response.data;
    setLoading(false);
    dispatch(
      showMessage({
        message: "Export généré",
        variant: "success", // success error info warning null,
        autoHideDuration: 2000, // ms
        anchorOrigin: {
          vertical: "top", // top bottom
          horizontal: "center", // left center right
        },
      })
    );
    setDownloadLink(data);
  };

  const downloadExportData = () => {
    window.open(downloadLink);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex-col flex flex-auto w-full max-h-full"
    >
      <div className="flex p-24 w-full items-center mt-24 ml-12">
        <DatePicker
          value={startDate}
          onChange={(e) => setStartDate(e)}
          minutesStep={30}
          label="Date de début d'export"
          todayText="Aujourd'hui"
          toolbarTitle="Choisir une date"
          renderInput={(_props) => (
            <TextField label="Date de début d'export" {..._props} />
          )}
        />
        {loading ? (
          <LoadingButton
            variant="contained"
            color="primary"
            className="ml-24 h-52 w-192"
          />
        ) : (
          <Button
            variant="contained"
            color="primary"
            className="ml-24 h-52 w-192"
            startIcon={<Icon>get_app</Icon>}
            onClick={onButtonClick}
          >
            Générer le fichier
          </Button>
        )}
        {downloadLink && (
          <Button
            className="ml-24 h-52 flex items-center w-160 justify-center"
            startIcon={<Icon>save</Icon>}
            variant="contained"
            color="secondary"
            type="button"
            onClick={downloadExportData}
          >
            Télécharger
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default DataExportContent;
