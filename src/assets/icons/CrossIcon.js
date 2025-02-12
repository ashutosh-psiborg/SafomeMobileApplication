import * as React from "react"
import Svg, { Path } from "react-native-svg"

function CrossIcon(props) {
  return (
    <Svg
      width={25}
      height={24}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M18.86 19.78l-6.36-6.37-6.36 6.37-1.42-1.42L11.09 12 4.72 5.64l1.42-1.42 6.36 6.37 6.36-6.36 1.41 1.41L13.91 12l6.36 6.36-1.41 1.42z"
        fill="#000"
      />
    </Svg>
  )
}

export default CrossIcon
