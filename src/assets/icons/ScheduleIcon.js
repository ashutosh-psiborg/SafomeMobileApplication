import * as React from "react"
import Svg, { Path } from "react-native-svg"

function ScheduleIcon(props) {
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
        d="M13 7V5h6v2h-6zm2 11h2v-6h-2v6zm1 8a8.654 8.654 0 01-3.488-.712A9.161 9.161 0 019.65 23.35a9.221 9.221 0 01-1.937-2.863A8.637 8.637 0 017 17c0-1.233.238-2.396.713-3.488A9.195 9.195 0 019.65 10.65a9.192 9.192 0 012.863-1.937A8.646 8.646 0 0116 8a8.92 8.92 0 012.975.5c.95.333 1.842.817 2.675 1.45l1.4-1.4 1.4 1.4-1.4 1.4a9.724 9.724 0 011.45 2.675c.333.95.5 1.942.5 2.975a8.644 8.644 0 01-.713 3.488 9.194 9.194 0 01-1.937 2.862 9.205 9.205 0 01-2.863 1.938A8.611 8.611 0 0116 26z"
        fill="#000"
      />
    </Svg>
  )
}

export default ScheduleIcon
