import * as React from "react"
import Svg, { Path } from "react-native-svg"

function AddressIcon(props) {
  return (
    <Svg
      width={12}
      height={15}
      viewBox="0 0 12 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M10.243 1.978C7.9-.327 4.101-.327 1.758 1.978a5.835 5.835 0 000 8.348L6 14.499l4.243-4.173a5.835 5.835 0 000-8.348zM6 8.124a1.877 1.877 0 010-3.75 1.877 1.877 0 010 3.75z"
        fill="#0279E1"
      />
    </Svg>
  )
}

export default AddressIcon
