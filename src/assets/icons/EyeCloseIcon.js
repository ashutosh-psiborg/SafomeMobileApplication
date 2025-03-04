import * as React from "react"
import Svg, { Path } from "react-native-svg"

function EyeCloseIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M3 10a13.4 13.4 0 003 2.685m0 0a11.3 11.3 0 004 1.625c1.321.254 2.679.254 4 0a11.3 11.3 0 004-1.625m-12 0L4.5 14.5M21 10a13.4 13.4 0 01-3 2.685m0 0l1.5 1.815m-9.5-.191L9.5 16.5m4.5-2.191l.5 2.191"
        stroke="#0B1326"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default EyeCloseIcon
