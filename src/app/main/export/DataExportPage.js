import FusePageCarded from "@fuse/core/FusePageCarded";
import Icon from "@mui/material/Icon";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DataExportContent from "./DataExportContent";
import DataExportHeader from "./DataExportHeader";

function DataExportPage() {
  return (
    <FusePageCarded
      header={<DataExportHeader />}
      content={<DataExportContent />}
    />
  );
}

export default DataExportPage;
