import * as React from "react";
import Svg, { Path } from "react-native-svg";

function DevicesIcon({ color = "#8B8B8B", ...props }) {
  return (
    <Svg
      width={15}
      height={21}
      viewBox="0 0 15 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M4.9 4.5a3 3 0 00-3 3v6a3 3 0 003 3m0-12h6m-6 0v-3h6v3m0 0a3 3 0 013 3v6a3 3 0 01-3 3m0 0h-6m6 0v3h-6v-3"
        stroke={color}  // Use color prop here
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default DevicesIcon;
