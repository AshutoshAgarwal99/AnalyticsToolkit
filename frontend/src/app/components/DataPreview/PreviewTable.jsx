import axios from "axios";
import React, { useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Link, Redirect } from "react-router-dom";
import TablePaginationActions from "./childs/TablePaginationActions";

const useStyles = makeStyles({
  root: {
    width: "80%",
    padding: "30px",
    borderRadius: "20px",
    margin: "auto",
  },
  container: {
    height: "fit-content",
  },
});

export default function PreviewTable() {
  const oClasses = useStyles();
  const [iPage, setPage] = React.useState(0);
  const [iRowsPerPage, setRowsPerPage] = React.useState(25);
  const [aColumns, setColums] = React.useState([]);
  const [aRows, setRows] = React.useState([]);
  const [bMoveBackward, setMoveBackward] = React.useState(false);

  useEffect(() => {
    axios.get("/exploration-data").then((response) => {
      let oData = JSON.parse(response.data);
      if (oData) {
        let columnNames = [];
        let aRows = [];
        let oneRow = {};
        oData.input_data_columns.map((columnName) =>
          columnNames.push({
            id: columnName,
            label: columnName,
            minWidth: 170,
          })
        );

        for (
          let index = 0;
          index < oData.table_data[oData.columns[0][0]].length;
          index++
        ) {
          oData.input_data_columns.map((columnName) => {
            oneRow[columnName] = oData.table_data[columnName][index];
          });

          aRows.push(oneRow);
          oneRow = [];
        }
        setColums(columnNames);
        setRows(aRows);
      }
    });
    //   }
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (bMoveBackward) {
    return <Redirect to="/upload" />;
  } else {
    return (
      <section className="preview-container">
        <h2 className="data-preview-heading">Data Preview</h2>
        <Paper className={oClasses.root}>
          <TableContainer className="card table-container">
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {aColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        backgroundColor: "#054357",
                        color: "#212529",
                        fontWeight: "500",
                        fontSize: "1rem",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {aRows
                  .slice(
                    iPage * iRowsPerPage,
                    iPage * iRowsPerPage + iRowsPerPage
                  )
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
                        {aColumns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={aRows.length}
                  rowsPerPage={iRowsPerPage}
                  page={iPage}
                  SelectProps={{
                    inputProps: { "aria-label": "rows per page" },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
        <div className="section-bottom">
          <button
            className="btn btn-light my-2"
            onClick={() => {
              setMoveBackward(true);
            }}
          >
            Back
          </button>

          <Link to="/exploration">
            <button className="btn btn-light my-2">Proceed</button>
          </Link>
        </div>
      </section>
    );
  }
}
