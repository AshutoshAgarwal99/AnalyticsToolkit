import axios from "axios";
import Exploration from "./components/Exploration/Exploration.jsx";
import Header from "./components/Header.jsx";
import PreviewTable from "./components/DataPreview/PreviewTable.jsx";
import React, { useState, useEffect } from "react";
import UploadPage from "./components/UploadPage.jsx";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { render } from "react-dom";
import { initializeIcons } from "@fluentui/react";
import LandingPage from "./components/landingPage/landingPage.jsx";

const App = () => {
  initializeIcons();

  // Set base URL for API requests
  if (process.env.NODE_ENV === "prod") {
    // TODO : Set base URL for production
  } else if (process.env.NODE_ENV === "dev") {
    // TODO : Set base URL for development
  } else {
    axios.defaults.baseURL = "http://localhost:5000";
  }

  return (
    <div>
      <Header />
      <Router>
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/upload" exact component={UploadPage} />
          <Route path="/preview" exact component={PreviewTable} />
          <Route path="/exploration" exact component={Exploration} />
        </Switch>
      </Router>
    </div>
  );
};

render(<App />, window.document.getElementById("app"));
