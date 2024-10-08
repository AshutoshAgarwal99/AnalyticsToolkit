import React, { useContext, useState } from "react";
import Card from "../../Card.jsx";
import { DataContext } from "../../../contexts/DataContext";
import Visual from "../../Visual.jsx";
import { v4 as uuid4 } from "uuid";
import {
  Dropdown,
  Stack,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Label,
} from "@fluentui/react";

const stackTokens = {
  childrenGap: 25,
};

let dataBox = {
  series: [
    {
      name: "Desktops",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
    },
  ],
  options: {
    dataLabels: {
      enabled: false,
    },
    title: {
      text: "The Silhouette Method showing the optimal k ",
      align: "center",
    },
    markers: {
      size: 5,
    },
    xaxis: {
      tickAmount: 5,
    },
    yaxis: {
      labels: {
        minWidth: 34,
      },
    },
    stroke: {
      curve: "straight",
    },
    colors: ["#2694da", "#72efc5bf", "#febc3b9e"],
    tooltip: {
      shared: true,
      intersect: false,
    },
  },
};

let dataBox4 = {
  series: [
    {
      name: "Desktops",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
    },
  ],
  options: {
    dataLabels: {
      enabled: false,
    },
    title: {
      text: "Silhouette plot after PCA",
      align: "left",
    },
    markers: {
      size: 5,
    },
    xaxis: {
      tickAmount: 5,
    },
    yaxis: {
      labels: {
        minWidth: 34,
      },
    },
    stroke: {
      curve: "straight",
    },
    colors: ["#2694da", "#72efc5bf", "#febc3b9e"],
    tooltip: {
      shared: true,
      intersect: false,
    },
  },
};

function generateDayWiseTimeSeries(baseval, count, yrange) {
  var i = 0;
  var series = [];
  while (i < count) {
    var y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push([baseval, y]);
    baseval += 86400000;
    i++;
  }
  return series;
}

let dataBox2 = {
  series: [
    {
      name: "TEAM 1",
      data: generateDayWiseTimeSeries(
        new Date("11 Feb 2017 GMT").getTime(),
        20,
        {
          min: 10,
          max: 60,
        }
      ),
    },
    {
      name: "TEAM 2",
      data: generateDayWiseTimeSeries(
        new Date("11 Feb 2017 GMT").getTime(),
        20,
        {
          min: 10,
          max: 60,
        }
      ),
    },
    {
      name: "TEAM 3",
      data: generateDayWiseTimeSeries(
        new Date("11 Feb 2017 GMT").getTime(),
        30,
        {
          min: 10,
          max: 60,
        }
      ),
    },
    {
      name: "TEAM 4",
      data: generateDayWiseTimeSeries(
        new Date("11 Feb 2017 GMT").getTime(),
        10,
        {
          min: 10,
          max: 60,
        }
      ),
    },
    {
      name: "TEAM 5",
      data: generateDayWiseTimeSeries(
        new Date("11 Feb 2017 GMT").getTime(),
        30,
        {
          min: 10,
          max: 60,
        }
      ),
    },
  ],
  options: {
    chart: {
      height: 350,
      type: "scatter",
      zoom: {
        type: "xy",
      },
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: "Scatter Matrix",
      align: "left",
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      max: 70,
    },
  },
};

let dataBox5 = {
  series: [
    {
      name: "TEAM 1",
      data: generateDayWiseTimeSeries(
        new Date("11 Feb 2017 GMT").getTime(),
        20,
        {
          min: 10,
          max: 60,
        }
      ),
    },
    {
      name: "TEAM 2",
      data: generateDayWiseTimeSeries(
        new Date("11 Feb 2017 GMT").getTime(),
        20,
        {
          min: 10,
          max: 60,
        }
      ),
    },
    {
      name: "TEAM 3",
      data: generateDayWiseTimeSeries(
        new Date("11 Feb 2017 GMT").getTime(),
        30,
        {
          min: 10,
          max: 60,
        }
      ),
    },
    {
      name: "TEAM 4",
      data: generateDayWiseTimeSeries(
        new Date("11 Feb 2017 GMT").getTime(),
        10,
        {
          min: 10,
          max: 60,
        }
      ),
    },
    {
      name: "TEAM 5",
      data: generateDayWiseTimeSeries(
        new Date("11 Feb 2017 GMT").getTime(),
        30,
        {
          min: 10,
          max: 60,
        }
      ),
    },
  ],
  options: {
    chart: {
      height: 350,
      type: "scatter",
      zoom: {
        type: "xy",
      },
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: "Scatter Matrix plot after PCA",
      align: "left",
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      max: 70,
    },
  },
};

function Clustering() {
  const oData = useContext(DataContext);
  const [sSelectedPredictor, setSelectedPredictor] = useState([]);
  const [sSelectedTarget, setSelectedTarget] = useState("");

  function getPredictorOptions() {
    var options = [];
    oData.input_data_columns.forEach((x) => {
      options.push({ key: x, text: x });
    });
    // console.log(options);
    return options;
  }

  return (
    <div>
      <Card
        page="exploration"
        title="What is Clustering?"
        content={
          "Clustering involves partitioning a population or data points into distinct groups, where data points within the same group are more similar to each other than to those in other groups. In simpler terms, the goal is to group data with similar characteristics into clusters."
        }
      />

      <Card
        page="exploration"
        title="Select the variables for clustering"
        content={
          <Stack tokens={stackTokens}>
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

            {sSelectedPredictor.length > 0 && (
              <React.Fragment>
                <Visual
                  config={dataBox}
                  type="line"
                  width="100%"
                  height="300"
                />
                The ideal number of cluster for this dataset is: 9.
              </React.Fragment>
            )}

            {sSelectedPredictor.length > 0 && (
              <React.Fragment>
                <Visual
                  config={dataBox5}
                  type="scatter"
                  width="100%"
                  height="300"
                />
              </React.Fragment>
            )}
          </Stack>
        }
      />
      {sSelectedPredictor.length > 0 && (
        <Card
          page="exploration"
          title="Principal Component Analysis"
          content={
            <div>
              <p>
                The main idea of principal component analysis (PCA) is to reduce
                the dimensionality of a data set consisting of many variables
                correlated with each other, either heavily or lightly, while
                retaining the variation present in the dataset, up to the
                maximum extent.
              </p>
              <p>
                The same is done by transforming the variables to a new set of
                variables, which are known as the principal components (or
                simply, the PCs) and are orthogonal, ordered such that the
                retention of variation present in the original variables
                decreases as we move down in the order.
              </p>
              <p>
                In this way, the 1st principal component retains maximum
                variation that was present in the original components.
              </p>

              <Stack tokens={stackTokens}>
                {sSelectedPredictor.length > 0 && (
                  <React.Fragment>
                    <Visual
                      config={dataBox4}
                      type="line"
                      width="100%"
                      height="300"
                    />
                    The ideal number of cluster for this dataset is: 9.
                  </React.Fragment>
                )}

                {sSelectedPredictor.length > 0 && (
                  <React.Fragment>
                    <Visual
                      config={dataBox5}
                      type="scatter"
                      width="100%"
                      height="300"
                    />
                  </React.Fragment>
                )}
              </Stack>
            </div>
          }
        />
      )}
    </div>
  );
}

export default Clustering;
