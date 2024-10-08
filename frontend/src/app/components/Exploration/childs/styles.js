import {
  ScreenWidthMaxLarge,
  ScreenWidthMinMedium,
  ScreenWidthMinUhfMobile,
  ScreenWidthMinXLarge,
  ScreenWidthMinXXLarge,
} from "@fluentui/react";

export const stackStyles = {
  backgroundColor: "white",
  marginTop: "4px",
  margin: "16px",
  paddingBottom: "16px",
};

export const getStackItemStyles = (size) => {
  let widthContainer = {
    maxWidth: "calc(50% - 16px)",
    minWidth: "calc(100% - 16px)",
    maxLargeWidth: "calc(100%",
    minMobileLargeWidth: "calc(100% - 16px)",
    minXLargeWidth: "calc(50% - 16px)",
    minMediumWidth: "300px",
  };

  if (size == 2) {
    widthContainer = {
      maxWidth: "calc(100% - 16px)",
      minWidth: "calc(100% - 16px)",
      maxLargeWidth: "calc(100% - 16px)",
      minMobileLargeWidth: "calc(100% - 16px)",
      minXLargeWidth: "calc(100% - 16px)",
      minMediumWidth: "calc(100% - 16px)",
    };
  }

  return {
    root: {
      minWidth: widthContainer.minWidth,
      maxWidth: widthContainer.maxWidth,
      selectors: {
        [`@media(max-width: ${ScreenWidthMinMedium}px)`]: {
          minWidth: widthContainer.minMediumWidth,
        },
        [`@media(max-width: ${ScreenWidthMinUhfMobile - 1}px)`]: {
          minWidth: widthContainer.minMobileLargeWidth,
        },
        [`@media(min-width: ${ScreenWidthMinXXLarge}px)`]: {
          minWidth: widthContainer.minXLargeWidth,
        },
        [`@media(max-width: ${ScreenWidthMaxLarge}px)`]: {
          maxWidth: widthContainer.maxLargeWidth,
        },
        [`@media(max-width: ${ScreenWidthMinXLarge - 1}px)`]: {
          minWidth: widthContainer.minMobileLargeWidth,
        },
      },
    },
  };
};
