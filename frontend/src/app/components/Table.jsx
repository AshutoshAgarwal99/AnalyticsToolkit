import React from "react";
import uuid from 'uuid';

// Table component to create bootstrap tables
const Table = (props) => {
  return (
    <table
      id="summary-grid"
      className="table table-striped table-bordered table-hover"
    >
      <thead>
        <tr>
          {props.columns
            ? props.columns.map((columnName) => (
                <th key={uuid.uuid4}>{columnName}</th>
              ))
            : null}
        </tr>
      </thead>
      <tbody>
        {props.rows
          ? props.rows.map((row) => (
              <tr key={uuid.uuid4}>
                {row.map((row_) => (
                  <td key={uuid.uuid4}>{row_.toLocaleString()}</td>
                ))}
              </tr>
            ))
          : null}
      </tbody>
    </table>
  );
};

export default Table;
