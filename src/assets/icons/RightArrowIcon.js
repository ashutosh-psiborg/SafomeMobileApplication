import * as React from "react"
import Svg, { Path } from "react-native-svg"

function RightArrowIcon(props) {
  return (
    <Svg
      width={8}
      height={14}
      viewBox="0 0 8 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M.452 12.42l1.061 1.06 5.779-5.777a.996.996 0 000-1.413L1.513.51.453 1.57l5.424 5.425L.452 12.42z"
        fill="#fff"
      />
    </Svg>
  )
}

export default RightArrowIcon
