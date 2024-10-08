import React, { useContext, useEffect, useState } from "react";
import Card from "../../Card.jsx";
import axios from "axios";
import Visual from "../../Visual.jsx";
import { DataContext } from "../../../contexts/DataContext";
import {
  Dropdown,
  Stack,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Label,
  ScreenWidthMaxLarge,
  ScreenWidthMinMedium,
  ScreenWidthMinUhfMobile,
  ScreenWidthMinXLarge,
  ScreenWidthMinXXLarge,
} from "@fluentui/react";
import {
  getColumnNames,
  getResidualFittedChartConfig,
  getRows,
} from "./regressionHelper.js";

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


function Regression(props) {
  const oData = useContext(DataContext);
  const [sSelectedPredictor, setSelectedPredictor] = useState([
    oData.cat_cols[0],
    oData.cat_cols[1],
  ]);
  const [sSelectedTarget, setSelectedTarget] = useState(oData.numerical_col[0]);
  const [regressionData, setRegression] = useState(undefined);
  const [triggerAPICall, setTriggerAPICall] = useState(true);
  useEffect(() => {
    if (triggerAPICall) {
      var oFormData = new FormData();
      oFormData.append("column", sSelectedPredictor);
      oFormData.append("column2", sSelectedTarget);

      axios.post("Regression", oFormData).then((response) => {
        setRegression(JSON.parse(response.data));
        console.log(JSON.parse(response.data));
      });
      setTriggerAPICall(false);
    }
  });

  const stackTokens = {
    childrenGap: 8,
  };

  function getPredictorOptions() {
    var options = [];
    oData.input_data_columns.forEach((x) => {
      options.push({ key: x, text: x });
    });
    return options;
  }

  function getTargetOptions() {
    var options = [];
    var targetValues = oData.input_data_columns.filter((x) => {
      return sSelectedPredictor.indexOf(x) === -1;
    });
    targetValues.forEach((x) => {
      options.push({ key: x, text: x });
    });
    return options;
  }

  function getPredictors() {
    if (sSelectedPredictor.length <= 1) return sSelectedPredictor;
    else {
      let formatted = `${sSelectedPredictor[0]} `;
      sSelectedPredictor.forEach((x, i) => {
        if (i) formatted = `${formatted} + ${x}`;
      });
      return formatted;
    }
  }

  return (
    <React.Fragment>
      <Card
        page="exploration"
        title="Select the variables for Regression analysis"
        content={
          <Stack tokens={stackTokens}>
            <p>
              Regression quantifies the relationship between one or more
              predictor variable(s) and one outcome variable. Regression is
              commonly used for predictive analysis and modeling. For example,
              it can be used to quantify the relative impacts of age, gender,
              and diet (the predictor variables) on height (the outcome
              variable). Regression is also known as Multiple Regression,
              Multivariate Regression, Ordinary Least Squares (OLS), and Linear
              Regression.
            </p>
            <Stack horizontal style={{ marginTop: "0px" }} tokens={stackTokens}>
              <Stack.Item styles={{ root: { width: "50%" } }}>
                <Dropdown
                  placeholder="Select value"
                  label="Predictor Choices"
                  selectedKeys={sSelectedPredictor}
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={(e, o) => {
                    if (o.selected) {
                      setSelectedPredictor([...sSelectedPredictor, o.key]);
                    } else {
                      let selectedOptions = sSelectedPredictor.filter(
                        (x) => x !== o.key
                      );
                      setSelectedPredictor(selectedOptions);
                    }
                    setTriggerAPICall(true);
                  }}
                  multiSelect
                  options={getPredictorOptions()}
                />
              </Stack.Item>
              <Stack.Item styles={{ root: { width: "50%" } }}>
                <Dropdown
                  placeholder="Select value"
                  label="Target feature"
                  selectedKey={sSelectedTarget}
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={(e, o) => {
                    setSelectedTarget(o.key);
                    setTriggerAPICall(true);
                  }}
                  options={getTargetOptions()}
                />
              </Stack.Item>
            </Stack>
            <h5>Model summary and performance metrics</h5>
            {regressionData && (
              <div>
                <Stack.Item>
                  <Label>
                    Regression Equation : {sSelectedTarget} ~ {getPredictors()}
                  </Label>
                </Stack.Item>
                <Stack.Item>
                  <DetailsList
                    items={getRows(
                      regressionData.table2_columns[0],
                      regressionData.table2_values[0]
                    )}
                    columns={getColumnNames(regressionData.table2_columns[0])}
                    layoutMode={DetailsListLayoutMode.justified}
                    selectionMode={SelectionMode.none}
                  />
                </Stack.Item>
                <Stack.Item>
                  <h5>Warnings:</h5>
                  {regressionData.warnings[0].map((warning) => {
                    return <span>{warning}</span>;
                  })}
                </Stack.Item>
              </div>
            )}
          </Stack>
        }
      />

      <Card
        page="exploration"
        title="Understanding the model metrics"
        content={
          <div>
            {!!regressionData && (
              <Stack horizontal tokens={{ childrenGap: "16px" }}>
                <Stack.Item
                  grow={1}
                  key={0}
                  style={{ minHeight: "300px" }}
                  styles={getStackItemStyles(2)}
                >
                  <Visual
                    config={getResidualFittedChartConfig(
                      regressionData.fit_vs_residual[0]
                    )}
                    width="100%"
                    height="300"
                    type={"line"}
                  />
                </Stack.Item>
                
              </Stack>
            )}
          </div>
        }
      />
    </React.Fragment>
  );
}

export default Regression;
