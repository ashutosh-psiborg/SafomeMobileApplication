import * as React from "react"
import Svg, { Path } from "react-native-svg"

function BlueHomeIcon(props) {
  return (
    <Svg
      width={19}
      height={18}
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M17.3 16V7.5a1 1 0 00-.4-.8l-7-5.25a1 1 0 00-1.2 0l-7 5.25a1 1 0 00-.4.8V16a1 1 0 001 1h4a1 1 0 001-1v-3a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 001 1h4a1 1 0 001-1z"
        fill="#0279E1"
        stroke="#0279E1"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default BlueHomeIcon
