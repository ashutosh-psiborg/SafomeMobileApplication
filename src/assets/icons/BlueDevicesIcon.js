import * as React from "react"
import Svg, { Path } from "react-native-svg"

function BlueDevicesIcon(props) {
  return (
    <Svg
      width={15}
      height={20}
      viewBox="0 0 15 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M10.9 0a1 1 0 011 1v2.126c1.726.445 3 2.01 3 3.874v6a4 4 0 01-3 3.874V19a1 1 0 01-1 1h-6a1 1 0 01-1-1v-2.126A4 4 0 01.9 13V7a4 4 0 013-3.874V1a1 1 0 011-1h6zm-1 17h-4v1h4v-1zm0-15h-4v1h4V2z"
        fill="#0279E1"
      />
    </Svg>
  )
}

export default BlueDevicesIcon
