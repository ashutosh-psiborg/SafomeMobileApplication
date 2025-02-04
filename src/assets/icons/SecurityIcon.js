import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SecurityIcon(props) {
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
        d="M16 5L7 9v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V9l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V16H9v-5.7l7-3.11v8.8z"
        fill="#000"
      />
    </Svg>
  )
}

export default SecurityIcon
