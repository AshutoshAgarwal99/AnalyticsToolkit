import axios from "axios";
import Card from "../Card.jsx";
import DataExploration from "./childs/DataExploration.jsx";
import BivariateAnalysis from "./childs/BivariateAnalysis.jsx";
import globals from "../../globals";
import React, { useEffect, useState } from "react";
import SummaryData from "./childs/SummaryData.jsx";
import Table from "../Table.jsx";
import { Redirect } from "react-router-dom";
import { DataContext } from "../../contexts/DataContext";
import Regression from "./childs/Regression.jsx";
import Classification from "./childs/Classification.jsx";
import Clustering from "./childs/Clustering.jsx";
import { ActionButton, Stack, DefaultButton } from "@fluentui/react";

function Exploration() {
  const oPage = {
    sViewSummary: "view-data",
    sUnivariateAnalysis: "univariate-analysis",
    sBivariateAnalysis: "bivariate-analysis",
    sRegression: "regression",
    sClassification: "classification",
    sClustering: "clustering",
  };

  const [oData, setData] = useState();
  const [sPage, setPage] = useState(oPage.sViewSummary);
  const [bUploadNewData, setUploadNewData] = useState(false);
  const [collapseNav, setCollapseNav] = useState(false);
  const [navWidth, setNavWidth] = useState("280px");
  const [sSelectedColumn, setSelectedColumn] = useState("-1");
  const [sSelectedAxis, setSelectedAxis] = useState("-1");
  const [sSelectedModel, setSelectedModel] = useState("additive");

  useEffect(() => {
    axios.get("exploration-data").then((response) => {
      setData(JSON.parse(response.data));
    });
  }, []);

  function getSidebar() {
    return (
      <Stack>
        <Stack.Item align="start">
          <ActionButton
            iconProps={{
              iconName: "NumberedListText",
              style: {
                color: "black",
                fontSize: "24px",
                margin: "5px 5px 4px",
              },
            }}
            onClick={() => {
              if (collapseNav) {
                setCollapseNav(false);
                setNavWidth("280px");
              } else {
                setCollapseNav(true);
                setNavWidth("80px");
              }
            }}
          />
        </Stack.Item>
        <Stack.Item align="auto">
          <ActionButton
            style={
              sPage === oPage.sViewSummary
                ? { fontSize: "16px", fontWeight: 600 }
                : { fontSize: "16px" }
            }
            onClick={() => {
              setPage(oPage.sViewSummary);
            }}
          >
            <img
              style={{
                width: "24px",
                height: "21px",
                marginRight: "8px",
                marginLeft: "9px",
              }}
              className="card-img-top mb-md-0"
              src={globals.image_path + "ViewData.svg"}
              alt="..."
            />
            {collapseNav ? undefined : "View Data"}
          </ActionButton>
        </Stack.Item>
        <Stack.Item align="auto">
          <ActionButton
            style={
              sPage === oPage.sUnivariateAnalysis
                ? { fontSize: "16px", fontWeight: 600 }
                : { fontSize: "16px" }
            }
            onClick={() => {
              setPage(oPage.sUnivariateAnalysis);
            }}
          >
            <img
              style={{
                width: "24px",
                height: "21px",
                marginRight: "8px",
                marginLeft: "9px",
              }}
              className="card-img-top mb-md-0"
              src={globals.image_path + "Univariate.svg"}
              alt="..."
            />
            {collapseNav ? undefined : "Univariate Analysis"}
          </ActionButton>
        </Stack.Item>
        <Stack.Item align="auto">
          <ActionButton
            style={
              sPage === oPage.sBivariateAnalysis
                ? { fontSize: "16px", fontWeight: 600 }
                : { fontSize: "16px" }
            }
            onClick={() => {
              setPage(oPage.sBivariateAnalysis);
            }}
          >
            <img
              style={{
                width: "24px",
                height: "21px",
                marginRight: "8px",
                marginLeft: "9px",
              }}
              className="card-img-top mb-md-0"
              src={globals.image_path + "Bivariate.svg"}
              alt="..."
            />
            {collapseNav ? undefined : "Bivariate Analysis"}
          </ActionButton>
        </Stack.Item>
        <Stack.Item align="auto">
          <ActionButton
            style={
              sPage === oPage.sClustering
                ? { fontSize: "16px", fontWeight: 600 }
                : { fontSize: "16px" }
            }
            onClick={() => {
              setPage(oPage.sClustering);
            }}
          >
            <img
              style={{
                width: "24px",
                height: "21px",
                marginRight: "8px",
                marginLeft: "9px",
              }}
              className="card-img-top mb-md-0"
              src={globals.image_path + "Clustering.svg"}
              alt="..."
            />
            {collapseNav ? undefined : "Clustering"}
          </ActionButton>
        </Stack.Item>
      </Stack>
    );
  }

  function getTabComponent() {
    switch (sPage) {
      case oPage.sViewSummary:
        return (
          <SummaryData
            setColumn={setSelectedColumn}
            columnName={sSelectedColumn}
            setAxis={setSelectedAxis}
            axisName={sSelectedAxis}
            expanded={collapseNav}
          />
        );
      case oPage.sUnivariateAnalysis:
        return (
          <DataExploration
            columnName={sSelectedColumn}
            modelName={sSelectedModel}
            setModel={setSelectedModel}
          />
        );
      case oPage.sClustering:
        return <Clustering />;
      case oPage.sBivariateAnalysis:
        return (
          <BivariateAnalysis
            columnName={sSelectedColumn}
            modelName={sSelectedModel}
            setModel={setSelectedModel}
          />
        );
    }
  }

  if (bUploadNewData) {
    return <Redirect to="/upload" />;
  } else {
    return (
      <Stack
        styles={{ root: { minHeight: "92vh" } }}
        horizontal
        horizontalAlign={"space-between"}
      >
        <Stack.Item
          styles={{
            root: {
              minWidth: navWidth,
              borderRight: "1px solid #E1DFDD",
              backgroundColor: "#FFF",
              paddingLeft: "15px",
            },
          }}
          align="auto"
        >
          {getSidebar()}
        </Stack.Item>
        <Stack.Item
          styles={{
            root: {
              paddingLeft: "16px",
              paddingTop: "16px",
              paddingRight: "16px",
            },
          }}
          align="auto"
          grow={2}
        >
          <DataContext.Provider value={oData}>
            {getTabComponent()}
          </DataContext.Provider>
        </Stack.Item>
      </Stack>
    );
  }
}

export default Exploration;
