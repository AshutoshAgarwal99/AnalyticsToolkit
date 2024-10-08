import React, { useContext, useState } from "react";
import {
  ActionButton,
  Callout,
  Stack,
  Icon,
  Text,
} from "@fluentui/react";

// Header of the application
const Header = () => {
  const [isClicked, setClicked] = useState(false);

  return (
    <Stack
      styles={{
        root: {
          paddingLeft: "10px",
          backgroundColor: "#6c757d63",
          paddingBottom: "8px",
          paddingTop: "6px",
        },
      }}
      tokens={{ childrenGap: 5 }}
    >
      <Stack horizontal>
        <Stack.Item grow={3}>
          <span
            style={{
              fontFamily: "Segoe UI",
              color: "black",
              fontSize: 25,
              paddingLeft: "1%",
              verticalAlign: "top",
            }}
          >
            {/* <Icon style={{ color: '#d54950', verticalAlign: 'bottom', marginRight: '10px', fontSize: '29px' }} iconName='CRMReport'></Icon> */}
            <span
              style={{
                fontFamily: "Segoe UI",
                color: "black",
                fontSize: 22,
                fontWeight: "bold",
              }}
            >
              Analytics Toolkit
            </span>
          </span>
        </Stack.Item>
      </Stack>
    </Stack>
  );
};

export default Header;
