import React from "react";
import globals from "../globals";

// Card component to resue in different pages
const Card = (props) => {
  return props.page === "exploration" ? (
    <div className="card" style={{paddingRight: '16px'}}>
      <div className="card-body" style={{padding: '16px 0 0 16px', display: 'grid'}}>
        <h4 className="header-title">{props.title}</h4>
        <div className="fs-5">
          <span></span>
        </div>
        <div className={props.hideHorizontalScroll ? "" : "horizontal-scroll"}>{props.content}</div>
      </div>
    </div>
  ) : (
    <div
      className="card upload-option"
      onClick={() => {
        props.toggleButtonStyle
          ? props.toggleButtonStyle("upload-option", props.name)
          : null;
      }}
      style={
        props.pos == "right" ? { marginLeft: "60px", marginRight: "0px" } : {}
      }
    >
      <img
        className="card-img-top img-in-card"
        src={globals.image_path + props.image}
        alt="Upload image cap"
      />
      <div className="card-body">
        <p className="card-text">
          {props.action === "upload-data"
            ? "Upload Your Data"
            : "Use Sample Data"}
        </p>
      </div>
    </div>
  );
};

export default Card;
