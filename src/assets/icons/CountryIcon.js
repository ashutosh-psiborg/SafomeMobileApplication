import * as React from "react"
import Svg, { Path } from "react-native-svg"

function CountryIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm2 11.4l-1.564 1.251a.5.5 0 00-.041.744l1.239 1.239a2 2 0 01.508.864l.175.613a1.801 1.801 0 001.017 1.163 8 8 0 002.533-1.835l-.234-1.877a2 2 0 00-1.09-1.54l-1.47-.736A1 1 0 0014 13.4zM12 4a7.99 7.99 0 00-6.335 3.114l-.165.221V9.02a3 3 0 001.945 2.809l.178.06 1.29.395c1.373.42 2.71-.697 2.577-2.096l-.019-.145-.175-1.049a1 1 0 01.656-1.108l.108-.03.612-.14a2.667 2.667 0 001.989-3.263A8 8 0 0012 4z"
        fill="#000"
      />
    </Svg>
  )
}

export default CountryIcon
