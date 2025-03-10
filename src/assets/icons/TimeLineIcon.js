import * as React from "react"
import Svg, { Rect } from "react-native-svg"

function TimeLineIcon(props) {
  return (
    <Svg
      width={24}
      height={25}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect x={0.5} y={0.638672} width={23} height={23} rx={11.5} fill="#fff" />
      <Rect
        x={0.5}
        y={0.638672}
        width={23}
        height={23}
        rx={11.5}
        stroke="#FF310C"
      />
      <Rect x={6} y={6.13867} width={12} height={12} rx={6} fill="#FF310C" />
    </Svg>
  )
}

export default TimeLineIcon
