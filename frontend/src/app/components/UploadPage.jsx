import axios from "axios";
import Card from "./Card.jsx";
import DropZone from "./DropZone.jsx";
import globals from "../globals";
import Modal from "./Modal.jsx";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

// Uplaod file page
const UploadPage = () => {
  const [bRedirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!bRedirect) {
      var oUploadBody = document.getElementById("upload-body");
      var oForm = document.getElementById("upload-file-form");
      var oUploadOptions = document.getElementsByClassName("upload-option");
      for (var i = 0; i < oUploadOptions.length; i++) {
        oUploadOptions[i].onclick = () => {
          adjustUploadBody(); // shift contents up and make them small to adjust dropzone within the page without scrool.
        };
      }

      // Adjust the cards when click on upload your data, to show the dropzone
      const adjustUploadBody = () => {
        oUploadBody.style.marginTop = "2rem";
        let oUploadOptionRow = document.getElementById("upload-option-row");
        oUploadOptionRow.classList.remove("mt-5");
        oUploadOptionRow.classList.add("mt-2");
        oForm.classList.remove("d-none");
        for (var index = 0; index < oUploadOptions.length; index++) {
          oUploadOptions[index].style.height = "12rem";
          oUploadOptions[index].style.width = "12rem";
        }
      };

      // ------- code to implemnt drag and drop --------
      const oProceedButton = document.getElementById("proceed-button");
      const oDropArea = document.querySelector(".drag-area"),
        oDragText = oDropArea.querySelector("header"),
        oButton = oDropArea.querySelector("button"),
        oInput = oDropArea.querySelector("input");
      const uploadedView = '<i class="bi bi-check-circle"></i>';
      oButton.onclick = () => {
        oInput.click(); //if user click on the button then the Input also clicked
      };
      oInput.addEventListener("change", () => {
        //getting user select file and [0] this means if user select multiple files then we'll select only the first one
        oFile = oInput.files[0];
        if (!checkFileType(oFile)) {
          return;
        }
        oDropArea.classList.add("active");
        oProceedButton.disabled = false;
        showFile(); //calling function
      });
      //If user Drag File Over DropArea
      oDropArea.addEventListener("dragover", (event) => {
        event.preventDefault(); //preventing from default behaviour
        oDropArea.classList.add("active");
        oProceedButton.disabled = false;
        oDragText.textContent = "Release to Upload File";
      });
      //If user leave dragged File from DropArea
      oDropArea.addEventListener("dragleave", () => {
        resetDropzone();
      });
      //If user drop File on DropArea
      oDropArea.addEventListener("drop", (event) => {
        event.preventDefault();
        //getting user select file and [0] this means if user select multiple files then we'll select only the first one
        oFile = event.dataTransfer.files[0];
        if (!checkFileType()) {
          resetDropzone();
          return;
        }
        oInput.value = "";
        showFile();
      });

      // Change text inside the dropzone when user drops a file
      const showFile = () => {
        let text = "File Uploaded " + oFile.name + ". Re-Drag to Change";
        oDragText.textContent = text;
        oDropArea.style.border = "none";
        oDropArea.style.borderRadius = "10px";
        oDropArea.style.boxShadow = "rgb(0 0 0 / 16%) 0px 10px 10px";
      };

      // --------code to check type of file being uploaded--------

      // Returns the extension of file
      const getExtension = () => {
        var parts = oFile.name.split(".");
        return parts[parts.length - 1];
      };

      // check if file extension is valid or not.
      const isValidExt = () => {
        var ext = getExtension();
        switch (ext.toLowerCase()) {
          case "csv":
          case "tsv":
            //etc
            return true;
        }
        return false;
      };

      // Check if the file size is less than 10 MB.
      const isValidSize = () => {
        var iSize = oFile.size;
        if (iSize > 10000000) {
          return false;
        }
        return true;
      };

      // check if file is valid or not
      const checkFileType = () => {
        if (!isValidExt() || !isValidSize()) {
          var myModal = document.getElementById("exampleModal");
          var triggerButton = document.getElementById("modal-btn");
          document.getElementById("error-div").textContent =
            "Please upload only csv/tsv files with size less than 10 MB.";
          triggerButton.click();
          oFile = undefined;
          return false;
        }
        return true;
      };
    }
  });

  // Function to reset the dropzone
  const resetDropzone = () => {
    const oDropArea = document.querySelector(".drag-area");
    const oDragText = oDropArea.querySelector("header");
    const oProceedButton = document.getElementById("proceed-button");
    oDropArea.classList.remove("active");
    oDragText.textContent = "Drag & Drop to Upload File";
    oProceedButton.disabled = true;
  };

  // --------code to submit file to server and to take user to exploration tab--------
  const proceed = () => {
    var oFormData = new FormData();
    oFormData.append("file", oFile);

    var req = {
      url: "/uploader",
      method: "post",
      processData: false,
      contentType: false,
      data: oFormData,
    };

    axios
      .post(req.url, req.data)
      .then((response) => {
        setRedirect(true);
      })
      .catch((error) => {
        resetDropzone();
        var myModal = document.getElementById("exampleModal");
        var triggerButton = document.getElementById("modal-btn");
        document.getElementById("error-div").textContent =
          "Something went wrong!!";
        triggerButton.click();
      });
  };
  var oFile; // global variable to store file object

  // Changes style of button(card) when clicked
  const toggleButtonStyle = (className, iconName) => {
    document.getElementsByClassName(className)[0].style.backgroundColor =
      "#2295a2";
    document.querySelector("." + className + " .card-text").style.color =
      "#fff";
    document.querySelector("." + className + " .card-img-top").src =
      globals.image_path + "upload-data.svg";
  };

  if (bRedirect) {
    return <Redirect to="/exploration" />;
  } else {
    return (
      <div>
        <section id="upload-body">
          <div className="container" style={{backgroundColor: '#fff', padding: '16px', boxShadow: "#000000 0px 1.6px 6.6px 0px, rgb(0 0 0 / 11%) 0px 0.3px 0.9px 0px", borderRadius: '17px'}}>
            <div>
              <h2 className="upload-page-heading">
                Choose one of the options to Generate Insights
              </h2>
            </div>
            <div
              className="row gx-4 gy-4 mt-5 justify-content-sm-center"
              id="upload-option-row"
            >
              <div className="col-sm-auto">
                <Card
                  page="uploadData"
                  pos="left"
                  action="upload-data"
                  image="upload-data-dark.svg"
                  toggleButtonStyle={toggleButtonStyle}
                  name="upload"
                />
              </div>
              <div className="col-sm-auto">
                <Card
                  page="uploadData"
                  pos="right"
                  action="use-sample-data"
                  image="sample-data-dark.svg"
                  name="sample"
                />
              </div>
            </div>
            <DropZone proceed={proceed} />
          </div>
        </section>
        <button
          type="button"
          id="modal-btn"
          className="btn btn-primary d-none"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Launch modal
        </button>

        <Modal />
      </div>
    );
  }
};

export default UploadPage;
