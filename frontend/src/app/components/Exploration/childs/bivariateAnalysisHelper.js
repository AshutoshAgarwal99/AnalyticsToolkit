export function getHeatMapPlotData(data) {
  let config = {
    series: data[0],
    options: {
      chart: {
        height: 350,
        type: "heatmap",
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 1,
          radius: 0,
          enableShades: false,
          reverseNegativeShade: true,
          colorScale: {
            ranges: [
              {
                from: -1,
                to: -0.5,
                name: "low",
                color: "#00A100",
              },
              {
                from: -0.5,
                to: 0,
                name: "medium",
                color: "#128FD9",
              },
              {
                from: 0,
                to: 0.5,
                name: "high",
                color: "#FFB200",
              },
              {
                from: 0.5,
                to: 1,
                name: "extreme",
                color: "#FF0000",
              },
            ],
          },
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        width: 1,
      },
    },
  };
  
  console.log(data[0])
  return config;
}
export function heatMapPlot(correlation_data,x_features){
  var data = [
    {
      z: correlation_data,
      x: x_features,
      y: x_features,
      type: 'heatmap',
      hoverongaps: false,
      // colorscale: colorscaleValue
    
    }
  ];
  return data;
}
export function getChart(data, isNumericalColumn, isNumericalModel) {
  let dataSet = [];
  if (isNumericalColumn && isNumericalModel)
    dataSet = data.bivariate_data_nn[0];
  else if (isNumericalColumn && !isNumericalModel)
    dataSet = data.bivariate_data_nc[0];
  else if (!isNumericalColumn && isNumericalModel)
    dataSet = data.bivariate_data_cn[0];
  else if (!isNumericalColumn && !isNumericalModel)
    dataSet = data.bivariate_data_cc[0];

  console.log(dataSet);

  var options = {
    series: dataSet,
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
        },
      },
      xaxis: {
        categories: data.catcol1_unq[0],
      },
      legend: {
        position: "right",
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    },
  };

  return options;
}

export function getColumnChart(data, isNumericalColumn, isNumericalModel) {
  let options;
  let type;


  if (isNumericalColumn && isNumericalModel) {
    type = 'scatter',
    options = {
      series: [{
          type: "scatter",
          name: "Scatter",
          data: data.bivariate_data_nn[0].data,
        }],
        options: {
          chart: {
            type: "scatter",
            height: 350,
          },
          xaxis: {
            type: "numeric",
          },
          theme: {
            palette: "palette8"
          }
        },
    }
  }
  else if (isNumericalColumn && !isNumericalModel)
    {
       options = {
        series: [
          {
            type: "boxPlot",
            data: data.bivariate_data_nc[0],
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
          theme: {
            palette: "palette8"
          }
        }
      }
    }
  else if (!isNumericalColumn && isNumericalModel)
    {
      options = {
        series: [
          {
            type: "boxPlot",
            data: data.bivariate_data_cn[0],
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
          theme: {
            palette: "palette8"
          }
        }
      }
    }
  else if (!isNumericalColumn && !isNumericalModel) {
    type = 'bar',
    options = {
      series: data.bivariate_data_cc[0],
      options: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        theme: {
          palette: "palette8"
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
          },
        },
        xaxis: {
          categories: data.catcol1_unq[0],
        },
        legend: {
          position: "right",
          offsetY: 40,
        },
        fill: {
          opacity: 1,
        },
      },
    };
  }
  return {options: options, type: type};
}

