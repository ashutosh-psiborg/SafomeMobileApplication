import * as React from "react"
import Svg, { Path } from "react-native-svg"

function DownArrowIcon(props) {
  return (
    <Svg
      width={14}
      height={8}
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M1.58.452L.52 1.513l5.777 5.779a.996.996 0 001.413 0l5.78-5.779-1.06-1.06-5.425 5.424L1.58.452z"
        fill="#000"
      />
    </Svg>
  )
}

export default DownArrowIcon
