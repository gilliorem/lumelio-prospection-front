import FuseUtils from "@fuse/utils";
import _ from "@lodash";
import { ListItem, Tab, Tabs, Icon, List, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import NextListItem from "./search/NextListItem";
import { changeTabValue } from "./store/prospectionSlice";
import TodoListItem from "./TodoListItem";

function TodoList(props) {
  const street = useSelector((state) => state.prospection.streetData);
  const tabValue = useSelector((state) => state.prospection.tabValue);
  const dispatch = useDispatch();

  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    // Sort Pair / Impair --> setFilteredData
    if (street && street.numbers && street.numbers.length > 0) {
      const numbers = props.sortingFilter
        ? street.numbers.filter((f) => f.status === props.sortingFilter)
        : street.numbers;

      if (tabValue === 0) {
        setFilteredData(numbers.filter((e) => Number(e.housenumber) % 2 === 0));
      } else {
        setFilteredData(numbers.filter((e) => Number(e.housenumber) % 2 !== 0));
      }
    } else if ((street && !street.numbers) || street.numbers.length === 0) {
      setFilteredData([]);
    }
  }, [street, tabValue, props.sortingFilter]);

  if (!props.street) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
          className="flex flex-1 items-center justify-center h-full"
        >
          <Typography color="textSecondary" variant="h5">
            Veuillez saisir un Nom de Rue et une Ville.
          </Typography>
        </motion.div>
      </>
    );
  }

  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <List className="p-0 pb-24">
      <Tabs
        value={tabValue}
        onChange={(e, newVal) => dispatch(changeTabValue(newVal))}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        scrollButtons="auto"
        classes={{ root: "w-full h-64" }}
      >
        <Tab className="h-64" label="Pair" />
        <Tab className="h-64" label="Impair" />
      </Tabs>

      <ListItem
        button
        className="h-64 w-full flex items-center justify-center"
        onClick={props.openSortingDialog}
        divider
        dense
      >
        <Icon fontSize="18">sort</Icon>
        <Typography className="ml-8" fontSize="18" fontWeight="medium">
          Filtrer
        </Typography>
      </ListItem>
      <motion.div variants={container} initial="hidden" animate="show">
        {filteredData &&
          filteredData.map((house, i) => (
            <motion.div variants={item} key={i}>
              <TodoListItem
                house={{
                  name: street.name,
                  city: street.city,
                  geoId: street.id,
                  label: street.label,
                  postcode: street.postcode,
                  housenumber: house.housenumber,
                  status: house.status,
                  complement: house.complement,
                  id: house.id,
                }}
              />
            </motion.div>
          ))}
        <NextListItem
          currentTab={tabValue}
          setSortingFilters={props.setSortingFilters}
        />
      </motion.div>
    </List>
  );
}

export default TodoList;
