import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SleepIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M27 16h-6v-2l3.39-4H21V8h6v2l-3.38 4H27v2zm-8 4h-6v-2l3.39-4H13v-2h6v2l-3.38 4H19v2zm-8 4H5v-2l3.39-4H5v-2h6v2l-3.38 4H11v2z"
        fill="#000"
      />
    </Svg>
  )
}

export default SleepIcon
