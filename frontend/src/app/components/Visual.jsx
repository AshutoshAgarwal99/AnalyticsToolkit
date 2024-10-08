import React from "react";
import ReactApexChart from "react-apexcharts";

// Component to create visual in exploration page
const Visual = (props) => {
  return (
    <div>
      <h5>{props.heading}</h5>
      {props.subHeading}
      <ReactApexChart
        options={props.config.options}
        series={props.config.series}
        type={props.type}
        width={props.width}
        height={props.height}
      />
    </div>
  );
};

export default Visual;
