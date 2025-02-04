import * as React from "react"
import Svg, { Path } from "react-native-svg"

function ProfileIcon(props) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 6a10 10 0 0110 10c0 5.523-4.477 10-10 10S6 21.523 6 16 10.477 6 16 6zm1 11h-2a6.001 6.001 0 00-5.518 3.64A7.99 7.99 0 0016 24a7.99 7.99 0 006.518-3.36A6.002 6.002 0 0017 17zm-1-8a3 3 0 100 6 3 3 0 000-6z"
        fill="#000"
      />
    </Svg>
  )
}

export default ProfileIcon
