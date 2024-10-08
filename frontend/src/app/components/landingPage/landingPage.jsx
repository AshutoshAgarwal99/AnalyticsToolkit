import React from "react";
import { Stack } from "@fluentui/react";
import HomePageContent from "./homePageContent.jsx";
import { getHomePageStackStyles, getStackStyles } from "./landingPageStyles.js";

const LandingPage = () => {
  return (
    <div>
      <Stack className={getStackStyles(true)}>
        <Stack.Item style={getHomePageStackStyles(true)}>
          <HomePageContent />
        </Stack.Item>
      </Stack>
    </div>
  );
};

export default LandingPage;
