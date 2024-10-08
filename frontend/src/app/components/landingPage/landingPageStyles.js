import { IStackStyles, mergeStyles } from "@fluentui/react";
import React from "react";

export const getStackStyles = (showHomePage) => {
  const stackStyles = mergeStyles({
    margin: "16px auto 0 auto",
    paddingBottom: "12px",
    height: showHomePage ? "80vh" : "100%",
    "@media(max-width: 768px)": {
      height: "100%",
    },
  });

  return stackStyles;
};

export const getButtonsStyles = () => {
  const stackStyles = {
    inner: {
      justifyContent: "center",
    },
    root: {
      marginBottom: "16px",
    },
  };

  return stackStyles;
};

export const getHeadingStyles = () => {
  const stackStyles = mergeStyles({
    fontWeight: 700,
    fontSize: "1.7vw",
    color: "#000",
    paddingTop: "16px",
    "@media(max-width: 1439px)": {
      fontSize: "17.5px",
    },
    "@media(max-width: 830px)": {
      fontSize: "16px",
    },
    "@media(max-width: 425px)": {
      fontSize: "14.5px",
    },
  });

  return stackStyles;
};

export const getFileNameStyles = () => {
  const stackStyles = mergeStyles({
    color: "#000",
    paddingTop: "3px",
    fontSize: "1.3vw",
    fontWeight: 500,
    "@media(max-width: 768px)": {
      fontSize: "16px",
    },
  });

  return stackStyles;
};

export const getDragDropTextStyles = () => {
  const stackStyles = mergeStyles({
    color: "#000",
    paddingTop: "16px",
    fontSize: "1.3vw",
    fontWeight: 500,
    "@media(max-width: 768px)": {
      fontSize: "16px",
    },
  });

  return stackStyles;
};

export const getTextStyles = () => {
  const stackStyles = mergeStyles({
    color: "#000",
    paddingTop: "5%",
    fontSize: "1.3vw",
    "@media(max-width: 768px)": {
      fontSize: "16px",
    },
  });

  return stackStyles;
};

export const getHomePageStackStyles = (
  showHomePage
) => {
  return {
    padding: showHomePage ? "16px" : "0",
    backgroundColor: "#fff",
    height: "100%",
    minHeight: "400px",
    borderRadius: "12px 12px 12px 12px",
    margin: '0 16px'
  };
};

export const getFileUploadStackStyles = () => {
  return {
    backgroundColor: "#F8FBFD",
    height: "100%",
    border: `5px dashed #D6E5F0`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
};
