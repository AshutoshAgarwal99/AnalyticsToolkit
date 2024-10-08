import { mergeStyles, Stack } from "@fluentui/react";
import React from "react";
import { UploadArea } from "./uploadArea";
import globals from "../../globals";

const leftContainer = mergeStyles({
  width: "calc(50% - 16px)",
});

const HomePageContent = () => {
  return (
    <Stack
      horizontal
      style={{
        height: "100%",
      }}
      horizontalAlign="space-between"
      wrap
      // tokens={{ childrenGap: 16 }}
    >
      <Stack.Item
        style={{ paddingTop: "16px" }}
        className={`${leftContainer} left-container`}
      >
        <Stack>
          <span
            style={{
              fontSize: "36px",
              fontWeight: 600,
              lineHeight: "1",
            }}
          >
            Welcome to Analytics Toolkit
          </span>
          <p style={{ marginTop: "16px", fontSize: "18px" }}>
            A comprehensive platform for generating data summaries, conducting
            exploratory data analysis, and building both supervised and
            unsupervised machine learning models.
          </p>
          <Stack.Item>
            <img
              src={globals.image_path + "ToolkitLanding.png"}
              height="95%"
              width="95%"
            />
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item style={{ height: "100%" }} className={leftContainer}>
        <UploadArea />
      </Stack.Item>
    </Stack>
  );
};

export default HomePageContent;
