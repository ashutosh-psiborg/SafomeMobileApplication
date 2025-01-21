import * as React from "react"
import Svg, { Path } from "react-native-svg"

function LocationIcon(props) {
  return (
    <Svg
      width={21}
      height={19}
      viewBox="0 0 21 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.026.604a1.5 1.5 0 01.948 0L13.5 2.446 18.789.683A1.3 1.3 0 0120.5 1.916V15.14a1.5 1.5 0 01-1.026 1.423l-5.5 1.833c-.308.103-.64.103-.948 0L7.5 16.554l-5.289 1.763A1.3 1.3 0 01.5 17.084V3.86a1.5 1.5 0 011.026-1.423l5.5-1.833zM6.5 14.78V2.887l-4 1.334v11.892l4-1.334v.001zm2-11.892V14.78l4 1.334V4.22l-4-1.334v.002zm6 1.334v11.892l4-1.334V2.887l-4 1.335z"
        fill="#8B8B8B"
      />
    </Svg>
  )
}

export default LocationIcon
