export function getHistogramConfig(data, isNumerical) {
  const dataset = isNumerical
    ? data.num_hist_Count[0].counts
    : data.cat_hist_data[0].data;
  const category = isNumerical
    ? data.num_hist_Count[0].Count
    : data.cat_hist_data[0].categories;

  const databox2 = {
    series: [
      {
        name: "PACF",
        data: dataset,
        plotOptions: {
          candlestick: {
            colors: {
              upward: "#351c75",
              downward: "#ffd966",
            },
          },
        },
      },
    ],
    options: {
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        categories: category,
        tickAmount: 30,
      },
      yaxis: {
        title: {
          text: "Count",
        },
        labels: {
          minWidth: 34,
        },
      },
      stroke: {
        curve: "stepline",
      },
      colors: ["#c90076", "#72efc5bf", "#febc3b9e"],
      fill: {
        colors: ["#c90076", "#72efc5bf", "#febc3b9e"],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
    },
    theme: {
      palette: "palette8"
    }
  };

  return databox2;
}

export function getDensityPlotConfig(data) {
  let dataBox = {
    series: [
      {
        data: data[0].y,
      },
    ],
    options: {
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 5,
      },
      xaxis: {
        tickAmount: 30,
        categories: data[0].x,
      },
      yaxis: {
        title: {
          text: "PACF",
        },
        labels: {
          minWidth: 34,
        },
      },
      stroke: {
        curve: "smooth",
      },
      colors: ["#c90076", "#72efc5bf", "#febc3b9e"],
      fill: {
        colors: ["#c90076", "#72efc5bf", "#febc3b9e"],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
    },
  };

  return dataBox;
} 

export function getBoxChartConfig(num_box_data, _num_box_outliers_data) {
  let databox3 = {
    series: [
      {
        type: "boxPlot",
        data: num_box_data[0].data,
      },
    ],
    options: {
      chart: {
        type: "boxPlot",
        height: 350,
      },
      plotOptions: {
        boxPlot: {
          colors: {
            upper: "#3C90EB",
            lower: "#DF7D46",
          },
        },
      },
    },
  };

  return databox3;
}

export function getPieChartConfig(cat_pie_data) {
  let databox3 = {
    series: cat_pie_data[0].series,
    options: {
      chart: {
        type: "pie",
        height: 350,
      },
      labels:  cat_pie_data[0].labels,
      theme: {
        palette: "palette8"
      }
    },
  };

  return databox3;
}

export function getFirstChartConfig(data, isNumerical) {
  const dataset = isNumerical ? data.corr_val[0] : data.cat_topk_esq_val[0];
  const category = isNumerical ? data.corr_col[0] : data.cat_topK_esq_col[0];

  const databox2 = {
    series: [
      {
        name: "PACF",
        data: dataset,
      },
    ],
    options: {
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        categories: category,
        tickAmount: 30,
      },
      yaxis: {
        title: {
          text: "Count",
        },
        labels: {
          minWidth: 34,
        },
      },
      stroke: {
        curve: "stepline",
      },
      colors: ["#ff7373", "#72efc5bf", "#febc3b9e"],
      fill: {
        colors: ["#ff7373", "#72efc5bf", "#febc3b9e"],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
    },
  };

  return databox2;
}

export function getSecondChartConfig(data, isNumerical) {
  const dataset = isNumerical
    ? data.num_topk_esq_val[0]
    : data.topK_cramer_val[0];
  const category = isNumerical
    ? data.num_topK_esq_col[0]
    : data.topK_cramer_col[0];

  const databox2 = {
    series: [
      {
        name: "PACF",
        data: dataset,
      },
    ],
    options: {
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        categories: category,
        tickAmount: 30,
      },
      yaxis: {
        title: {
          text: "Count",
        },
        labels: {
          minWidth: 34,
        },
      },
      stroke: {
        curve: "stepline",
      },
      colors: ["#becc41", "#72efc5bf", "#febc3b9e"],
      fill: {
        colors: ["#becc41", "#72efc5bf", "#febc3b9e"],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
    },
  };

  return databox2;
}
