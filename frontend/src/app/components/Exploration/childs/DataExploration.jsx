import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../../../contexts/DataContext";
import { v4 as uuid4 } from "uuid";
import axios from "axios";
import Visual from "../../Visual.jsx";
import Card from "../../Card.jsx";
import { Stack, Slider } from "office-ui-fabric-react";
import stackStyles, { getStackItemStyles } from "./styles.js";
import {
  getHistogramConfig,
  getBoxChartConfig,
  getPieChartConfig,
  getFirstChartConfig,
  getSecondChartConfig,
  getDensityPlotConfig,
} from "./univariateHelper.js";

const DataExploration = (props) => {
  const oData = useContext(DataContext);
  const [sColumnSelect, setColumnSelect] = useState(
    oData.input_data_columns[0]
  );
  const [sSlider1, setSlider1] = useState(oData.numerical_col.length);
  const [sSlider2, setSlider2] = useState(oData.cat_cols.length);

  const [uniVariateAnaysisData, setUniVariateAnaysisData] = useState(undefined);
  const [
    uniVariateExplorationAnaysisData,
    setUniVariateExplorationAnaysisData,
  ] = useState(undefined);
  const [isNumericalColumn, setColumnType] = useState(undefined);
  const [triggerAPICall, setTriggerAPICall] = useState(true);
  const [triggerExplorationAPICall, setTriggerExplorationAPICall] =
    useState(true);

  useEffect(() => {
    if (triggerAPICall) {
      var oFormData = new FormData();
      oFormData.append("column", sColumnSelect);
      oFormData.append("column2", sColumnSelect);

      axios.post("UniVariateAnaysis", oFormData).then((response) => {
        setUniVariateAnaysisData(JSON.parse(response.data));
      });

      setTriggerAPICall(false);
    }
    if (triggerExplorationAPICall) {
      var oFormData = new FormData();
      oFormData.append("column", sColumnSelect);
      oFormData.append("slider1", sSlider1);
      oFormData.append("slider2", sSlider2);

      axios
        .post("UniVariateAnaysis_Association", oFormData)
        .then((response) => {
          setUniVariateExplorationAnaysisData(JSON.parse(response.data));
        });

      setTriggerExplorationAPICall(false);
    }
  });

  return (
    <div>
      <Card
        page="exploration"
        title="Distribution analysis of the data."
        hideHorizontalScroll
        content={
          <div className="visual-dropdown form-group">
            This section allows you to visualize data distributions, with chart
            types adjusting based on the selected feature.
            <br />
            <b>Select a feature:</b>
            <select
              id="model-select"
              className="form-select"
              style={{
                marginBottom: "16px",
                padding: "4px 8px",
                fontSize: "14px",
              }}
              aria-label="Default select"
              value={sColumnSelect}
              onChange={(e) => {
                setUniVariateAnaysisData(undefined);
                setColumnSelect(e.target.value);
                if (oData.cat_cols.find((x) => x == e.target.value)) {
                  setColumnType(false);
                } else {
                  setColumnType(true);
                }

                setTriggerAPICall(true);
                setTriggerExplorationAPICall(true);
              }}
            >
              <option value="-1" selected disabled hidden>
                Select a Value
              </option>
              {oData
                ? oData.input_data_columns.map((col) => (
                    <option key={uuid4()} value={col}>
                      {col}
                    </option>
                  ))
                : null}
            </select>
            <Stack
              style={stackStyles}
              horizontal
              tokens={{ childrenGap: "16px" }}
              wrap
            >
              {uniVariateAnaysisData && (
                <Stack.Item grow={1} key={0} styles={getStackItemStyles(1)}>
                  <Visual
                    config={getHistogramConfig(
                      uniVariateAnaysisData,
                      isNumericalColumn
                    )}
                    type="area"
                    width="100%"
                    height="300"
                    heading="Histogram :"
                    subHeading={
                      <div>
                        The data is segmented into buckets (ranges), with the
                        range dynamically adjusted based on the dataset.
                        <br />
                        X-Axis : Lower limit of the data ranges
                        <br></br>
                        <p>Y-Axis : Count of records falling in each bucket</p>
                      </div>
                    }
                  />
                </Stack.Item>
              )}
              {uniVariateAnaysisData && isNumericalColumn && (
                <Stack.Item grow={1} key={1} styles={getStackItemStyles(1)}>
                  <div>
                    <Visual
                      config={getDensityPlotConfig(
                        uniVariateAnaysisData.num_dist_data
                      )}
                      heading={"Density Plot :"}
                      subHeading={
                        <div>
                          {" "}
                          <p>
                            Shows the probability density function of the
                            feature
                          </p>
                          X-Axis : Value of the feature
                          <br></br>
                          <p>
                            Y-Axis : Probability density function for the kernel
                            density estimation
                          </p>
                        </div>
                      }
                      type="line"
                      width="100%"
                      height="300"
                    />
                  </div>
                </Stack.Item>
              )}
              {uniVariateAnaysisData && isNumericalColumn && (
                <Stack.Item grow={1} key={3} styles={getStackItemStyles(2)}>
                  <Visual
                    heading="Box Plot :"
                    subHeading={
                      <div>
                        <p>
                          Shows the probability density function of the feature
                        </p>
                        X-Axis : Value of the feature
                        <br></br>
                        <p>
                          Y-Axis : Probability density function for the kernel
                          density estimation
                        </p>
                      </div>
                    }
                    config={getBoxChartConfig(
                      uniVariateAnaysisData.num_box_data,
                      uniVariateAnaysisData.num_box_outliers_data
                    )}
                    type="boxPlot"
                    width="100%"
                    height="300"
                  />
                </Stack.Item>
              )}
              {uniVariateAnaysisData && !isNumericalColumn && (
                <Stack.Item grow={1} key={4} styles={getStackItemStyles(1)}>
                  <Visual
                    heading="Pie Chart:"
                    subHeading="The total area of the chart represents 100% of the selected feature's data, while each pie slice corresponds to the percentage share of individual parts within the data."
                    config={getPieChartConfig(
                      uniVariateAnaysisData.cat_pie_data
                    )}
                    type="pie"
                    width="100%"
                    height="300"
                  />
                </Stack.Item>
              )}
            </Stack>
          </div>
        }
      />

      <Card
        page="exploration"
        title="Explore associations"
        hideHorizontalScroll
        content={
          <div>
            <p>
              This section lets you analyze how a feature is associated with
              others in the dataset. Features are ranked based on linear
              relationships with reference feature. The plots show the top n
              features associated with a selected feature. The value of n can be
              adjusted for each of the plots individually
            </p>
            {uniVariateExplorationAnaysisData && (
              <Stack
                style={stackStyles}
                horizontal
                tokens={{ childrenGap: "16px" }}
                wrap
              >
                <Stack.Item grow={1} key={2} styles={getStackItemStyles(1)}>
                  <Slider
                    min={0}
                    value={sSlider1}
                    label="Select the number of numerical features:"
                    max={oData.numerical_col.length}
                    onChange={(value) => {
                      setSlider1(value);
                      setTriggerExplorationAPICall(true);
                    }}
                  />
                  <Visual
                    config={getFirstChartConfig(
                      uniVariateExplorationAnaysisData,
                      isNumericalColumn
                    )}
                    type="bar"
                    width="100%"
                    height="300"
                    heading="Associated numerical features:"
                    subHeading="This section allows you to examine the relationships between a feature and others in the dataset. Features are ranked according to their linear relationships with a reference feature. The plots display the top n features related to the selected feature, with the value of n adjustable for each individual plot."
                  />
                </Stack.Item>
                <Stack.Item grow={1} key={5} styles={getStackItemStyles(1)}>
                  <Slider
                    min={0}
                    value={sSlider2}
                    max={oData.cat_cols.length}
                    label="Select the number of categorical features:"
                    onChange={(value) => {
                      setSlider2(value);
                      setTriggerExplorationAPICall(true);
                    }}
                  />
                  <Visual
                    config={getSecondChartConfig(
                      uniVariateExplorationAnaysisData,
                      isNumericalColumn
                    )}
                    type="bar"
                    width="100%"
                    height="300"
                    heading="Associated categorical features:"
                    subHeading="The selected feature is categorical. The Cramér's V value is calculated between the selected feature and all other categorical features, and the results are ranked based on their values."
                  />
                </Stack.Item>
              </Stack>
            )}
          </div>
        }
      />
    </div>
  );
};

export default DataExploration;
