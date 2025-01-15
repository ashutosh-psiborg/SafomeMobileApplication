import * as React from "react"
import Svg, { Path } from "react-native-svg"

function BackIcon(props) {
  return (
    <Svg
      width={12}
      height={24}
      viewBox="0 0 12 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.343 12l7.072 7.071L9 20.485l-7.778-7.778a1 1 0 010-1.414L9 3.515l1.415 1.414L3.343 12z"
        fill="#000"
      />
    </Svg>
  )
}

export default BackIcon
