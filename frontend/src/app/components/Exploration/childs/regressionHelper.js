export function getColumnNames(data) {
  let columns = [];

  if (data) {
    data.forEach((dataVal, index) => {
      const column = {
        key: `column${index}`,
        name: dataVal,
        fieldName: dataVal,
        minWidth: 80,
        maxWidth: 100,
        isResizable: true,
        styles: {
          root: { background: "#0653A0 !important", color: "white !important" },
        },
      };

      columns.push(column);
    });
  }
  return columns;
}

export function getRows(columns, rows) {
  let _allItems = { key: 0 };

  columns.forEach((column, index) => {
    _allItems = { ..._allItems, [`${column}`]: rows[0][index] };
  });

  return [_allItems];
}

export function getResidualFittedChartConfig(data) {
  var options = {
    series: [
      {
        name: "Points",
        type: "scatter",
        data: data[0].data,
      },
      {
        name: "Line",
        type: "line",
        data: data[1].data,
      },
    ],
    options: {
    chart: {
      height: 350,
      type: "line",
    },
    fill: {
      type: "solid",
    },
    markers: {
      size: [6, 0],
    },
    tooltip: {
      shared: false,
      intersect: true,
    },
    legend: {
      show: true,
    },
    xaxis: {
      type: "numeric",
      min: 0,
      max: 12,
      tickAmount: 12,
    },
  }
  };

  return options;
}
