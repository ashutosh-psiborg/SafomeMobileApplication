import * as React from "react"
import Svg, { Path } from "react-native-svg"

function AppleIcon(props) {
  return (
    <Svg
      width={22}
      height={24}
      viewBox="0 0 22 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M17.733 23.04c-1.306 1.267-2.733 1.067-4.106.467-1.454-.614-2.787-.64-4.32 0-1.92.826-2.934.586-4.08-.467C-1.28 16.333-.32 6.12 7.067 5.747c1.8.093 3.053.986 4.106 1.066 1.574-.32 3.08-1.24 4.76-1.12 2.014.16 3.534.96 4.534 2.4-4.16 2.494-3.174 7.974.64 9.507-.76 2-1.747 3.987-3.387 5.453l.013-.013zM11.04 5.667C10.84 2.693 13.253.24 16.027 0c.386 3.44-3.12 6-4.987 5.667z"
        fill="#000"
      />
    </Svg>
  )
}

export default AppleIcon
