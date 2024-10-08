import React from "react";
import globals from "../globals";
import { Link } from "react-router-dom";
import { Stack } from "@fluentui/react";

const Hompage = () => {
  return (
    <div>
      <Stack
        styles={{
          root: {
            paddingLeft: "10px",
            paddingBottom: "8px",
            paddingTop: "6px",
            marginBottom: "26px",
          },
        }}
        tokens={{ childrenGap: 5 }}
      >
        <Stack horizontal>
          <Stack.Item
            grow={3}
            style={{ paddingLeft: "20px", paddingRight: "20px" }}
          >
            <h3
              className="display-5 fw-bolder hero-heading"
              style={{ paddingTop: "30%" }}
            >
              {globals.title}
            </h3>
            <p className="lead">{globals.description}</p>
            <div className="d-flex">
              <Link to="/upload">
                <img
                  className="get-started-btn"
                  src={globals.image_path + "get-started.svg"}
                />
              </Link>
            </div>
            <p className="py-3 pt-0 below-lead">{globals.note}</p>
          </Stack.Item>
          <Stack.Item style={{ paddingRight: "20px" }}>
            <img
              style={{ width: "828px", height: "771px" }}
              className="card-img-top mb-md-0"
              src={globals.image_path + "landingPageImage.svg"}
              alt="..."
            />
          </Stack.Item>
        </Stack>
      </Stack>
    </div>
  );
};

export default Hompage;
