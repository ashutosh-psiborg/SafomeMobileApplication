import * as React from "react"
import Svg, { Path } from "react-native-svg"

function BlueLocationIcon(props) {
  return (
    <Svg
      width={21}
      height={18}
      viewBox="0 0 21 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 2.054c-.065 1.642 0 11.973 0 11.973.161 0 .32.026.474.077l5.526 1.842V3.973a1.5 1.5 0 01-.474-.077L7.5 2.054zM7.026.104a1.5 1.5 0 01.948 0L13.5 1.946 18.789.183A1.3 1.3 0 0120.5 1.416V14.64a1.5 1.5 0 01-1.026 1.423l-5.5 1.833c-.308.103-.64.103-.948 0L7.5 16.054l-5.289 1.763A1.3 1.3 0 01.5 16.584V3.36a1.5 1.5 0 011.026-1.423l5.5-1.833z"
        fill="#0279E1"
      />
    </Svg>
  )
}

export default BlueLocationIcon
