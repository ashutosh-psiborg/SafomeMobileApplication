import * as React from "react"
import Svg, { Path } from "react-native-svg"

function BlueGPSIcon(props) {
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
        d="M20.89 2.006L20.998 2l.13.008.09.016.123.035.107.046.1.057.09.067.082.075.052.059.082.116.052.096c.046.1.076.205.09.316l.005.106c0 .075-.008.149-.024.22l-.035.123-6.532 18.077a1.55 1.55 0 01-2.172.704 1.55 1.55 0 01-.566-.548l-.065-.127-3.352-6.702-6.67-3.336a1.55 1.55 0 01-.898-1.259L1.68 10c0-.56.3-1.072.84-1.37l.14-.07 18.018-6.506.106-.03.107-.018z"
        fill="#0279E1"
      />
    </Svg>
  )
}

export default BlueGPSIcon
