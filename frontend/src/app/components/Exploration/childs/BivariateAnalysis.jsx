import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../../../contexts/DataContext";
import axios from "axios";
import Visual from "../../Visual.jsx";
import Card from "../../Card.jsx";
import { Stack } from "office-ui-fabric-react";
import {
  ScreenWidthMaxLarge,
  ScreenWidthMinMedium,
  ScreenWidthMinUhfMobile,
  ScreenWidthMinXLarge,
  ScreenWidthMinXXLarge,
  Dropdown,
} from "@fluentui/react";
import {
  getHeatMapPlotData,
  getColumnChart,
  heatMapPlot,
} from "./bivariateAnalysisHelper";
import Plot from "react-plotly.js";

var xValues = [
  "COUPON",
  "NEW",
  "HI",
  "S_INCOME",
  "E_INCOME",
  "S_POP",
  "E_POP",
  "DISTANCE",
  "PAX",
  "FARE",
];

var yValues = [
  "COUPON",
  "NEW",
  "HI",
  "S_INCOME",
  "E_INCOME",
  "S_POP",
  "E_POP",
  "DISTANCE",
  "PAX",
  "FARE",
];

var zValues = [
  [1.0, 0.02, -0.347, -0.088, 0.047, -0.108, 0.095, 0.747, -0.337, 0.497],
  [0.02, 1.0, 0.054, 0.027, 0.113, -0.017, 0.059, 0.081, 0.01, 0.092],
  [-0.347, 0.054, 1.0, -0.027, 0.082, -0.172, -0.062, -0.312, -0.169, 0.025],
  [-0.088, 0.027, -0.027, 1.0, -0.139, 0.517, -0.272, 0.028, 0.138, 0.209],
  [0.047, 0.113, 0.082, -0.139, 1.0, -0.144, 0.458, 0.177, 0.26, 0.326],
  [-0.108, -0.017, -0.172, 0.517, -0.144, 1.0, -0.28, 0.018, 0.285, 0.145],
  [0.095, 0.059, -0.062, -0.272, 0.458, -0.28, 1.0, 0.116, 0.315, 0.285],
  [0.747, 0.081, -0.312, 0.028, 0.177, 0.018, 0.116, 1.0, -0.102, 0.67],
  [-0.337, 0.01, -0.169, 0.138, 0.26, 0.285, 0.315, -0.102, 1.0, -0.091],
  [0.497, 0.092, 0.025, 0.209, 0.326, 0.145, 0.285, 0.67, -0.091, 1.0],
];

var layout = {
  title: "Annotated Heatmap",
  annotations: [],
  xaxis: {
    ticks: "",
    side: "bottom",
  },
  yaxis: {
    ticks: "",
    ticksuffix: " ",
    width: 700,
    height: 700,
    autosize: false,
  },
};

for (var i = 0; i < yValues.length; i++) {
  for (var j = 0; j < xValues.length; j++) {
    var currentValue = zValues[i][j];
    if (currentValue != 0.0) {
      var textColor = "white";
    } else {
      var textColor = "black";
    }
    var result = {
      xref: "x1",
      yref: "y1",
      x: xValues[j],
      y: yValues[i],
      text: zValues[i][j],
      font: {
        family: "Arial",
        size: 12,
        // color: 'rgb(50, 171, 96)'
      },
      showarrow: false,
      font: {
        color: textColor,
      },
    };
    layout.annotations.push(result);
  }
}
// var colorscaleValue = [
//   [0, '#3D9970'],
//   [1, '#001f3f']
// ];
var data = [
  {
    z: zValues,
    x: xValues,
    y: yValues,
    type: "heatmap",
    hoverongaps: false,
    // colorscale: colorscaleValue
  },
];

export const getStackItemStyles = (size) => {
  let widthContainer = {
    maxWidth: "calc(50% - 16px)",
    minWidth: "calc(100% - 16px)",
    maxLargeWidth: "calc(100%",
    minMobileLargeWidth: "calc(100% - 16px)",
    minXLargeWidth: "calc(50% - 16px)",
    minMediumWidth: "300px",
  };

  if (size == 2) {
    widthContainer = {
      maxWidth: "calc(100% - 16px)",
      minWidth: "calc(100% - 16px)",
      maxLargeWidth: "calc(100% - 16px)",
      minMobileLargeWidth: "calc(100% - 16px)",
      minXLargeWidth: "calc(100% - 16px)",
      minMediumWidth: "calc(100% - 16px)",
    };
  }

  return {
    root: {
      minWidth: widthContainer.minWidth,
      maxWidth: widthContainer.maxWidth,
      selectors: {
        [`@media(max-width: ${ScreenWidthMinMedium}px)`]: {
          minWidth: widthContainer.minMediumWidth,
        },
        [`@media(max-width: ${ScreenWidthMinUhfMobile - 1}px)`]: {
          minWidth: widthContainer.minMobileLargeWidth,
        },
        [`@media(min-width: ${ScreenWidthMinXXLarge}px)`]: {
          minWidth: widthContainer.minXLargeWidth,
        },
        [`@media(max-width: ${ScreenWidthMaxLarge}px)`]: {
          maxWidth: widthContainer.maxLargeWidth,
        },
        [`@media(max-width: ${ScreenWidthMinXLarge - 1}px)`]: {
          minWidth: widthContainer.minMobileLargeWidth,
        },
      },
    },
  };
};

