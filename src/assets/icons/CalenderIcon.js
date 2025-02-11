import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function CalenderIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#clip0_6499_1614)">
        <Path
          d="M21.5 4h-2.667v2A1.467 1.467 0 0115.9 6V4H8.133v2A1.467 1.467 0 115.2 6V4H2.533a1.187 1.187 0 00-1.2 1.207v14.92A1.187 1.187 0 002.5 21.333h19a1.186 1.186 0 001.166-1.206V5.207A1.186 1.186 0 0021.5 4zM6.667 17.333H5.333V16h1.334v1.333zm0-3.333H5.333v-1.333h1.334V14zm0-3.333H5.333V9.333h1.334v1.334zm4 6.666H9.332V16h1.333v1.333zm0-3.333H9.332v-1.333h1.333V14zm0-3.333H9.332V9.333h1.333v1.334zm4 6.666h-1.334V16h1.333v1.333zm0-3.333h-1.334v-1.333h1.333V14zm0-3.333h-1.334V9.333h1.333v1.334zm4 6.666h-1.334V16h1.334v1.333zm0-3.333h-1.334v-1.333h1.334V14zm0-3.333h-1.334V9.333h1.334v1.334z"
          fill="#000"
        />
        <Path
          d="M6.667 6.667A.667.667 0 007.333 6V2A.667.667 0 106 2v4a.667.667 0 00.667.667z"
          fill="#5E6368"
        />
        <Path
          d="M17.334 6.667A.667.667 0 0018 6V2a.667.667 0 10-1.333 0v4a.666.666 0 00.667.667z"
          fill="#000"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_6499_1614">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default CalenderIcon
