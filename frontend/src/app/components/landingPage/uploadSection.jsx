import { PrimaryButton } from "@fluentui/react";
import React from "react";


const Upload = (props) => {
  const inputFileRef = React.useRef(null);

  return (
    <div>
      <PrimaryButton
        style={{ height: "40px", width: "150px" }}
        text={props.title}
        onClick={() => {
          inputFileRef.current.click();
        }}
        styles={props.styles}
      />
      <input
        onChange={(event) => {
          if(event.target.files[0])
          props.getUploadedFile(event.target.files[0])
        }}
        style={{ display: "none" }}
        type="file"
        id="upload-file-input"
        ref={inputFileRef}
      />
    </div>
  );
};

export default Upload;
