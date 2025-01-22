import * as React from "react"
import Svg, { Path } from "react-native-svg"

function NotificationIcon(props) {
  return (
    <Svg
      width={21}
      height={22}
      viewBox="0 0 21 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.752.914a5.25 5.25 0 004.07 8.333v.011c.015.198.03.401.05.597.237 2.247.777 3.79 1.296 4.803.345.675.684 1.123.924 1.394.105.12.219.231.34.335l.01.006A.75.75 0 0119 17.75H1a.75.75 0 01-.44-1.356l.007-.007.064-.054c.06-.054.157-.145.277-.281.24-.27.58-.718.924-1.393C2.522 13.31 3.25 11.03 3.25 7.4c0-1.881.7-3.694 1.96-5.038C6.472 1.016 8.194.25 10 .25c.383 0 .76.034 1.133.101.238.043 1.018.286 1.62.563z"
        fill="#000"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.25 4a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM7.894 19.351a.75.75 0 011.025.273 1.25 1.25 0 002.162 0 .751.751 0 011.298.753 2.75 2.75 0 01-4.758 0 .75.75 0 01.273-1.026z"
        fill="#FE605D"
      />
    </Svg>
  )
}

export default NotificationIcon
