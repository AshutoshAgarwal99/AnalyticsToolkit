import React, { useContext, useState } from "react";
import Card from "../../Card.jsx";
import { DataContext } from "../../../contexts/DataContext";
import {
  Dropdown,
  Stack,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Label,
} from "@fluentui/react";

function Classification() {
  const oData = useContext(DataContext);
  const [sSelectedPredictor, setSelectedPredictor] = useState([]);
  const [sSelectedTarget, setSelectedTarget] = useState("");

  const stackTokens = {
    childrenGap: 25,
  };

const _columns = [
    { key: 'column1', name: 'Field', fieldName: 'name', minWidth: 400, maxWidth: 400, isResizable: false, styles: {root:{background: '#0653A0 !important', color: 'white !important'}} },
    { key: 'column2', name: 'Value', fieldName: 'value', minWidth: 200, maxWidth: 200, isResizable: false, styles: {root:{background: '#0653A0 !important', color: 'white !important'}} },
];

const _allItems = [
    {key: 0, name: 'Dep. Variable', value: 'Total Cases'},
    {key: 1, name: 'R-squared', value: 0.477},
    {key: 2, name: 'Model', value: 'OLS'},
    {key: 3, name: 'Adj. R-squared', value: 0.462},
    {key: 4, name: 'Method', value: 'Least Squares'},
    {key: 5, name: 'F-statistic', value: 31.05},
    {key: 6, name: 'Date', value: 'Mon, 23 Aug 2021'},
    {key: 7, name: 'Prob (F-statistic)', value: 0.0000031},
    {key: 8, name: 'Time', value: '10:55:42'},
    {key: 9, name: 'Log-Likelihood', value: -544.95},
    {key: 10, name: 'No. Observations', value: 36},
    {key: 11, name: 'AIC', value: 1094},
    {key: 12, name: 'Df Residuals', value: 34},
    {key: 13, name: 'BIC', value: 1097},
    {key: 14, name: 'Df Model', value: 1},
    {key: 15, name: 'Covariance Type', value: 'nonrobust'},
    {key: 16, name: 'Omnibus', value: 21.947},
    {key: 17, name: 'Durbin-Watson', value: 2.449},
    {key: 18, name: 'Prob(Omnibus)', value: 0},
    {key: 19, name: 'Jarque-Bera (JB)', value: 39.266},
    {key: 20, name: 'Skew', value: 1.503},
    {key: 21, name: 'Prob(JB)', value: 0},
    {key: 22, name: 'Kurtosis', value: 7.14},
    {key: 23, name: 'Cond. No.', value: 33800},
];


function getPredictorOptions() {
    var options = [];
    oData.input_data_columns.forEach((x) => {
        options.push({key: x, text: x});
    });
    // console.log(options);
    return options;
}

function getTargetOptions() {
    var options = [];
    var targetValues = oData.input_data_columns.filter((x) => {
        return sSelectedPredictor.indexOf(x) === -1;
    });
    targetValues.forEach((x) => {
        options.push({key: x, text: x});
    });
    console.log(options);
    return options;
}

function getPredictors() {
    if (sSelectedPredictor.length <= 1) return sSelectedPredictor;
    else {
        let formatted = `${sSelectedPredictor[0]} `;
        sSelectedPredictor.forEach((x, i) => {if (i) formatted = `${formatted} + ${x}`});
        return formatted;
    }
}

  return (
    <div>
      <Card
        page="exploration"
        title="What is Classification?"
        content={
          <div>
            <p>
              Classification is a process of categorizing a given set of data
              into classes, It can be performed on both structured or
              unstructured data. The process starts with predicting the class of
              given data points. The classes are often referred to as target,
              label or categories.
            </p>
            <p>
              The classification predictive modeling is the task of
              approximating the mapping function from input variables to
              discrete output variables. The main goal is to identify which
              class/category the new data will fall into.
            </p>
          </div>
        }
      />

      <Card
        page="exploration"
        title="Select the variables for Regression analysis"
        content={
          <Stack horizontal tokens={stackTokens}>
            <Stack.Item styles={{ root: { width: "50%" } }}>
              <Dropdown
                placeholder="Select value"
                label="Predictor Choices"
                selectedKeys={sSelectedPredictor}
                // eslint-disable-next-line react/jsx-no-bind
                onChange={(e, o) => {
                  // console.log(o);
                  setSelectedTarget("");
                  if (o.selected) {
                    setSelectedPredictor([...sSelectedPredictor, o.key]);
                  } else {
                    let selectedOptions = sSelectedPredictor.filter(
                      (x) => x !== o.key
                    );
                    setSelectedPredictor(selectedOptions);
                  }
                }}
                multiSelect
                options={getPredictorOptions()}
                // styles={{dropdown: {width: '50%'}}}
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
                }}
                options={getTargetOptions()}
                // styles={{dropdown: {width: '50%'}}}
              />
            </Stack.Item>
          </Stack>
        }
      />
    </div>
  );
}

export default Classification;
