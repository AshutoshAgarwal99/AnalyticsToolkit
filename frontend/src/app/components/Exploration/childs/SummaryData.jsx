import Card from "../../Card.jsx";
import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../../../contexts/DataContext";
import Table from "../../Table.jsx";

function SummaryData(props) {
  const oData = useContext(DataContext);
  const [axisSelect, setAxisSelect] = useState(props.axisName);
  const [valueSelect, setValueSelect] = useState(props.columnName);

  useEffect(() => {
    props.setColumn(valueSelect);
  }, [valueSelect]);

  useEffect(() => {
    props.setAxis(axisSelect);
  }, [axisSelect]);

  if (axisSelect !== "-1" && valueSelect !== "-1") {
    // const valueSelect = document.getElementById("value-select").value;
    // const axisSelect = document.getElementById("axis-select").value;

    if (valueSelect == -1 || axisSelect == -1) {
      // alert('Please select valid column name');
      return;
    }
  }

  return (
    <div>
      <Card
        page="exploration"
        title="Display of the first 5 rows of your dataset."
        expanded={props.expanded}
        content={
          oData ? (
            <Table
              columns={oData.input_data_columns}
              rows={oData.data_sample}
            />
          ) : null
        }
      />

      <Card
        page="exploration"
        title="Overview of the numerical features' summary statistics."
        content={
          oData ? (
            <Table
              // columns={oData.input_data_desc_columns}
              // rows={oData.data_desc}
              columns={oData.numerical_columns}
              rows={oData.numerical_data}
            />
          ) : null
        }
      />

      <Card
        page="exploration"
        title="Overview of the summary statistics for categorical features."
        content={
          oData ? (
            <Table
              columns={oData.categorical_columns}
              rows={oData.categorical_data}
            />
          ) : null
        }
      />
    </div>
  );
}

export default SummaryData;
