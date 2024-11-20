import { forwardRef, useRef, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import PropTypes from "prop-types";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Typography } from "@mui/material";
import TableSortLabel from "@mui/material/TableSortLabel";
import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import { useSelector } from "react-redux";
import clsx from "clsx";
import ContactsTablePaginationActions from "./ContactsTablePaginationActions";

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <Checkbox ref={resolvedRef} {...rest} />
    </>
  );
});

const EnhancedTable = ({ columns, data, onRowClick }) => {
  const authRole = useSelector((state) => state.auth.user.role);
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      autoResetPage: true,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.allColumns.push((_columns) => [
        // Let's make a column for selection
        ..._columns,
      ]);
    }
  );

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
  };

  // Render the UI for your table
  return (
    <div className="flex flex-col w-full min-h-full sm:border-1 sm:rounded-16 overflow-hidden">
      <TableContainer className="flex flex-1">
        <Table {...getTableProps()} stickyHeader className="simple borderless">
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  if (authRole === "prospector" || authRole === "commercial") {
                    return (
                      <>
                        {column.Header === "Date de création" ||
                        column.Header === "Rôle" ? null : (
                          <TableCell
                            className="whitespace-nowrap p-4 md:p-12"
                            {...(!column.sortable
                              ? column.getHeaderProps()
                              : column.getHeaderProps(
                                  column.getSortByToggleProps()
                                ))}
                          >
                            {column.render("Header")}
                            {column.sortable ? (
                              <TableSortLabel
                                active={column.isSorted}
                                // react-table has a unsorted state which is not treated here
                                direction={column.isSortedDesc ? "desc" : "asc"}
                              />
                            ) : null}
                          </TableCell>
                        )}
                      </>
                    );
                  }
                  return (
                    <TableCell
                      className="whitespace-nowrap p-4 md:p-12"
                      {...(!column.sortable
                        ? column.getHeaderProps()
                        : column.getHeaderProps(column.getSortByToggleProps()))}
                    >
                      {column.render("Header")}
                      {column.sortable ? (
                        <TableSortLabel
                          active={column.isSorted}
                          // react-table has a unsorted state which is not treated here
                          direction={column.isSortedDesc ? "desc" : "asc"}
                        />
                      ) : null}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow
                  {...row.getRowProps()}
                  onClick={(ev) => onRowClick(ev, row)}
                  className="truncate cursor-pointer"
                >
                  {row.cells.map((cell) => {
                    if (cell.column.Header === "Date de création") {
                      if (
                        authRole === "prospector" ||
                        authRole === "commercial"
                      ) {
                        return null;
                      }
                      return (
                        <TableCell
                          {...cell.getCellProps()}
                          className={clsx("p-4 md:p-12", cell.column.className)}
                        >
                          {new Date(cell.value).toLocaleDateString("fr-FR")}
                        </TableCell>
                      );
                    }
                    if (cell.column.Header === "Couleur") {
                      return (
                        <TableCell
                          {...cell.getCellProps()}
                          className={clsx(cell.column.className)}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: 100,
                              height: 30,
                              backgroundColor: cell.value,
                              color: "#FFFFFF",
                              borderRadius: 30,
                            }}
                          >
                            <Typography>12H - RDV</Typography>
                          </div>
                        </TableCell>
                      );
                    }
                    if (cell.column.Header === "Rôle") {
                      if (
                        authRole === "prospector" ||
                        authRole === "commercial"
                      ) {
                        return null;
                      }
                      return (
                        <TableCell
                          {...cell.getCellProps()}
                          className={clsx("p-4 md:p-12", cell.column.className)}
                        >
                          {cell.value === "prospector"
                            ? "prospecteur"
                            : cell.value}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell
                        {...cell.getCellProps()}
                        className={clsx("p-4 md:p-12", cell.column.className)}
                      >
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        classes={{
          root: "flex-shrink-0 border-t-1",
        }}
        rowsPerPageOptions={[
          5,
          10,
          25,
          { label: "All", value: data.length + 1 },
        ]}
        colSpan={5}
        count={data.length}
        rowsPerPage={pageSize}
        labelRowsPerPage="Lignes par page"
        page={pageIndex}
        SelectProps={{
          inputProps: { "aria-label": "Lignes par page" },
          native: false,
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={ContactsTablePaginationActions}
      />
    </div>
  );
};

EnhancedTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  onRowClick: PropTypes.func,
};

export default EnhancedTable;
