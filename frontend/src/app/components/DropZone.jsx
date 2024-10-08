import React from "react";

// Dropzone to uplaod the file
const DropZone = (props) => {
  return (
    <div id="upload-file-form" className="row mt-4 py-2 d-none">
      <div className="col-12 d-flex justify-content-center">
        <div className="droparea-btn-container">
          <div className="drag-area">
            <div className="icon">
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            <header style={{color:"#212529"}}>Drag & Drop to Upload File</header>
            <span>OR</span>
            <button>Browse File</button>
            <input type="file" hidden />
          </div>
          <button
            id="proceed-button"
            className="btn"
            onClick={() => {
              props.proceed();
            }}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropZone;
