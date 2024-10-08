import {
  MessageBar,
  PrimaryButton,
  MessageBarType,
  Stack,
} from "@fluentui/react";
import globals from "../../globals";
import React from "react";
import {
  getButtonsStyles,
  getDragDropTextStyles,
  getFileNameStyles,
  getHeadingStyles,
  getTextStyles,
  getFileUploadStackStyles,
} from "./landingPageStyles";
import Upload from "./uploadSection";
import axios from "axios";
import { Redirect } from "react-router-dom";

export class UploadArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFile: undefined,
      showExplorationTab: false,
      showError: false,
    };
  }

  onChangeFile = (file) => {
    this.setState({
      inputFile: file,
    });
  };

  onProceedButtonClick = () => {
    var oFormData = new FormData();
    oFormData.append("file", this.state.inputFile);

    var req = {
      url: "/uploader",
      method: "post",
      processData: false,
      contentType: false,
      data: oFormData,
    };

    axios
      .post(req.url, req.data)
      .then((_response) => {
        this.setState({
          showExplorationTab: true,
        });
      })
      .catch((_error) => {
        this.setState({
          showError: true,
        });
      });
  };

  render() {
    return (
      <Stack
        style={getFileUploadStackStyles()}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          this.onChangeFile(event.dataTransfer.files[0]);
        }}
      >
        {this.state.showExplorationTab && <Redirect to="/exploration" />}
        <Stack style={{ justifyContent: "center", alignItems: "center" }}>
          {this.state.showError && (
            <MessageBar
              messageBarType={MessageBarType.error}
              text="Something went wrong!"
            />
          )}
          <span className={getHeadingStyles()}>
            Upload your CSV Data
          </span>
          {this.state.inputFile ? (
            <img
              src={globals.image_path + "uploadSuccess.svg"}
              style={{ width: "max-content", height: "35%", marginTop: "10px" }}
            />
          ) : (
            <img
              src={globals.image_path + "FileIcon.svg"}
              style={{ width: "max-content", height: "35%", marginTop: "5%" }}
            />
          )}
          {this.state.inputFile ? (
            <header className={getFileNameStyles()}>
              <i>{this.state.inputFile.name}</i>
            </header>
          ) : (
            <header className={getDragDropTextStyles()}>
              Drag & drop to upload file
            </header>
          )}
          <p className={getTextStyles()}>
            {this.state.inputFile ? "Uploaded" : "OR"}
          </p>
          {this.state.inputFile ? (
            <Stack
              horizontal
              wrap
              tokens={{ childrenGap: "16" }}
              styles={getButtonsStyles()}
            >
              <PrimaryButton
                style={{
                  height: "40px",
                  width: "150px",
                  backgroundColor: "#0366d6",
                }}
                text="Proceed"
                onClick={() => {
                  this.onProceedButtonClick();
                }}
              />
              <Upload
                title={"Change file"}
                styles={{
                  root: {
                    backgroundColor: "#fff",
                    border: "1px solid #000",
                    color: "#000",
                    marginBottom: "16px",
                  },
                  rootHovered: {
                    backgroundColor: "#fff",
                    border: "1px solid #000",
                    color: "#000",
                  },
                }}
                getUploadedFile={this.onChangeFile}
              />
            </Stack>
          ) : (
            <Upload
              title={"Upload file"}
              styles={{
                root: { marginBottom: "16px", backgroundColor: "#0366d6" },
              }}
              getUploadedFile={this.onChangeFile}
            />
          )}
        </Stack>
      </Stack>
    );
  }
}
