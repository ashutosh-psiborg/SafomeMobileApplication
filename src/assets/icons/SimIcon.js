import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SimIcon(props) {
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
        d="M24 8a2 2 0 00-2-2h-8l-6 6v12a2 2 0 002 2h12a2 2 0 002-2V8zM13 23h-2v-2h2v2zm8 0h-2v-2h2v2zm-8-4h-2v-4h2v4zm4 4h-2v-4h2v4zm0-6h-2v-2h2v2zm4 2h-2v-4h2v4z"
        fill="#000"
      />
    </Svg>
  )
}

export default SimIcon
