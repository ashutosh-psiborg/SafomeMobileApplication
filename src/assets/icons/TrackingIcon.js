import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function TrackingIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#clip0_4608_9248)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.8 5.629V4h-1.6v1.629a10.4 10.4 0 00-9.57 9.563H4v1.6h1.63a10.416 10.416 0 009.57 9.578V28h1.6v-1.63a10.416 10.416 0 009.57-9.578H28v-1.6h-1.63a10.4 10.4 0 00-9.57-9.563zm0 3.171v6.392h6.4v1.6h-6.4V23.2h-1.6v-6.408H8.8v-1.6h6.4V8.8h1.6z"
          fill="#000"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_4608_9248">
          <Path fill="#fff" transform="translate(4 4)" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default TrackingIcon