const BivariateAnalysis = (props) => {
  const oData = useContext(DataContext);
  const [sColumnSelect, setColumnSelect] = useState(
    oData.input_data_columns[0]
  );
  const [sModelSelect, setModelSelect] = useState(oData.input_data_columns[1]);
  const [triggerAPICall, setTriggerAPICall] = useState(true);
  const [triggerColumnChartAPICall, setTriggerColumnChartAPICall] =
    useState(true);
  const [boxPlotData, setBoxPlotData] = useState(undefined);
  const [columnPlotData, setColumnPlotData] = useState(undefined);
  const [isNumericalColumn, updateIsNumericalColumn] = useState(
    numericalColumnCheck(oData.input_data_columns[0])
  );
  const [isNumericalModel, updateIsNumericalModel] = useState(
    numericalColumnCheck(oData.input_data_columns[1])
  );

  function numericalColumnCheck(value) {
    if (oData.cat_cols.find((x) => x == value)) {
      return false;
    } else {
      return true;
    }
  }

  function getTargetOptions() {
    var options = [];
    var targetValues = oData.input_data_columns;
    targetValues.forEach((x) => {
      options.push({ key: x, text: x });
    });
    return options;
  }

  useEffect(() => {
    if (triggerAPICall) {
      axios.post("BiVariateAnaysis").then((response) => {
        setBoxPlotData(JSON.parse(response.data));
      });
      setTriggerAPICall(false);
    }

    if (triggerColumnChartAPICall) {
      var oFormData = new FormData();
      oFormData.append("column1", sColumnSelect);
      oFormData.append("column2", sModelSelect);

      axios.post("BiVariateAnaysis_Association", oFormData).then((response) => {
        setColumnPlotData(JSON.parse(response.data));
        console.log(JSON.parse(response.data));
      });
      setTriggerColumnChartAPICall(false);
    }
  });

  return (
    <div>
      <Card
        page="exploration"
        title="Correlation heatmap"
        content={
          <div className="visual-dropdown form-group">
            <p>
              Each cell in the correlation matrix below displays the correlation
              coefficient between two features.
            </p>
            <p>
              Values close to +1 or -1 indicate a high correlation between the
              features. It is advisable to remove one of them to avoid the
              multicollinearity issue, as this can lead to unreliable regression
              coefficients in your model when dealing with two highly correlated
              features.
            </p>

            {boxPlotData && (
              <div>
                <Plot
                  data={heatMapPlot(
                    boxPlotData.correlation_data[0],
                    boxPlotData.x_features[0]
                  )}
                  layout={layout}
                  config={{ responsive: true }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
                <h5>Features with high correlation :</h5>
                <table
                  id="summary-grid"
                  className="table table-striped table-bordered table-hover"
                >
                  <thead>
                    <tr>
                      <th key={0}>Feature 1</th>
                      <th key={1}>Feature 2</th>
                      <th key={2}>Correlation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boxPlotData.corr_final_data[0].map((dataVal, index) => {
                      return (
                        <tr key={index + 3}>
                          <td key={index + 3 + 100}>{dataVal[0]}</td>
                          <td key={index + 3 + 1000}>{dataVal[1]}</td>
                          <td key={index + 3 + 10000}>{dataVal[2]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        }
      />

      <Card
        page="exploration"
        title="Explore interactions between features"
        content={
          <div>
            <Stack horizontal tokens={{ childrenGap: "16px" }}>
              <Stack.Item styles={{ root: { width: "50%" } }}>
                <Dropdown
                  placeholder="Select value"
                  label="Feature 1"
                  selectedKey={sColumnSelect}
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={(e, o) => {
                    setColumnPlotData(undefined);
                    setColumnSelect(o.key);
                    updateIsNumericalColumn(numericalColumnCheck(o.key));
                    setTriggerColumnChartAPICall(true);
                  }}
                  options={getTargetOptions()}
                  // styles={{dropdown: {width: '50%'}}}
                />
              </Stack.Item>
              <Stack.Item styles={{ root: { width: "50%" } }}>
                <Dropdown
                  placeholder="Select value"
                  label="Feature 2"
                  selectedKey={sModelSelect}
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={(e, o) => {
                    setColumnPlotData(undefined);
                    setModelSelect(o.key);
                    updateIsNumericalModel(numericalColumnCheck(o.key));
                    setTriggerColumnChartAPICall(true);
                  }}
                  options={getTargetOptions()}
                  // styles={{dropdown: {width: '50%'}}}
                />
              </Stack.Item>
            </Stack>
            <Stack.Item
              grow={1}
              key={0}
              style={{ minHeight: "300px" }}
              styles={getStackItemStyles(2)}
            >
              {!!columnPlotData && (
                <Visual
                  config={
                    getColumnChart(
                      columnPlotData,
                      isNumericalColumn,
                      isNumericalModel
                    ).options
                  }
                  width="100%"
                  height="300"
                  type={
                    getColumnChart(
                      columnPlotData,
                      isNumericalColumn,
                      isNumericalModel
                    ).type
                  }
                />
              )}
            </Stack.Item>
          </div>
        }
      />
    </div>
  );
};

export default BivariateAnalysis;
